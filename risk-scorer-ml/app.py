import os, json
from typing import List, Optional, Literal, Any, Dict

import numpy as np
import pandas as pd
import joblib

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# config n paths
load_dotenv()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# model/schema paths
MODEL_PATH = os.getenv("MODEL_PATH") or os.path.join(BASE_DIR, "evrs_miss_next_model_170.pkl")
if not os.path.exists(MODEL_PATH):
    # fallbacks
    for alt in ["evrs_miss_next_model.pkl", "evrs_miss_next_model (1).pkl", "evrs_miss_next_model .pkl"]:
        cand = os.path.join(BASE_DIR, alt)
        if os.path.exists(cand):
            MODEL_PATH = cand
            break

SCHEMA_PATH = os.getenv("SCHEMA_PATH") or os.path.join(BASE_DIR, "evrs_feature_schema.json")

# business knobs
HORIZON_DAYS = int(os.getenv("HORIZON_DAYS", "120"))
HIGH_THR     = float(os.getenv("HIGH_THR", "0.50"))
MED_THR      = float(os.getenv("MED_THR",  "0.35"))

# since no use,might remove this later
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB  = os.getenv("MONGO_DB")
CIT_COLL  = os.getenv("CITIZENS_COLL", "citizens")
VAX_COLL  = os.getenv("VACCINATIONS_COLL", "vaccinations")

# sklearn 1.6.1 - 1.7.0
try:
    import sklearn.compose._column_transformer as _ct
    if not hasattr(_ct, "_RemainderColsList"):
        class _RemainderColsList(list):
            """Compatibility alias to unpickle 1.6.1 ColumnTransformer state."""
            pass
        _ct._RemainderColsList = _RemainderColsList
except Exception:
    pass

# app init
app = FastAPI(title="EVRS Miss-Next Vaccine Scorer", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
)

# load model + schema
try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load model from {MODEL_PATH}: {e}")

try:
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema = json.load(f)
except Exception as e:
    raise RuntimeError(f"Failed to read schema from {SCHEMA_PATH}: {e}")

if "input_columns" not in schema or not isinstance(schema["input_columns"], dict):
    raise RuntimeError("Schema file missing 'input_columns' mapping.")

EXPECTED_COLS = [c for c in schema["input_columns"].keys() if c != "y_missed"]

# will remove mongo stuff later if no use
mongo_client = None
db = None

@app.on_event("startup")
async def startup():
    global mongo_client, db
    if MONGO_URI:
        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            mongo_client = AsyncIOMotorClient(MONGO_URI)
            db = mongo_client[MONGO_DB]
        except Exception as exc:
            print(f"[startup] Mongo disabled (reason: {exc})")
            mongo_client = None
            db = None

@app.on_event("shutdown")
async def shutdown():
    if mongo_client:
        mongo_client.close()

# pydantic payloads
class Citizen(BaseModel):
    citizenId: str
    birthDate: Optional[str] = None
    district: Optional[str] = None
    division: Optional[str] = None
    bloodType: Optional[str] = None
    allergies: Optional[List[str]] = None
    medicalConditions: Optional[List[str]] = None
    guardianPhone: Optional[str] = None
    guardianEmail: Optional[str] = None
    hospitalId: Optional[str] = None
    mohId: Optional[str] = None
    # vaccination slots (ascending by date)
    v1Code: Optional[str] = None; v1Date: Optional[str] = None; v1Location: Optional[str] = None; v1HcpId: Optional[str] = None
    v2Code: Optional[str] = None; v2Date: Optional[str] = None; v2Location: Optional[str] = None; v2HcpId: Optional[str] = None
    v3Code: Optional[str] = None; v3Date: Optional[str] = None; v3Location: Optional[str] = None; v3HcpId: Optional[str] = None
    v4Code: Optional[str] = None; v4Date: Optional[str] = None; v4Location: Optional[str] = None; v4HcpId: Optional[str] = None

class ScoreRequest(BaseModel):
    events: List[Citizen]
    mode: Literal["latest","all"] = "latest"

# helpers
def _parse_date(x: Optional[str]):
    if not x:
        return None
    try:
        return pd.to_datetime(x)
    except Exception:
        return None

def _has_val(x: Optional[str]) -> int:
    if not x:
        return 0
    s = str(x).strip()
    return 1 if len(s) >= 5 else 0

def _canon(s: Optional[str]) -> str:
    return (str(s).strip() if s is not None else "Unknown")

def _canon_upper(s: Optional[str]) -> str:
    return (str(s).strip().upper() if s is not None else "Unknown")

def _canon_title(s: Optional[str]) -> str:
    return (str(s).strip().title() if s is not None else "Unknown")

def _tier(p: float) -> str:
    if p >= HIGH_THR:
        return "High"
    if p >= MED_THR:
        return "Medium"
    return "Low"

