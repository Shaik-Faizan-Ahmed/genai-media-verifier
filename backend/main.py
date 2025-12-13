from fastapi import FastAPI, UploadFile, File
import os
import shutil

app = FastAPI(title="GenAI Media Verifier")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def home():
    return {"status": "API running"}

@app.post("/upload")
async def upload_media(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "filename": file.filename,
        "saved_path": file_path
    }
