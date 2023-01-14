'''This file contains a single function recommend to provide recommendations for
a specific book by reading from a pre commpiled model

As a part of recommender module this function is called by other scripts to provide
recommendations
'''

import pickle
import database as db
from bson.objectid import ObjectId


def recommend(bookid: 'ObjectId') -> list:
    '''This function gets a bookid retrives the data field of the document
    from similarityindex db where the bookid matches it then converts the data
    field from its pickle representation to a list, sorts the list based on decending
    order to get similarity of other books
    at this point we extract indexes 1-20 of the sorted list because index 0 represents book itself
    each item in the extracted list contains index of another book to recommmended and its similarity score
    using each index we get its corresponding book using the bookid field for each index
    using each bookid field from similarityindex collection its respective book can be found in book collection
    the list of books is the final recommendation
    
    Parameters
    ----------
    bookid: ObjectId
        bookid(and not _id) field of a document in the similarityindex collection

    Returns
    -------
    list containing books to recommend
    '''

    #get a similarityindex document by its bookid
    similarity_index_object = db.similarityindex.getDocumentBybookid(bookid)
    #binary stored numpy array, decoded using pickle
    similarity_array = pickle.loads(similarity_index_object['data'])

    # enumerate to get index, convert to a list and sort the list
    similarity_array_sorted = sorted(list(enumerate(similarity_array)), reverse=True, key=lambda x: x[1])[1:21]
    #gets only the first 20 values, index starts from 1 because the oth ele is the boook itself

    # get index field at location 0 of a tuple
    list_of_indexes = [i[0] for i in similarity_array_sorted]
    
    #gets bookid using index, both are database fields
    list_of_book_ids = [i['bookid'] for i in db.similarityindex.getBookIdsUsingIndexes(list_of_indexes)]
    # gets book document from list of bookids
    list_of_books_to_recommend = db.book.getNDocumentsById(list_of_book_ids)

    return list_of_books_to_recommend