def _engineer_events_from_wide(c: Citizen, mode: str) -> List[Dict[str, Any]]:
    """Build index-dose events from wide v1..v4 for a citizen."""
    doses = []
    for i in range(1, 5):
        doses.append({
            "n": i,
            "code": getattr(c, f"v{i}Code"),
            "date": _parse_date(getattr(c, f"v{i}Date")),
            "loc":  getattr(c, f"v{i}Location"),
            "hcp":  getattr(c, f"v{i}HcpId"),
        })

    # Select index positions
    idx_positions: List[int] = []
    if mode == "all":
        idx_positions = [1, 2, 3]
    else:
        for n in [3, 2, 1]:
            if doses[n-1]["date"] is not None:
                idx_positions = [n]
                break
        if not idx_positions:
            return []

    out: List[Dict[str, Any]] = []
    for n in idx_positions:
        cur = doses[n-1]
        if cur["date"] is None:
            continue

        rec: Dict[str, Any] = {
            "citizenId": c.citizenId,
            "dose_number": n,
            "index_v_code": _canon_upper(cur["code"]) if cur["code"] else None,
            "index_v_date": cur["date"],

            "index_loc": _canon(cur["loc"]),
            "index_hcp": _canon_upper(cur["hcp"]),

            "district":  _canon_title(c.district),
            "division":  _canon_title(c.division),
            "bloodType": _canon_upper(c.bloodType),
            "hospitalId": _canon_upper(c.hospitalId),
            "mohId":      _canon_upper(c.mohId),

            # engineered
            "age_days": None,
            "index_month": int(cur["date"].month),
            "index_dow":   int(cur["date"].dayofweek),
            "has_phone": _has_val(c.guardianPhone),
            "has_email": _has_val(c.guardianEmail),
            "prev_gap_days": None,

            "same_hospitalId_as_prev": 0,
            "same_mohId_as_prev": 0,
            "same_index_loc_as_prev": 0,
            "same_index_hcp_as_prev": 0,

            "allergy_count": 0,
            "condition_count": 0,
        }

        birth = _parse_date(c.birthDate)
        if birth is not None:
            rec["age_days"] = int((cur["date"] - birth).days)

        prev = doses[n-2] if n >= 2 else None
        if prev and prev["date"] is not None:
            rec["prev_gap_days"] = (cur["date"] - prev["date"]).days
            rec["same_index_loc_as_prev"] = int(bool(prev["loc"] and cur["loc"] and _canon(prev["loc"]) == _canon(cur["loc"])))
            rec["same_index_hcp_as_prev"] = int(bool(prev["hcp"] and cur["hcp"] and _canon_upper(prev["hcp"]) == _canon_upper(cur["hcp"])))

        alls = [a.strip().lower() for a in (c.allergies or []) if a]
        mcs  = [m.strip().lower() for m in (c.medicalConditions or []) if m]
        rec["allergy_count"]   = len(alls)
        rec["condition_count"] = len(mcs)

        out.append(rec)

    return out

