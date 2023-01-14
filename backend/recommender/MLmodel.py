'''This file contains all the functions neccessary to create the recommender model
and list of top 100 genres as well as calls the database module to store them in the database

it is not required to run this script as the model is already once created and stored in database
from where it can be retrieved when the REST API calls are being performed
this file is included for reference only and will not run when the backend is initiated

There are a total of 6 functions inside this file 
'createModel', '/getTopGenres' and 4 helper functions
'_convert', '_tokeniseAuthorName', '_joinWords', '_joinStrings'

This file requires a module database from a sibling directory
hence os.path.append is used to add the directory so that it can be imported
'''

import pandas as pd
import math
import re
import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.stem import PorterStemmer

import sys 
sys.path.append('../')

import database.book as db

def _convert(literal: str) -> list:
    '''This function cleans the description string by removing unncessary punctuations
    and converts the string into a list of words splitting them by space charachter

    This function acts as a callback function to pandas.Dataframe.column.apply method
    
    Parameters
    ----------
    literal: str
        a string containing the description of a panda.Dataframe row

    Returns
    -------
    list of words separated by space charachter.
    '''

    # if the description is empty it is stored as NaN which is a float instance
    # this check is done to return an empty list if the description is empty
    if isinstance(literal, float):
        return []

    # substituing punctuations(,.-) with a space charachter
    literal = re.sub(r'[\.,-]', ' ', literal)
    # removes all other charachters which are not letters digits or spaces (other punctuations)
    literal = re.sub(r'[^\w\s]', '', literal)
    
    # removes trailing whitespaces, redundant spaces and splits the string by each word
    return literal.strip(' ').replace('  ', ' ').split(' ')


def _tokeniseAuthorName(literal: str) -> list:
    '''This function cleans the author string by removing unncessary details such as
    their role in a book example (author) or (illustrator) these details are always in
    the form of (xyz)

    This function acts as a callback function to pandas.Dataframe.column.apply method
    
    Parameters
    ----------
    literal: str
        a string containing the description of a panda.Dataframe row

    Returns
    -------
    list of words separated by space charachter.
    '''
    literal = re.sub('\s\([a-zA-Z ]*\)*', '', literal)
    literal = literal.replace(' ', '')
    return literal.split(',')


#remove whitespaces for stemming
def _joinWords(listOfLiteral: list) -> list:
    listOfLiteral = [i.replace(' ', '') for i in listOfLiteral]
    return listOfLiteral


#recieves various lists of words, returns a combined and stemmed list
def _joinStrings(*listOfLiteral: list) -> list:
    tags_list = []

    for (genre, desc, auth, char, setting) in zip(*listOfLiteral):
        stemmer = PorterStemmer()

        genre_stemmed = [stemmer.stem(word) for word in genre]
        desc_stemmed = [stemmer.stem(word) for word in desc]

        tags_list.append(' '.join([*genre_stemmed, *desc_stemmed, *auth, *char, *setting]).lower())
        

    return tags_list


#create the recommender model using cosine similarity
def createModel() -> None:
    #convert json to panda Dataframe
    df = pd.json_normalize(db.getAllDocuments())
    #extract meaningful values
    df = df[['_id', 'title', 'description', 'genres', 'characters', 'setting', 'author']]

    #cleaning the dataset
    df['description'] = df['description'].apply(_convert)
    df['author'] = df['author'].apply(self._tokeniseAuthorName)
    df['genres'] = df['genres'].apply(self._joinWords)
    df['setting'] = df['setting'].apply(self._joinWords)
    df['characters'] = df['characters'].apply(self._joinWords)

    df2 = df[['_id', 'title']].copy() #deep copy
    df2['tags'] = self._joinStrings(df['genres'], df['description'], df['author'], df['characters'], df['setting'])

    #computes the recommendation model, similarityMatrix is the similarity index
    vectorizer = CountVectorizer(max_features=5000, stop_words='english')
    vectorizedArray = vectorizer.fit_transform(df2['tags']).toarray()
    similarityMatrix = cosine_similarity(vectorizedArray)
    
    db.writeMatrixToDb(df2, similarityMatrix)


#retrieve top genres
def getTopGenres() -> None:
    df = pd.json_normalize(db.getAllDocuments())
    df = df[['genres']]
    #combine words to rep. 1 term
    df['genres'] = df['genres'].apply(lambda x: ' '.join([i.replace(' ', '') for i in x]))

    vectorize = CountVectorizer(max_features=100, lowercase=False)
    matrix = vectorize.fit_transform(df['genres'])
    
    mostOccuringWords = vectorize.get_feature_names_out()
    frequencies = matrix.toarray().sum(axis=0)

    frequencies = list(zip(x,y))
    frequencies.sort(reverse=True,key=lambda x: x[1])


if __name__ == '__main__':
    createModel()
    getTopGenres()