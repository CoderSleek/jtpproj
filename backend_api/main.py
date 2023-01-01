from fastapi import FastAPI, Request, Response, status
from uvicorn import run

app = FastAPI()

@app.get('/')
def defaultRoute():
    return "API functional"


if __name__ == "__main__":
    run(app, port=5000)