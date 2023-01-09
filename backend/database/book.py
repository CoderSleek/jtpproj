#from model import Todo
import pymongo
from bson.objectid import ObjectId
        
#default mongodb port
_client = pymongo.MongoClient("mongodb://localhost:27017")
_database = _client.books
_collection = _database.book

_filter = {'title': 1, 'author': 1, 'rating': 1, 'description' : 1, 'genres': 1, 'coverImg': 1}


def getAllDocuments() -> "pymongo.cursor | None":
    try:
        documents = _collection.find({}, _filter)
        return documents

    except Exception as e:
        return None


# def getOneDocument(key: str, value: any) -> dict | None:
#     try:
#         if key and value:
#             document = _collection.find_one({key: value}, _filter)
#             return document
#         # else implicit return None
#     except Exception as e:
#         return None


def getNDocumentsById(listOfValues: int) -> "pymongo.cursor | None":
    try:
        documents = _collection.find({'_id': {'$in': listOfValues}}, _filter)
        return documents

    except Exception as e:
        return None


# def getDocumentById(id: ObjectId) -> dict | None:
#     try:
#         document = _collection.find_one({'_id': ObjectId(id)}, _filter)
#         return document

#     except Exception as e:
#         return None


def fuzzyTitleSearch(title: str) -> "pymonog.cursor | None":
    try:
        documents = _collection.find({'$text': {'$search': title}}, _filter).limit(5)
        
        return documents
        
    except Exception as e:
        return None


# def getDocumentByTitle(title: str) -> dict | None:
#     try:
#         document = _collection.find_one({'title': title}, _filter)
#         return document

#     except Exception as e:
#         return None


def writeMatrixToDb(dataframe: 'pandas.Dataframe', similaritymatrix: 'numpy.ndarray'):
    print(dataframe.head())
    print(similaritymatrix)