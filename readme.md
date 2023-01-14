# Book Recommendation System

    This project is a full stack application that allows users to search for books and receive personalized recommendations. It is built using React.js for the front-end, Python for the back-end, and FastAPI for the web framework. The application communicates data using the REST protocol. It uses MongoDB as the database

    The sample database used in this project can be found at 'https://zenodo.org/record/4265096'.
    It is based on GoodReads Best Book Ever list and was processed to include 50,000+ entries.
    The database used in this project uses 10,000 entries sorted on the basis of numRatings from the aforementioned dataset.
    This project uses recommendation system in python to recommend the best possible books to a search result.

    This project does the following

    * create a custom web server with python and FastAPI
    * creates a simple REST API to perform GET and POST operations
    * uses recommendation system built using sk_learn and pandas to recommend you books


## Getting Started

    To get started first install the git CLI at (https://git-scm.com/downloads)

    Then login with your credentials in the CLI

    Clone this project on your local machine using git clone (https://github.com/CoderSleek/jtpproj)

    all the files are in the main branch of the repository

    Download docker desktop for you OS from (https://www.docker.com/products/docker-desktop/)
    
    Pull docker images from dockerHub using
        - docker pull devnarula/jtpproj-backend
        - docker pull devnarula/jtpproj-frontend
        - docker pull devnarula/mongo_database

    This project depends on a MongoDB database which can be downloaded at (https://drive.google.com/drive/folders/1hSTX6VSCKBEFHoZrQosBvpQtYslmlaiF?usp=sharing)

    extract the zip file just downloaded

    run the shell script provided in the folder you extracted this will install the database in the docker container

    Navigate to the directory containg the project

    Open up a terminal in the correct folder

    Ensure you're in the same folder as the file containing docker-compose.yml

    Run command 'docker compose up'

    Port 3000 will be used for the front-end react application, 5000 for backend API and 2717 for MongoDB

    You're all Set!


## Application details

    The application contains a blue slider which will turn keyword search on or off (on recommended)
    keyword search will enable you to search with keywords only ex :- (harry potter)
    keyword search off only allow exact title search and is not case sensitive ex :- (The Hunger Games)
    search by genre allows you to choose a list of genres using which one can search the database

### Prerequisites

- Node.js v16.14.0 (https://nodejs.org/)
- npm 8.3.1 (https://www.npmjs.com/)
- python 3.10.2 (https://www.python.org/)
- pip 22.2.4 (https://pypi.org/project/pip/)
- MongoDB (https://www.mongodb.com/)


# Installing

    After installing the prequisites install dependencies via npm and pip

    cd ./backend
    pip install -r requirements.txt

    cd ./frontend
    npm install


## Built With

    React - The web framework used
    Node.js - JavaScript runtime
    npm - Package manager
    python - backend script and API
    pip - package manager


## Setting up and Running

    - Make sure the database is up and running also ensure MONGODB_URL environment variable is set
    - cd ./backend
    - uvicorn main:app --port 5000

    - cd ../frontend
    - npm start


### Contributing

    Feel free to open a pull request if you have something to contribute


### Authors

    Dev Narula - Creator - CoderSleek


### Acknowledgements

    This project was created as a technical recruitment project for JTP.


### How to tweak this project

    I would encourage others to tweak this project for their own purpose


### Found a bug?

    If you found a bug or would like to submit an improvement to this project , please submit it to the issues tab above


#### Licensing

    Personal Use