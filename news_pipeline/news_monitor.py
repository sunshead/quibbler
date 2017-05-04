# -*- coding: utf-8 -*-

import datetime
import hashlib
import os
import redis
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
print(sys.path)

import news_api_client
from cloudAMQP_client import CloudAMQPClient

import yaml

with open('../config.yaml') as ymlfile:
    config = yaml.load(ymlfile)

REDIS_HOST = config['redis']['host']
REDIS_PORT = config['redis']['port']

SCRAPE_NEWS_TASK_QUEUE_URL = config['amqp']['scrape_news_task_queue_url']
SCRAPE_NEWS_TASK_QUEUE_NAME = config['amqp']['scrape_news_task_queue_name']

NEWS_TIME_OUT_IN_SECONDS = config['redis']['news_time_out_in_seconds']
SLEEP_TIME_IN_SECONDS = config['amqp']['monitor_sleep_time_in_seconds']

NEWS_SOURCES = config['news_sources']

#provides a Python interface to all Redis commands and an implementation of the Redis protocol
redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT)
cloudAMQP_client = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)

while True: #buduan de call news API
    news_list = news_api_client.getNewsFromSource(NEWS_SOURCES)

    num_of_new_news = 0

    for news in news_list:
        news_digest =  hashlib.md5(news['title'].encode('utf-8')).digest().encode('base64') #md5 hash for cha chong

        if redis_client.get(news_digest) is None: #see if there's duplicate in redis db
            num_of_new_news = num_of_new_news + 1
            news['digest'] = news_digest

            if news['publishedAt'] is None:
                # format: YYYY-MM-DDTHH:MM:SS in UTC
                news['publishedAt'] = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

    #set(name, value, ex=None, px=None, nx=False, xx=False) -- Set the value at key name to value

    #ex - sets an expire flag on key name for ex seconds.

    #px - sets an expire flag on key name for px milliseconds.

    #nx - if set to True, set the value at key name to value if it
    #does not already exist.

    #xx - if set to True, set the value at key name to value if it
    #already exists.
            redis_client.set(news_digest, news, ex=NEWS_TIME_OUT_IN_SECONDS)
           #redis_client.expire(news_digest, NEWS_TIME_OUT_IN_SECONDS)

            cloudAMQP_client.sendMessage(news)

    print "Fetched %d new news." % num_of_new_news


    cloudAMQP_client.sleep(SLEEP_TIME_IN_SECONDS)