def _complete_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Add any expected columns the model saw during training, with safe defaults; cast types."""
    for col, _dtype in schema["input_columns"].items():
        if col == "y_missed":
            continue
        if col not in df.columns:
            if col == "citizenId":
                df[col] = ""
            elif col == "index_v_date":
                df[col] = pd.NaT
            elif col in ["dose_number","age_days","prev_gap_days","index_month","index_dow"]:
                df[col] = np.nan
            elif col in ["district","division","bloodType","hospitalId","mohId","index_v_code","index_loc","index_hcp"]:
                df[col] = "Unknown"
            elif col.startswith(("allergy_", "cond_", "same_")) or col in ["has_phone","has_email","allergy_count","condition_count"]:
                df[col] = 0
            else:
                df[col] = np.nan

    ordered = [c for c in EXPECTED_COLS if c in df.columns]
    df = df[ordered]

    # cast numerics cleanly
    num_like = {
        "dose_number","age_days","prev_gap_days","index_month","index_dow",
        "has_phone","has_email","allergy_count","condition_count",
        "same_hospitalId_as_prev","same_mohId_as_prev","same_index_loc_as_prev","same_index_hcp_as_prev",
    }
    for c in (set(num_like) & set(df.columns)):
        df[c] = pd.to_numeric(df[c], errors="coerce")

    if "index_v_date" in df.columns:
        df["index_v_date"] = pd.to_datetime(df["index_v_date"], errors="coerce")

    return df

def _score_dataframe(df_events: pd.DataFrame) -> List[Dict[str, Any]]:
    df_events = _complete_columns(df_events.copy())
    # build X
    X = df_events[[c for c in df_events.columns if c != "y_missed"]]
    probs = model.predict_proba(X)[:, 1]

    out: List[Dict[str, Any]] = []
    for (_, r), p in zip(df_events.iterrows(), probs):
        due_by = None
        if pd.notna(r.get("index_v_date", pd.NaT)):
            due_by = (r["index_v_date"] + pd.Timedelta(days=HORIZON_DAYS)).date().isoformat()

        t = _tier(float(p))
        out.append({
            "citizenId": r.get("citizenId"),
            "dose_number": int(r["dose_number"]) if pd.notna(r.get("dose_number")) else None,
            "index_v_code": r.get("index_v_code"),
            "index_v_date": r["index_v_date"].date().isoformat() if pd.notna(r.get("index_v_date")) else None,
            "risk_prob": float(p),
            "risk_tier": t,
            "due_by": due_by,
            "recommended_action": {"High":"Call + WhatsApp + SMS", "Medium":"WhatsApp + SMS", "Low":"SMS"}[t],
        })
    return out

# routes
@app.get("/health")
def health():
    import sklearn
    return {
        "ok": True,
        "horizon_days": HORIZON_DAYS,
        "high_threshold": HIGH_THR,
        "med_threshold": MED_THR,
        "sklearn": sklearn.__version__,
        "model_path": MODEL_PATH,
        "schema_path": SCHEMA_PATH,
    }

@app.post("/score/events")
def score_events(req: ScoreRequest):
    if not req.events:
        raise HTTPException(status_code=400, detail="No events provided")
    rows: List[Dict[str, Any]] = []
    for c in req.events:
        rows.extend(_engineer_events_from_wide(c, req.mode))
    if not rows:
        return {"results": []}
    df = pd.DataFrame(rows)
    results = _score_dataframe(df)
    return {"results": results}

@app.post("/score/events_debug")
def score_events_debug(req: ScoreRequest):
    if not req.events:
        raise HTTPException(status_code=400, detail="No events provided")
    rows: List[Dict[str, Any]] = []
    for c in req.events:
        rows.extend(_engineer_events_from_wide(c, req.mode))
    if not rows:
        return {"features": []}
    df = pd.DataFrame(rows)
    df = _complete_columns(df)
    return {
        "features": df.to_dict(orient="records"),
        "n_features": len(df.columns),
        "columns": list(df.columns),
    }

@app.get("/score/area")
async def score_area(
    district: str = Query(...),
    division: Optional[str] = Query(None),
    limit: int = Query(200, ge=1, le=5000),
    mode: Literal["latest","all"] = Query("latest"),
):
    if db is None:
        raise HTTPException(status_code=500, detail="Mongo not configured")

    # build pipeline- citizens in area + first 4 vaccinations by date
    match = {"district": district}
    if division:
        match["division"] = division

    pipeline = [
        {"$match": match},
        {"$limit": limit},
        {"$lookup": {
            "from": VAX_COLL,
            "let": {"cid": "$_id"},
            "pipeline": [
                {"$match": {"$expr": {"$eq": ["$citizenId", "$$cid"]}}},
                {"$sort": {"v_date": 1}},
                {"$limit": 4},
            ],
            "as": "vax"
        }},
        {"$project": {
            "_id": 0,
            "citizenId": {"$toString": "$_id"},
            "birthDate": 1, "district": 1, "division": 1, "bloodType": 1,
            "allergies": 1, "medicalConditions": 1,
            "guardianPhone": 1, "guardianEmail": 1,
            "hospitalId": 1, "mohId": 1,
            "vax": 1
        }}
    ]

    docs = await db[CIT_COLL].aggregate(pipeline).to_list(length=limit)

    payload: List[Citizen] = []
    for d in docs:
        vax = d.get("vax", []) or []
        record: Dict[str, Any] = {
            "citizenId": d.get("citizenId"),
            "birthDate": d.get("birthDate"),
            "district": d.get("district"),
            "division": d.get("division"),
            "bloodType": d.get("bloodType"),
            "allergies": d.get("allergies", []),
            "medicalConditions": d.get("medicalConditions", []),
            "guardianPhone": d.get("guardianPhone"),
            "guardianEmail": d.get("guardianEmail"),
            "hospitalId": d.get("hospitalId"),
            "mohId": d.get("mohId"),
        }
        for i, vx in enumerate(vax[:4], start=1):
            record[f"v{i}Code"]     = vx.get("v_code")
            record[f"v{i}Date"]     = vx.get("v_date")
            record[f"v{i}Location"] = vx.get("location")
            record[f"v{i}HcpId"]    = vx.get("hcp_id")
        payload.append(Citizen(**record))

    rows: List[Dict[str, Any]] = []
    for c in payload:
        rows.extend(_engineer_events_from_wide(c, mode))
    if not rows:
        return {"results": []}
    df = pd.DataFrame(rows)
    results = _score_dataframe(df)
    return {"results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=int(os.getenv("PORT", "8081")), reload=True)
