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


#cleans a string by removing punctuation, returns list of words
def _convert(literal: str) -> list:
    #for empty description handling
    if isinstance(literal, float):
        return []

    #substituing punctuations and extra spaces
    literal = re.sub(r'[\.,-]', ' ', literal)
    literal = re.sub(r'[^\w\s]', '', literal)
    
    return literal.strip(' ').replace('  ', ' ').split(' ')


#removes unncessary info like author role from the author string in the format '(xyz)'
def _tokeniseAuthorName(literal: str) -> list:
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
    df['description'] = df['description'].apply(self._convert)
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