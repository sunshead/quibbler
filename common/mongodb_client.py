from pymongo import MongoClient
import yaml

with open('../config.yaml') as ymlfile:
    config = yaml.load(ymlfile)

MONGO_DB_HOST = config['mongodb']['host']
MONGO_DB_PORT = config['mongodb']['port']
DB_NAME = config['mongodb']['db_name']

client = MongoClient("%s:%d" % (MONGO_DB_HOST, MONGO_DB_PORT))

def get_db(db=DB_NAME):
    db = client[db]
    return db
