from fastapi import APIRouter, Response, Request, status

import database as db
import recommender
from random import shuffle
from urllib.parse import unquote_plus

router = APIRouter()

#movie recommends when the use searches in searchbar
@router.get('/recommendbysearch', tags=['recommend'])
def findAndRecommendMovie(title: str, fuzzy: bool, res: Response) -> dict:
    #decode query params
    title = unquote_plus(title)

    try:
        if fuzzy:
            return _fuzzySearch(title)
        else:
            return _exactSearch(title)

    except Exception as e:
        with open('logfile.log', 'r') as log:
            print('exception', e, file=log)
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return None


#randomly recommend a movie
@router.get('/recommendrandom', tags=['recommend'])
def recommendrandom(res: Response) -> dict | None:
    try:
        #get all documents from db
        documents = list(db.book.getAllDocuments())
        #randomly shuffle them
        shuffle(documents)
        
        #return first 20 suggestions only
        return {
            'suggested': convertObjectIdToString(documents)[0:20]
        }

    except Exception as e:
        with open('logfile.log', 'r') as log:
            print('exception', e, file=log)
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return None


@router.post('/recommendbygenre', tags=['recommend'])
def recommendByGenre(listofgenres: list) -> dict:
    try:
        #gets 5 randomly sorted documents from db based on genre
        documents = list(db.book.getRandomDocumentsByGenre(listofgenres))

        return {
            'suggested': convertObjectIdToString(documents)
        }

    except Exception as e:
        with open('logfile.log', 'r') as log:
            print('exception', e, file=log)
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return None


@router.get('/gettopgenres', tags=['genres'])
def recommendByGenre() -> dict:
    try:
        genreList = list(db.book.getListOfTopGenres())

        return {
            'genres': genreList
        }

    except Exception as e:
        with open('logfile.log', 'r') as log:
            print('exception', e, file=log)
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return None


def _fuzzySearch(title: str):
    #keyword matching
    listoftitles = list(db.book.fuzzyTitleSearch(title))

    if not listoftitles:
        return None

    list_of_similar_movies = recommender.recommend(listoftitles[0]['_id'])
    #convert binary id to string so that it can be json encoded
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