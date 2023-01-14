'''This file contains all the routes and their helper functions

There are a total of 4 routes 
'/recommendbysearch', '/recommendrandom', '/recommendbygenre' and '/gettopgenres'

this file also contains helper functions for these routes intended
for use inside this file only, these are
'_fuzzy_search', '_exact_search', '_convert_objectId_to_string' and '_write_to_log_file'

Whenever an exception is countered in any of the helper or HTTP request callback function
the default response returned is None.
'''

from fastapi import APIRouter, Response, status

import database as db
import recommender
from random import shuffle
from urllib.parse import unquote_plus # for parsing encoded url
from traceback import format_exc # for formatting exception

router = APIRouter() # router object to recieve incoming API call's


# route to suggest books when user does a search in the frontend
# get method recieves two query parameters title of the movie
# and is_fuzzy to denote the type of search
@router.get('/recommendbysearch', tags=['recommend'])
async def search_and_recommend_movie(title: str, is_fuzzy: bool, res: Response) -> dict | None:
    '''This function returns a dict containing list of books recommended and search results

    This function recieves 3 parameters as a callback to HTTP GET request
    calls a helper function _fuzzy_search or _exact_search based on is_fuzzy flag
    
    Parameters
    ----------
    title: str
        The name of the movie to search

    is_fuzzy: bool
        Flag used describe the type of title search, true if keyword search
        false if exact title search

    res: Response
        A response object which is passed by FastAPI when this function is called as callback

    Returns
    -------
    dict or None (returned by a helper function)
        A dictionary containing list of search results and recommendations
        {
            searched: dict or list
            suggested: list
        }
    
        if any exception occurs then the default return is None.
    '''

    #decode the query parameter containg + instead of spaces
    title = unquote_plus(title)

    try:
        #fuzzy search may result a list of search items, exact search always returns one
        if is_fuzzy:
            return _fuzzy_search(title)
        else:
            return _exact_search(title)

    except Exception as e:
        _write_to_log_file(e)
        #set status code to denote server response error, so logfile can be checked accordingly
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return None


# route to suggest books when the webapp starts up, this method is called once every reload
# recieves no additional parameters
@router.get('/recommendrandom', tags=['recommend'])
async def recommend_random(res: Response) -> dict | None:
    '''This function returns a dict containing list of randomly recommended books

    This function recieves 1 parameters as a callback to HTTP GET request
    calls a helper function _convert_objectId_to_string
    
    Parameters
    ----------
    res: Response
        A response object which is passed by FastAPI when this function is called as callback

    Returns
    -------
    dict or None
        A dictionary containing list of recommendations
        {
            suggested: list
        }
    
        if any exception occurs then the default return is None.
    '''

    try:
        # gets a pymongo.cursor(iterator) object from the database module
        list_of_books = list(db.book.getAllDocuments())

        # randomly shuffles the list containing books
        shuffle(list_of_books)
        
        # return first 20 suggestions only
        return {
            'suggested': _convert_objectId_to_string(list_of_books)[0:20]
        }

    except Exception as e:
        _write_to_log_file(e)
        #set status code to denote server response error, so logfile can be checked accordingly
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return None


# route to suggest books when user does a search by genre in the frontend
# this method is POST to recieve json content from the fronted, the content
# could be recieved in query params but that would cloud the URL too much and
# getting json data in GET request was leading to undefined behavior
# post method recieves a list of searched genres which is passed as a callback
@router.post('/recommendbygenre', tags=['recommend'])
async def recommend_by_genre(listofgenres: list) -> dict | None:
    '''This function returns a dict containing list of recommended books by genre filter

    This function recieves 1 parameters as a callback to HTTP POST request
    calls a helper function _convert_objectId_to_string
    
    Parameters
    ----------
    listofgenres: list
        A list containing string of genres passed by FastAPI when this function is called as callback

    Returns
    -------
    dict or None
        A dictionary containing list of recommendations
        {
            suggested: list
        }
    
        if any exception occurs then the default return is None.
    '''

    try:
        #gets pymongo.cursor(iterator) having 5 randomly sorted documents from db based on genre
        list_of_books = list(db.book.getRandomDocumentsByGenre(listofgenres))

        return {
            'suggested': _convert_objectId_to_string(list_of_books)
        }

    except Exception as e:
        _write_to_log_file(e)
        #set status code to denote server response error, so logfile can be checked accordingly
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return None


