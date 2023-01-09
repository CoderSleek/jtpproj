import pickle
from database import book as db
from database import similarityindex as db2
from bson.objectid import ObjectId


def recommend(bookid: 'ObjectId') -> list:
    similarity_index_object = db2.getDocumentBybookid(bookid)
    similarity_array = pickle.loads(similarity_index_object['data'])
    similarity_array_sorted = sorted(list(enumerate(similarity_array)), reverse=True, key=lambda x: x[1])[1:21]

    list_of_indexes = [i[0] for i in similarity_array_sorted]
    
    list_of_book_ids = [i['bookid'] for i in db2.getBookIdsUsingIndexes(list_of_indexes)]
    list_of_books_to_recommend = db.getNDocumentsById(list_of_book_ids)

    return list_of_books_to_recommend