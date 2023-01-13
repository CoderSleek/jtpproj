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
    #for empty description handling
    if isinstance(literal, float):
        return []

    # literal = literal.strip(' ').replace('\n', ' ').replace('.', ' ').split(' ')
    literal = re.sub(r'[\.,-]', ' ', literal)
    literal = re.sub(r'[^\w\s]', '', literal)
    
    return literal.strip(' ').replace('  ', ' ').split(' ')


def _tokeniseAuthorName(literal: str) -> list:
    #removing unncessary info like author role from the author string in the format '(xyz)'
    literal = re.sub('\s\([a-zA-Z ]*\)*', '', literal)
    literal = literal.replace(' ', '')
    return literal.split(',')


#remove whitespaces
def _joinWords(listOfLiteral: list) -> list:
    listOfLiteral = [i.replace(' ', '') for i in listOfLiteral]
    return listOfLiteral


#combine all tags into a string
def _joinStrings(*listOfLiteral: list) -> list[str]: #fix docs
    # return ' '.join(listOfLiteral)
    tags_list = []

    for (genre, desc, auth, char, setting) in zip(*listOfLiteral):
        stemmer = PorterStemmer()

        genre_stemmed = [stemmer.stem(word) for word in genre]
        desc_stemmed = [stemmer.stem(word) for word in desc]

        tags_list.append(' '.join([*genre_stemmed, *desc_stemmed, *auth, *char, *setting]).lower())
        

    return tags_list


def createModel() -> None:
    df = pd.json_normalize(db.getAllDocuments())
    df = df[['_id', 'title', 'description', 'genres', 'characters', 'setting', 'author']]

    df['description'] = df['description'].apply(self._convert)
    df['author'] = df['author'].apply(self._tokeniseAuthorName)
    df['genres'] = df['genres'].apply(self._joinWords)
    df['setting'] = df['setting'].apply(self._joinWords)
    df['characters'] = df['characters'].apply(self._joinWords)

    df2 = df[['_id', 'title']].copy()
    df2['tags'] = self._joinStrings(df['genres'], df['description'], df['author'], df['characters'], df['setting'])

    vectorizer = CountVectorizer(max_features=5000, stop_words='english')
    vectorizedArray = vectorizer.fit_transform(df2['tags']).toarray()
    similarityMatrix = cosine_similarity(vectorizedArray)

    df2 = pickle.load(open('dataframe.pkl', 'rb'))
    similarityMatrix = pickle.load(open('similarity_index.pkl', 'rb'))
    
    db.writeMatrixToDb(df2, similarityMatrix)


def getTopGenres():
    df = pd.json_normalize(db.getAllDocuments())
    df = df[['genres']]
    df['genres'] = df['genres'].apply(lambda x: ' '.join([i.replace(' ', '') for i in x]))

    vectorize = CountVectorizer(max_features=100, lowercase=False)
    matrix = vectorize.fit_transform(df['genres'])
    
    x = vectorize.get_feature_names_out()
    y = matrix.toarray().sum(axis=0)

    x = list(zip(x,y))
    x.sort(reverse=True,key=lambda x: x[1])


if __name__ == '__main__':
    # createModel()
    getTopGenres()

#difflib