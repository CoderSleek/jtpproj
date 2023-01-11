import pymongo
from bson.objectid import ObjectId
import os
import pickle

_client = pymongo.MongoClient(os.environ['MONGODB_URL'])
_database = _client.books
_collection = _database.similarityindex


def getDocumentBybookid(id: ObjectId) -> dict | None:
    try:
        document = _collection.find_one({'bookid': id})
        return document

    except Exception as e:
        return None


def getBookIdsUsingIndexes(indexList: list):
    try:
        documents = _collection.find({'index' : {'$in': indexList}}, {'_id': 0, 'bookid': 1})
        return documents

    except Exception as e:
        return None


def writeMatrixToDb(dataframe: 'pandas.Dataframe', similaritymatrix: 'numpy.ndarray'):
    try:
        for index, value in dataframe.iterrows():
            _collection.insert_one({
                'index': index,
                'bookid': ObjectId(value['_id']),
                'data': pickle.dumps(similaritymatrix[index])
            })

    except Exception as e:
        print(e)