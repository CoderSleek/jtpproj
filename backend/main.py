from fastapi import FastAPI, Request, Response, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import run
from controllers.movies import router as moviesRouter

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