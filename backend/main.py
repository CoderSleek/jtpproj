'''This file is the main file to start the backend and API service run by uvicorn

It sets the cors policy and has a default GET method for testing whether the api
is functional all the other routes are imported from controllers module

localhost:3000 which is the default ip and port for ReactJS application
is allowed to perform CORS request

The application runs on port 5000
'''

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import run
from controllers.router import router as moviesRouter

app = FastAPI()

origins = ['http://localhost:3000'] #reactJS port

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials = True,
    allow_methods="*",
    allow_headers="*"
    )

router = APIRouter()
router.include_router(moviesRouter)
app.include_router(router)

@app.get('/')
def defaultRoute():
    return "API functional"


if __name__ == "__main__":   
    run(app, port=5000)