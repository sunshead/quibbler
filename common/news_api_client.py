import requests

from json import loads

import yaml

with open('../config.yaml') as ymlfile:
    config = yaml.load(ymlfile)

NEWS_API_ENDPOINT = config['news_api']['endpoint']
NEWS_API_KEY = config['news_api']['key']
ARTICLES_API = config['news_api']['articles_api']

CNN = 'cnn'
DEFAULT_SOURCES = [CNN]

SORT_BY_TOP = 'top'

def buildUrl(end_point=NEWS_API_ENDPOINT, api_name=ARTICLES_API):
    return end_point + api_name

def getNewsFromSource(sources=DEFAULT_SOURCES, sortBy=SORT_BY_TOP):
    articles = []
    for source in sources:
        payload = {'apiKey' : NEWS_API_KEY,
                   'source' : source,
                   'sortBy': sortBy}
        response = requests.get(buildUrl(), params=payload, verify=False)
        print response
        res_json = loads(response.content)

        # extract info from response
        if (res_json is not None and
            res_json['status'] == 'ok' and
            res_json['source'] is not None):
            #populate news
            for news in res_json['articles']:
                news['source'] = res_json['source']

            articles.extend(res_json['articles']) #merge two lists
    return articles