from fastapi import APIRouter
# import database.book as db

import os
import sys
x = os.path.abspath('backend')
sys.path.append(x)
from database import book as db
from recommender import recommend

router = APIRouter()

@router.get('/findmovie')
def findAndRecommendMovie(title: str):
    listoftitles = list(db.fuzzyTitleSearch(title))

    if not listoftitles:
        return

    list_of_similar_movies = recommend(listoftitles[0]['_id'])

    
    return {
        'similarNames': listoftitles,
        'suggested': list_of_similar_movies
    }