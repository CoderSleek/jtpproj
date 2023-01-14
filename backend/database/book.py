'''This file is a part of module database containing all the functions
to interact with book collection of books database

There are a total of 6 functions which are exposed to other files 
'getAllDocuments', 'getNDocumentsById', 'fuzzyTitleSearch', 'getDocumentByTitle',
'getRandomDocumentsByGenre', 'getListOfTopGenres' and a '_write_to_log_file'
which is for internal use.

it uses pymongo module to interact with the database
mongodb connection URL is retrieved by environment variable

Whenever an exception is countered in any of the functions
the default response returned is None.
'''

import pymongo
from bson.objectid import ObjectId
import os
from traceback import format_exc

# these objects are meant for internal use only
_client = pymongo.MongoClient(os.environ['MONGODB_URL'])
_database = _client.books
_collection = _database.book

# filters to apply when retrieving a document and not get unncessary fields 1 represents True
_filter = {'title': 1, 'author': 1, 'rating': 1, 'description' : 1, 'genres': 1, 'coverImg': 1}


def getAllDocuments() -> "pymongo.cursor | None":
    '''This function retrieves all the documents from the collection
    
    Parameters
    ----------
    None

    Returns
    -------
        pymongo.cursor(iterable) containg all the documents in the collection filtered by _filter
    
        if any exception occurs then the default return is None.
    '''

    try:
        documents = _collection.find({}, _filter)
        return documents

    except Exception as e:
        _write_to_log_file(e)
        return None


def getNDocumentsById(listOfValues: list) -> "pymongo.cursor | None":
    '''This function retrieves N number of documents based on thier id, N is usually 5
    
    Parameters
    ----------
    listofValues: list
        A list containing object id's of the documents to be retrieved

    Returns
    -------
        pymongo.cursor(iterable) containg N documents by id in listofValues filtered by _filter
    
        if any exception occurs then the default return is None.
    '''
    try:
        documents = _collection.find({'_id': {'$in': listOfValues}}, _filter)
        return documents

    except Exception as e:
        _write_to_log_file(e)
        return None


def fuzzyTitleSearch(title: str) -> "pymonog.cursor | None":
    '''This function does a keyword search based on title parameter
    on the title field of database documents and gets an iterable containing documents by matching name
    
    Parameters
    ----------
    title: str
        A string having keywords to search in title of documents

    Returns
    -------
        pymongo.cursor(iterable) containg 5 documents which contains keywords in title field filtered by _filter
    
        if any exception occurs then the default return is None.
    '''
    try:
        documents = _collection.find({'$text': {'$search': title}}, _filter).limit(5)
        
        return documents
        
    except Exception as e:
        _write_to_log_file(e)
        return None


def getDocumentByTitle(title: str) -> dict | None:
    '''This function does a title search of documents based on title parameter
    and gets a single document which matches the title
    
    Parameters
    ----------
    title: str
        A string with title of document to find

    Returns
    -------
        dict matching the title of the document to be found filtered by filter
    
        if any exception occurs then the default return is None.
    '''
    try:
        document = _collection.find_one({'title': title}, _filter)
        return document

    except Exception as e:
        return None


def getRandomDocumentsByGenre(listOfGenres: list) -> 'pymongo.cursor | None':
    '''This function gets a list of documents from database which match
    the genres prescribed in the listofGenres parameter, the list contains only 5
    items among many which are randomised by the database
    
    Parameters
    ----------
    listofGenres: list
        A list of strings containing the genre to filter the documents by

    Returns
    -------
        pymongo.cursor(iterable) containg list of documents specifying the genre requirements filtered by filter
    
        if any exception occurs then the default return is None.
    '''
    try:
        # uses aggregation to first get a list of documents that match the genre specification
        # then retrieve certain fields of those documents using _filter
        # and then randomizing them to retrieve 5 documents
        documents = _collection.aggregate([
                {"$match": {"genres": {"$all": listOfGenres}}},
                {"$project": _filter},
                {"$sample": {"size": 5}}
            ])

        return documents
    
    except Exception as e:
        _write_to_log_file(e)
        return None


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
    with open('../logfile.log', 'a') as logfile:
        # prettify the exception details
        # format_exc returns a string of information and stack trace entries from traceback object
        exception_detail = format_exc().split('\n')[1:]
        print(' '.join(exception_detail), file=logfile)
        print(err)