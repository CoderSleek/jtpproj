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

    To get started first install the git CLI at https://git-scm.com/downloads
    Then login with your credentials in the CLI
    Clone this project on your local machine using git clone https://github.com/CoderSleek/jtpproj
    Download docker desktop for you OS from https://www.docker.com/products/docker-desktop/
    Navigate to the directory containg the project
    Open up a terminal in the correct folder
    Ensure you're in the same folder as the file containing docker-compose.yml
    Run command 'docker compose up'
    Port 3000 will be used for the front-end react application, 5000 for backend API and 27017 for MongoDB
    You're all Set!
    Alternatively you could also download all the dependencies yourself and start the program manually


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

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.


### Authors

    Dev Narula - Creator - CoderSleek


### Acknowledgements

    This project was created as a technical recruitment project for JTP.


### How to tweak this project

    I would encourage others to tweak this project for their own purpose


### Found a bug?

    If you found a bug or would like to submit an improvement to this project , please submit it to the issues tab above