# The project is made of 3 components
- front-end (ReactJs v16.14.0)
- backend (python v3.10.2) [Rest API, API calls, recommender and database interaction]
- database (mongodb) [No-SQL bson database]


# Database

    runs on port 27017
    database named books has 2 different collections book and similarityindex
    - book collection contains 10,000 book informations
    -- sample Model is show below
        "_id": unique ObjectId
        "bookId": string representation of goodreads dataset
        "title": str
        "series": str
        "author": str
        "rating": double
        "description": str,
        "language": "English",
        "isbn": str,
        "genres": [...]
        "characters": [...]
        "bookFormat": str,
        "edition": str,
        "pages": int,
        "publisher": str,
        "publishDate": str,
        "numRatings": num,
        "ratingsByStars": [...]
        "likedPercent": int,
        "setting": [...]
        "coverImg": str,
        "bbeScore": int,
        "bbeVotes": int,
        "price": float

    - similarityindex collection contains another 10,000 instances each of which represent a book's cosine similarity score with all other books
    --sample Model
        "_id": unique object id
        "index": int,
        "bookid": unique object id of the books mapped to their cosine similarity
        "data": binary representation of list with 10,000 elements


# Backend

    runs on port 5000
    run by uvicorn main:app --port 5000
    following project structure

    backend/                    - root folder
    -controllers/
        -router.py              - handles api endpoint routing
    -database/                  - database interaction module
        -__init__.py
        -book.py                - handles db.book requests
        -model.py               - db.book model
        -similarityindex.py     - handles db.similarityindex requests
    -recommender/               - ML model generator and predictor
        -__init__.py
        -MLmodel.py             - model generator
        -recommender.py         - predictor
    -services/
    -.dockerignore
    -.env                       - env variables
    -Dockerfile                 - building docker image
    -main.py                    - main file of the project
    -requirements.txt           - dependencies
    -test.rest                  - API testing


    dependencies
    - fastapi
    - uvicorn
    - motor
    - pymongo
    - pandas
    - scikit-learn
    - nltk
    - python-decouple


# Frontend

    runs on port 3000
    run by react start [developer mode]
    following project structure

    frontend/                               - root folder
    -public/                                - contains html page and other static assets
    -src/                                   - source files
        -components/                        - smaller components of app
        -BookTile.jsx & BookTile.css        - represents each book card show in webpage
        -Genres.jsx                         - returns genres element decorated if matching another item
        -InfoBox.css & InfoBox.jsx          - information Modal component
        -PaginationButtons.jsx              - switch page component and state management
        - SearchComponent.jsx & css         - search box and button components
        -SelectComponent.jsx & css          - RecommendByGenre Component
        -ToggleSlider.jsx                   - SearchComponent sub-component
    -App.css & App.js                       - main business logic of the webapp
    -index.js & index.css                   - root render component  
    -.dockerignore
    -.gitignore                       
    -package-loc.json
    -package.json                           -dependencies
    -readme.md        


    dependencies
    - react
    - babel
    - bootstrap
    - multilist-react