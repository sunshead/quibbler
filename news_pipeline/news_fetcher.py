# -*- coding: utf-8 -*-

import os
import sys

from newspaper import Article

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
sys.path.append(os.path.join(os.path.dirname(__file__), 'scrapers'))

import cnn_news_scraper
from cloudAMQP_client import CloudAMQPClient

import yaml
with open('../config.yaml') as ymlfile:
    config = yaml.load(ymlfile)

# Use your own Cloud AMQP queue
DEDUPE_NEWS_TASK_QUEUE_URL = config['amqp']['dedupe_news_task_queue_url']
DEDUPE_NEWS_TASK_QUEUE_NAME = config['amqp']['dedupe_news_task_queue_name']
SCRAPE_NEWS_TASK_QUEUE_URL = config['amqp']['scrape_news_task_queue_url']
SCRAPE_NEWS_TASK_QUEUE_NAME = config['amqp']['scrape_news_task_queue_name']

SLEEP_TIME_IN_SECONDS = config['amqp']['fetcher_sleep_time_in_seconds']

dedupe_news_queue_client = CloudAMQPClient(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)
scrape_news_queue_client = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)

def handle_message(msg):
    if msg is None or not isinstance(msg, dict):
        print 'message is broken'
        return

    task = msg
    text = None

    article = Article(task['url'])
    article.download()
    article.parse()

    print article.text

    task['text'] = article.text
    dedupe_news_queue_client.sendMessage(task)

while True:
    # fetch msg from queue
    if scrape_news_queue_client is not None:
        msg = scrape_news_queue_client.getMessage()
        if msg is not None:
            # Handle message
            try:
                handle_message(msg)
            except Exception as e:
                print e
                pass
        scrape_news_queue_client.sleep(SLEEP_TIME_IN_SECONDS)