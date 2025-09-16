# Electronic Vaccination Record System
The Electronic Vaccination Record System is a full-stack web application designed to manage vaccination records and assess vaccination risks for citizens in Sri Lanka. The system supports five user roles: Citizen, Admin, Healthcare Provider, Hospital, and MOH (Ministry of Health). It integrates a machine learning model to predict vaccination adherence risks and provides actionable recommendations.

## Structure
- `client/`: Next.js frontend with React.
- `server/`: Node.js/Express backend.
- `risk-scorer-ml/`: FastAPI backend for machine learning risk scoring.

## Prerequisites
- Node.js and npm
- Python
- MongoDB

## Cloning the Repository
Clone the repository to your machine:
```
git clone https://github.com/IshanArdithya/EVRS.git
cd evrs
```
## Setting Up the Web Client (Frontend)
1. Navigate to the `client` directory:
```
cd client
```
2. Install dependencies:
```
npm install
```
3. Create a `.env.local` file with:
```
NEXT_PUBLIC_API_BASE_URL=
```
4. Run the development server:
```
npm run dev
```

## Setting Up the Server (Backend)
1. Navigate to the `server` directory:
```
cd server
```
2. Install dependencies:
```
npm install
```
3. Create a `.env` file with:
```
PORT=
MONGO_URI=
JWT_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=
FAST_API_URL=
FRONTEND_URL=
```
4. Run the backend server:
```
npm run dev
```

## Setting Up the Risk Scorer ML (FastAPI Backend)
1. Navigate to the `risk-scorer-ml` directory:
```
cd risk-scorer-ml
```
2. Create and activate a virtual environment:
```
python -m venv venv
.\venv\Scripts\activate
```
3. Install dependencies:
```
pip install -r requirements.txt
```
4. Create a `.env` file with:
```
MODEL_PATH=./evrs_miss_next_model.pkl
SCHEMA_PATH=./evrs_feature_schema.json
HORIZON_DAYS=
HIGH_THR=
MED_THR=
```
5. Run the FastAPI server:
```
uvicorn app:app --reload
```
