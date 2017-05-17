import json
import os
import pickle
import random
import redis
import sys

from bson.json_util import dumps
from datetime import datetime

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import mongodb_client
import news_recommendation_service_client
import yaml

from cloudAMQP_client import CloudAMQPClient

with open("../config.yaml", "r") as ymlfile:
    config = yaml.load(ymlfile)

REDIS_HOST = config['redis']['host']
REDIS_PORT = config['redis']['port']

NEWS_TABLE_NAME = config['mongodb']['news_table_name']
CLICK_LOGS_TABLE_NAME = config['mongodb']['click_logs_table_name']

NEWS_LIMIT = config['mongodb']['news_limit']
NEWS_LIST_BATCH_SIZE = config['mongodb']['news_list_batch_size']
USER_NEWS_TIME_OUT_IN_SECONDS = config['mongodb']['user_news_timeout_in_seconds']

LOG_CLICKS_TASK_QUEUE_URL = config['amqp']['log_clicks_task_queue_url']
LOG_CLICKS_TASK_QUEUE_NAME = config['amqp']['log_clicks_task_queue_name']

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT, db=0)
cloudAMQP_client = CloudAMQPClient(LOG_CLICKS_TASK_QUEUE_URL, LOG_CLICKS_TASK_QUEUE_NAME)

def getNewsSummariesForUser(user_id, page_num):
    page_num = int(page_num)
    begin_index = (page_num - 1) * NEWS_LIST_BATCH_SIZE
    end_index = page_num * NEWS_LIST_BATCH_SIZE

    # The final list of news to be returned.
    sliced_news = []

    if redis_client.get(user_id) is not None:
        news_digests = pickle.loads(redis_client.get(user_id))

        # If begin_index is out of range, this will return empty list;
        # If end_index is out of range (begin_index is within the range), this
        # will return all remaining news ids.
        sliced_news_digests = news_digests[begin_index:end_index]
        print sliced_news_digests
        db = mongodb_client.get_db()
        sliced_news = list(db[NEWS_TABLE_NAME].find({'digest':{'$in':sliced_news_digests}}))
    else:
        db = mongodb_client.get_db()
        total_news = list(db[NEWS_TABLE_NAME].find().sort([('publishedAt', -1)]).limit(NEWS_LIMIT))
        total_news_digests = map(lambda x:x['digest'], total_news)

        redis_client.set(user_id, pickle.dumps(total_news_digests))
        redis_client.expire(user_id, USER_NEWS_TIME_OUT_IN_SECONDS)

        sliced_news = total_news[begin_index:end_index]

    # Get preference for the user
    preference = news_recommendation_service_client.getPreferenceForUser(user_id)
    topPreference = None

    if preference is not None and len(preference) > 0:
        topPreference = preference[0]

    for news in sliced_news:
        # Remove text field to save bandwidth.
        del news['text']
        if news['class'] == topPreference:
            news['reason'] = 'Recommend'
        if news['publishedAt'].date() == datetime.today().date():
            news['time'] = 'today'
    return json.loads(dumps(sliced_news))

def logNewsClickForUser(user_id, news_id):
    message = {'userId': user_id, 'newsId': news_id, 'timestamp': datetime.utcnow()}

    db = mongodb_client.get_db()
    db[CLICK_LOGS_TABLE_NAME].insert(message)

    # Send log task to machine learning service for prediction
    message = {'userId': user_id, 'newsId': news_id, 'timestamp': str(datetime.utcnow())}
    cloudAMQP_client.sendMessage(message);

def updateNewsStatus(news_id):
    db = mongodb_client.get_db()
    target_news = db[NEWS_TABLE_NAME].find_one({'digest':news_id})
    if target_news['saved'] == True:
        target_news['saved'] = False
    else:
        target_news['saved'] = True
    return json.loads(dumps(target_news))