# GET route to return a list of top 100 genres of books
# get method recieves no additional parameters
@router.get('/gettopgenres', tags=['genres'])
async def get_top_genres(res: Response) -> dict | None:
    '''This function returns a dict containing list of top 100 genres

    This function recieves no parameters

    Returns
    -------
    dict or None
        A dictionary containing top 100 book genres
        {
            genres: list
        }
    
        if any exception occurs then the default return is None.
    '''
    try:
        #gets a pymongo.cursor(iterator) Object from the database module
        genre_list = list(db.book.getListOfTopGenres())

        return {
            'genres': genre_list
        }

    except Exception as e:
        _write_to_log_file(e)
        #set status code to denote server response error, so logfile can be checked accordingly
        res.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return None


def _fuzzy_search(title: str) -> dict | None:
    '''This function is a helper function to search_and_recommend_movie function
    does keyword search on the bases of title parameter
    this function does database interaction to find a searched based on keywords
    gets recommendations based on the search results
    recommends based on the first book in list of books

    calls a helper function _convert_objectId_to_string
    if any exception is occured it is handled by the calling function

    Parameters
    ----------
    title: str
        A string containing keywords to search in a title

    Returns
    -------
    dict or None
        A dictionary containing list of search items and recommendation
        {
            searched: list
            suggested: list
        }
    
        if list of search items is None return is None.
    '''
    # since this function invokes keyword searching in the db it gets a pymongo.cursor(iterator)
    # having many search items
    list_of_search_books = list(db.book.fuzzyTitleSearch(title))

    if not list_of_search_books:
        return None

    # calls the recommend method from the recommender module
    # the recommendation are done on the basis of first book in list of books acquired from db
    list_of_similar_books = recommender.recommend(list_of_search_books[0]['_id'])
    list_of_search_books = _convert_objectId_to_string(list_of_search_books)
    
    list_of_similar_books = _convert_objectId_to_string(list_of_similar_books)
    
    return {
        'searched': list_of_search_books,
        'suggested': list_of_similar_books
    }


def _exact_search(title: str) -> dict | None:
    '''This function is a helper function to search_and_recommend_movie function
    does exact title search on the basis of title parameter
    this function does database interaction to find a searched item and gets
    recommendations based on the search result

    calls a helper function _convert_objectId_to_string
    if any exception is occured it is handled by the calling function

    Parameters
    ----------
    title: str
        A string containing name of the books to search

    Returns
    -------
    dict or None
        A dictionary containing single search result and list of recommendation
        {
            searched: dict
            suggested: list
        }
    
        If book object is None return is None.
    '''
    bookObject = db.book.getDocumentByTitle(title)

    if not bookObject:
        return None

    list_similar_books = recommender.recommend(bookObject['_id'])

    # since _id is a binary object id it cannot be converted to json
    # hence the id needs to be converted to string first
    bookObject['_id'] = str(bookObject['_id'])
    list_similar_books = _convert_objectId_to_string(list_similar_books)

    return {
        'searched': bookObject,
        'suggested': list_similar_books
    }


def _convert_objectId_to_string(listOfObjects: list) -> list:
    '''This function is a helper function that converts the _id key in a dictionary
    to a string since _id is binary object id and cannot be converted to json directly

    if any exception is occured it is handled by the calling function

    Parameters
    ----------
    listofObjects: list
        A list containing various book objects in the form of a dictionary

    Returns
    -------
    list
        A list of book items with id converted to string.
    '''

    # list comprehension of each item i which is a dict, the update method
    # returns None which done an or operation by the dict itself returns the
    # new and update dict whose _id key is a string
    return [(i.update({'_id': str(i['_id'])}) or i) for i in listOfObjects]


def _write_to_log_file(err: Exception) -> None:
    '''This function is a helper function that writes data to log file in case of an exception
    the log file is in the /backend folder of the application and is opened in append mode

    Parameters
    ----------
    err: Exception
        A description of the excpetion which was encountered

    Returns
    -------
    None.
    '''

    with open('logfile.log', 'a') as logfile:
        # prettify the exception details
        # format_exc returns a string of information and stack trace entries from traceback object
        exception_detail = format_exc().split('\n')[1:]
        print(' '.join(exception_detail), file=logfile)
        print(err, file=logfile)