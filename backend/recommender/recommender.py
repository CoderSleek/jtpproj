import pickle
import database as db
from bson.objectid import ObjectId


#recommends similar by reading the model from database and providing predictions
def recommend(bookid: 'ObjectId') -> list:
    similarity_index_object = db.similarityindex.getDocumentBybookid(bookid)
    #binary stored numpy array, decoded using pickle
    similarity_array = pickle.loads(similarity_index_object['data'])
    similarity_array_sorted = sorted(list(enumerate(similarity_array)), reverse=True, key=lambda x: x[1])[1:21]
    #gets only the first 20 values, index starts from 1 because the oth ele is the boook itself

    list_of_indexes = [i[0] for i in similarity_array_sorted]
    
    #gets bookid using index, both are database fields
    list_of_book_ids = [i['bookid'] for i in db.similarityindex.getBookIdsUsingIndexes(list_of_indexes)]
    list_of_books_to_recommend = db.book.getNDocumentsById(list_of_book_ids)

    return list_of_books_to_recommend