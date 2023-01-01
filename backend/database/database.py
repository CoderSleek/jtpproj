from model import Todo

import motor.motor_asyncio
#default mongodb port
client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")