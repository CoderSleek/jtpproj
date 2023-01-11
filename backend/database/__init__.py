from decouple import config
import os

os.environ['MONGODB_URL'] = config('MONGODB_URL')

from database import book
from database import model
from database import similarityindex