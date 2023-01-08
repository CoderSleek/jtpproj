#from model import Todo
import pymongo
from bson.objectid import ObjectId


# def call():
    # documents = collection.find({})
    # df = pd.json_normalize(documents)

    # x = df[df['description'].isnull() & [i == [] for i in df['genres']]]

    # collection.delete_many({'_id' : {'$in': list(x['_id'])}})

    # arr = []
    # arr2=[]
    # for index, item in enumerate(df['genres']):
    #     if item == [] and pd.isnull(df.iloc[index, 6]):
    #         arr2.append(df.iloc[index]['title'])
            # arr.append(False)
            #arr2.append(index)
        # else:
        #     arr.append(True)

    # for i in arr2:
    #     print(i)
    # print(df.iloc[arr2]['title'])

    # print(pd.isnull(df.iloc[291, 6]), df.iloc[291, 6])
    # print(df[df['description'].isnull()])

    # x = collection.aggregate([
    # { 
    #     "$group": { 
    #         "_id": { "title": "$title", "author": "$author" }, 
    #         "uniqueIds": { "$addToSet": "$_id" },
    #         "count": { "$sum": 1 } 
    #     }
    # }, 
    # { "$match": { "count": { "$gt": 1 } } }
    # ])

    # collection.delete_many({'_id': {'$in': arr}})

    # for document in documents:
    #     collection.update_one({'_id': document['_id']}, {'$set': {'characters': eval(document['characters']), 'setting': eval(document['setting'])}})




#load dataset
#convert string to array
#delete duplicate values
#delete missing values
#post processing converting strings to list keywords

    # print(df[['_id', 'title', 'description', 'author']].isnull().sum())
    # count1 = count2 = count3 = 0
    # for (a,b,c) in zip(df['genres'], df['characters'], df['setting']):
    #     if a == []:
    #         count1 += 1
    #     if b == []:
    #         count2 += 1
    #     if c == []:
    #         count3 += 1
        
class CRUD_operations():
    #default mongodb port
    client = pymongo.MongoClient("mongodb://localhost:27017")
    database = client.books
    collection = database.book

    def readAllDocuments() -> iter:
        documents = CRUD_operations.collection.find({})

        return documents