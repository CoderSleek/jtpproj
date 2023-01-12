from decouple import config
import os

if not os.environ.get('MONGODB_URL'):
    os.environ['MONGODB_URL'] = config('MONGODB_URL')

from database import book
from database import model
from database import similarityindex