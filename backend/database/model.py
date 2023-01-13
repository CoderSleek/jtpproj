from pydantic import BaseModel
from bson.objectid import ObjectId

class Book(BaseModel):
    _id: ObjectId
    title: str
    description: str
    author: str
    rating: int
    genres: list
    charachters: list
    setting: list
    coverImg: str