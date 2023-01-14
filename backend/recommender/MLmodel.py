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
    the form of 'name (role)' the string is further split into a list of names

    This function acts as a callback function to pandas.Dataframe.column.apply method
    
    Parameters
    ----------
    literal: str
        A string containing author name of a panda.Dataframe row

    Returns
    -------
    list of string containing author names
    '''

    # replace part of string in format ' (role)'
    literal = re.sub('\s\([a-zA-Z0-9 ]*\)*', '', literal)
    literal = literal.replace(' ', '')
    return literal.split(',')


def _joinWords(listOfLiteral: list) -> list:
    '''This function joins words separated by a space in a list of strings

    This function acts as a callback function to pandas.Dataframe.column.apply method
    
    Parameters
    ----------
    listOfLiteral: list
        A list of strings in a panda.Dataframe row
        example ['Young Fiction', 'Fantasy']

    Returns
    -------
    list of string with their words tokenized by joining them removing spaces
    '''
    listOfLiteral = [i.replace(' ', '') for i in listOfLiteral]
    return listOfLiteral


def _joinStrings(*listOfLiteral: list) -> list:
    '''This function recieves a list of lists having the same length
    it then combines all these different lists containing tags into a single
    string of meta tags for each list which can then be used to create the recommendation model

    This function acts as a callback function to pandas.Dataframe.column.apply method
    
    Parameters
    ----------
    listOfLiteral: list
        A list of lists containing strings

    Returns
    -------
    list combining all the meta tags found in listOfLiteral with each item in list being a string

    Example
    -------
    recieves [['a', 'b'], ['c', 'd'], ['e', 'f']]
    returns ['a b', 'c d', 'e f']
    '''
    tags_list = []

    # iterate over ith item in all the list at the same time
    for (genre, desc, auth, char, setting) in zip(*listOfLiteral):
        # stemmer reduces words to their base grammitcal form
        stemmer = PorterStemmer()

        genre_stemmed = [stemmer.stem(word) for word in genre]
        desc_stemmed = [stemmer.stem(word) for word in desc]

        # join various list of strings into a single string and append it tags_list
        tags_list.append(' '.join([*genre_stemmed, *desc_stemmed, *auth, *char, *setting]).lower())
        

    return tags_list


def createModel() -> None:
    '''This function creates the recommendation model used for recommending books
    it uses various helper functions '_joinStrings', '_joinWords', '_tokeniseAuthorName'
    '_convert' to create a set of tags, whose top recurring 5000 words are counter by
    CountVectorizer and recommender model is created by finding the cosine similarity
    of each book against all the books, this results in a 2d matrix where each books
    similarity is plotted against all the other boks
    
    Parameters
    ----------
    None

    Returns
    -------
    None
    '''
    # convert json to panda Dataframe
    df = pd.json_normalize(db.getAllDocuments())

    # extract meaningful values
    df = df[['_id', 'title', 'description', 'genres', 'characters', 'setting', 'author']]

    # cleaning the DataFrame and reassigning it to its respective column
    df['description'] = df['description'].apply(_convert)
    df['author'] = df['author'].apply(_tokeniseAuthorName)
    df['genres'] = df['genres'].apply(_joinWords)
    df['setting'] = df['setting'].apply(_joinWords)
    df['characters'] = df['characters'].apply(_joinWords)

    # creating another dataframe containing all the final data
    df2 = df[['_id', 'title']].copy() #deep copy
    df2['tags'] = _joinStrings(df['genres'], df['description'], df['author'], df['characters'], df['setting'])

    # setting up the count function, counts top 5000 recurring words, removes unneccesary keywords like 'in'. 'the', 'is'
    vectorizer = CountVectorizer(max_features=5000, stop_words='english')

    # applying the function on meta tags
    vectorizedArray = vectorizer.fit_transform(df2['tags']).toarray()

    # computes the recommendation model, similarityMatrix is the similarity index
    similarityMatrix = cosine_similarity(vectorizedArray)
    
    # write matrix to database
    db.writeMatrixToDb(df2, similarityMatrix)


def getTopGenres() -> None:
    '''This function finds the top 100 genres found in books, this helps create a list
    that can then be used to search a book genre
    
    Parameters
    ----------
    None

    Returns
    -------
    None
    '''

    # get all items from db
    df = pd.json_normalize(db.getAllDocuments())
    df = df[['genres']]

    # combine space separated words into a single word
    df['genres'] = df['genres'].apply(lambda x: ' '.join([i.replace(' ', '') for i in x]))

    # setting up count function to get only top 100 genres of all book genres
    vectorize = CountVectorizer(max_features=100, lowercase=False)
    matrix = vectorize.fit_transform(df['genres'])
    
    # get the list of words
    mostOccuringWords = vectorize.get_feature_names_out()
    # get their respective frequencies
    frequencies = matrix.toarray().sum(axis=0)

    # zip both word and frequency into a single tuple
    list_of_tuple_having_word_and_frequency = list(zip(mostOccuringWords, frequencies))
    list_of_tuple_having_word_and_frequency.sort(reverse=True,key=lambda x: x[1])


if __name__ == '__main__':
    createModel()
    getTopGenres()