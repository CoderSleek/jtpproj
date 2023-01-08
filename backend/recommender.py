import pandas as pd
import database.database
import math
import re

pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', 20)
# pd.set_option('display.float_format', '{:20,.2f}'.format)
pd.set_option('display.max_colwidth', 200)

def convert(literal: str) -> list:
    #for empty description handling
    if isinstance(literal, float):
        return []

    return literal.strip(' ').split(' ')


def tokeniseAuthorName(literal: str) -> list:
    #removing unncessary info like author role from the author string in the format '(xyz)'
    literal = re.sub('\s\([a-zA-Z ]*\)*', '', literal)
    literal = literal.replace(' ', '')
    return literal.split(',')


def joinWords(listOfLiteral: list) -> list:
    listOfLiteral = [i.replace(' ', '') for i in listOfLiteral]
    return listOfLiteral


def joinStrings(*listOfLiteral: list) -> str: #fix docs
    # return ' '.join(listOfLiteral)
    tags_list = []
    for (genre, desc, auth, char, setting) in zip(*listOfLiteral):
        tags_list.append(' '.join([*genre, *desc, *auth, *char, *setting]).lower())

    return tags_list


df = pd.json_normalize(database.database.CRUD_operations.readAllDocuments())
df = df[['_id', 'title', 'description', 'genres', 'characters', 'setting', 'author']]

df['description'] = df['description'].apply(convert)
df['author'] = df['author'].apply(tokeniseAuthorName)
df['genres'] = df['genres'].apply(joinWords)
df['setting'] = df['setting'].apply(joinWords)
df['characters'] = df['characters'].apply(joinWords)
# df['tags'] = df['genres'] + df['description'] + df['author'] + df['characters'] + df['setting']

df2 = df[['_id', 'title']].copy()
df2['tags'] = joinStrings(df['genres'], df['description'], df['author'], df['characters'], df['setting'])

print(df2['tags'].head(30))