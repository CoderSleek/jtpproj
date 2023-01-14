'''This file is a part of module database containing all the functions
to interact with similarityindex collection of books database

There are a total of 3 functions which are exposed to other files 
'getDocumentBybookid', 'getBookIdsUsingIndexes', 'writeMatrixToDb'
and a '_write_to_log_file' which is for internal use

it uses pymongo module to interact with the database
mongodb connection URL is retrieved by environment variable

Whenever an exception is countered in any of the functions
the default response returned is None.
'''

import pymongo
from bson.objectid import ObjectId
import os
import pickle

# these objects are for internal use only
_client = pymongo.MongoClient(os.environ['MONGODB_URL'])
_database = _client.books
_collection = _database.similarityindex


def getDocumentBybookid(id: ObjectId) -> dict | None:
    '''This function retrieves a single document from the collection whose
    field bookId(not _id) matches the id parameter
    
    Parameters
    ----------
    id: ObjectId
        unique key which is a reference to a book document in book collection

    Returns
    -------
        dict which is a document having bookid of id param
    
        if any exception occurs then the default return is None.
    '''
    try:
        document = _collection.find_one({'bookid': id})
        return document

    except Exception as e:
        _write_to_log_file(e)
        return None


def getBookIdsUsingIndexes(indexList: list) -> "pymongo.cursor | None":
    '''This function retrieves list of bookid field from the
    documents whose indexes are provided in indexList param
    
    Parameters
    ----------
    indexList: list
        contains a list of ints whose value range from 0-9999

    Returns
    -------
        pymongo.cursor iterator containing list of documents whose index field
        is one specified in indexList
    
        if any exception occurs then the default return is None.
    '''
    try:
        # drops _id field from the resultant documents
        documents = _collection.find({'index' : {'$in': indexList}}, {'_id': 0, 'bookid': 1})
        return documents

    except Exception as e:
        _write_to_log_file(e)
        return None


#writes the recommender model to the database
def writeMatrixToDb(dataframe: 'pandas.Dataframe', similaritymatrix: 'numpy.ndarray') -> None:
    '''This function writes the generated recommendation model to database
    it writes and index field type int(0-9999)
    a data field which is an array of 10000 elements
    and a bookid which is an ObjectId refering to a book object to which this data belongs
    
    Parameters
    ----------
    dataframe: pandas.Dataframe
        A table like representation of bookid its index and set of tags used for recommendation system

    similaritymatrix: numpy.ndarray
        2-D array with size 10000 x 10000 containing the similarity score of each book with
        another book

    Returns
    -------
        None(implicit).
    '''
    try:
        # .iterrows method similar to enumerate returns an index and row value
        for index, value in dataframe.iterrows():
            _collection.insert_one({
                'index': index,
                'bookid': ObjectId(value['_id']),
                'data': pickle.dumps(similaritymatrix[index])
            })

    except Exception as e:
        _write_to_log_file(e)


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