from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import run

app = FastAPI()

origins = ['http://localhost:3000'] #reactJS port

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials = True,
    allow_methods="*",
    allow_headers="*"
    )

@app.get('/')
def defaultRoute():
    return "API functional"

@app.post('/check')
def check():
    return "working"

if __name__ == "__main__":
    run(app, port=5000)