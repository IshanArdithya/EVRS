import os
import json
from typing import List, Optional, Literal, Any, Dict

import numpy as np
import pandas as pd
import joblib

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# config and paths
load_dotenv()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# model and schema paths
MODEL_PATH = os.getenv("MODEL_PATH") or os.path.join(BASE_DIR, "evrs_miss_next_model_xgb_tuned_calibrated.pkl")

SCHEMA_PATH = os.getenv("SCHEMA_PATH") or os.path.join(BASE_DIR, "evrs_feature_schema_xgb_tuned.json")

HORIZON_DAYS = int(os.getenv("HORIZON_DAYS", "120"))
HIGH_THR = float(os.getenv("HIGH_THR", "0.65"))
MED_THR = float(os.getenv("MED_THR", "0.35"))

# app init
app = FastAPI(title="EVRS Miss-Next Vaccine Scorer (XGBoost)", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# load model and schema
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
    v1Code: Optional[str] = None
    v1Date: Optional[str] = None
    v1Location: Optional[str] = None
    v1HcpId: Optional[str] = None
    v2Code: Optional[str] = None
    v2Date: Optional[str] = None
    v2Location: Optional[str] = None
    v2HcpId: Optional[str] = None
    v3Code: Optional[str] = None
    v3Date: Optional[str] = None
    v3Location: Optional[str] = None
    v3HcpId: Optional[str] = None
    v4Code: Optional[str] = None
    v4Date: Optional[str] = None
    v4Location: Optional[str] = None
    v4HcpId: Optional[str] = None

class ScoreRequest(BaseModel):
    events: List[Citizen]
    mode: Literal["latest", "all"] = "latest"

# helper func
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
            "loc": getattr(c, f"v{i}Location"),
            "hcp": getattr(c, f"v{i}HcpId"),
        })

    # select index positions
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
            "district": _canon_title(c.district),
            "division": _canon_title(c.division),
            "bloodType": _canon_upper(c.bloodType),
            "hospitalId": _canon_upper(c.hospitalId),
            "mohId": _canon_upper(c.mohId),
            "age_days": None,
            "index_month": int(cur["date"].month),
            "index_dow": int(cur["date"].dayofweek),
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
        mcs = [m.strip().lower() for m in (c.medicalConditions or []) if m]
        rec["allergy_count"] = len(alls)
        rec["condition_count"] = len(mcs)

        # one hot encoded allergy and condition features
        for tok in ["gelatin", "eggs", "yeast", "latex", "peanuts"]:
            rec[f"allergy_{tok}"] = int(tok in alls)
        for tok in ["asthma", "epilepsy", "congenital_heart", "eczema"]:
            rec[f"cond_{tok}"] = int(tok in mcs)

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
            elif col in ["dose_number", "age_days", "prev_gap_days", "index_month", "index_dow"]:
                df[col] = np.nan
            elif col in ["district", "division", "bloodType", "hospitalId", "mohId", "index_v_code", "index_loc", "index_hcp"]:
                df[col] = "Unknown"
            elif col.startswith(("allergy_", "cond_", "same_")) or col in ["has_phone", "has_email", "allergy_count", "condition_count"]:
                df[col] = 0
            else:
                df[col] = np.nan

    ordered = [c for c in EXPECTED_COLS if c in df.columns]
    df = df[ordered]

    num_like = {
        "dose_number", "age_days", "prev_gap_days", "index_month", "index_dow",
        "has_phone", "has_email", "allergy_count", "condition_count",
        "same_hospitalId_as_prev", "same_mohId_as_prev", "same_index_loc_as_prev", "same_index_hcp_as_prev",
        "allergy_gelatin", "allergy_eggs", "allergy_yeast", "allergy_latex", "allergy_peanuts",
        "cond_asthma", "cond_epilepsy", "cond_congenital_heart", "cond_eczema"
    }
    for c in (set(num_like) & set(df.columns)):
        df[c] = pd.to_numeric(df[c], errors="coerce")

    if "index_v_date" in df.columns:
        df["index_v_date"] = pd.to_datetime(df["index_v_date"], errors="coerce")

    return df

def _score_dataframe(df_events: pd.DataFrame) -> List[Dict[str, Any]]:
    df_events = _complete_columns(df_events.copy())
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
            "recommended_action": {"High": "Call + WhatsApp + SMS", "Medium": "WhatsApp + SMS", "Low": "SMS"}[t],
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

@app.post("/score")
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=int(os.getenv("PORT", "8081")), reload=True)