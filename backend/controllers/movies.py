from fastapi import APIRouter, Response, Request, status

import database as db
import recommender
from random import shuffle
from urllib.parse import unquote_plus

router = APIRouter()

@router.get('/recommendbysearch', tags=['recommend'])
def findAndRecommendMovie(title: str, fuzzy: bool, res: Response) -> dict:
    title = unquote_plus(title)

    try:
        if fuzzy:
            return _fuzzySearch(title)
        else:
            return _exactSearch(title)

    except Exception as e:
        print('exception', e)
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return None


@router.get('/recommendrandom', tags=['recommend'])
def recommendrandom(res: Response) -> dict | None:
    try:
        documents = list(db.book.getAllDocuments())
        shuffle(documents)
        
        return {
            'suggested': convertObjectIdToString(documents)[0:20]
        }

    except Exception as e:
        print('exception', e)
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return None


def _fuzzySearch(title: str):
    listoftitles = list(db.book.fuzzyTitleSearch(title))

    if not listoftitles:
        return None

    list_of_similar_movies = recommender.recommend(listoftitles[0]['_id'])
    listoftitles = convertObjectIdToString(listoftitles)
    
    list_of_similar_movies = convertObjectIdToString(list_of_similar_movies)
    
    return {
        'searched': listoftitles,
        'suggested': list_of_similar_movies
    }


def _exactSearch(title: str):
    bookObject = db.book.getDocumentByTitle(title)

    if not bookObject:
        return None

    list_of_similar_movies = recommender.recommend(bookObject['_id'])

    bookObject['_id'] = str(bookObject['_id'])
    list_of_similar_movies = convertObjectIdToString(list_of_similar_movies)

    return {
        'searched': bookObject,
        'suggested': list_of_similar_movies
    }

def convertObjectIdToString(listOfObjects: list) -> list:
    #converts Objectid to str, .update returns none, or with i gives back the update object
    return [(i.update({'_id': str(i['_id'])}) or i) for i in listOfObjects]