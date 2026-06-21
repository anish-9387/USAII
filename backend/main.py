import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import decision

load_dotenv()

# Cloud deployments (Render): write GCP key from env var to file
if creds_json := os.getenv("GOOGLE_CREDENTIALS_JSON"):
    creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "/tmp/gcp-key.json")
    with open(creds_path, "w") as f:
        f.write(creds_json)
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds_path

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app = FastAPI(title="Reverie - AI Decision Intelligence System")

app.add_middleware(
  CORSMiddleware,
  allow_origins=CORS_ORIGINS,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(decision.router)


@app.get("/health")
async def health():
  return {"status": "ok"}


if __name__ == "__main__":
  import uvicorn
  uvicorn.run("main:app", host=HOST, port=PORT)
