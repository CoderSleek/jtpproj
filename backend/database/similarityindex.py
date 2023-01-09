import pymongo
from bson.objectid import ObjectId

#default mongodb port
_client = pymongo.MongoClient("mongodb://localhost:27017")
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