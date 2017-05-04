from cloudAMQP_client import CloudAMQPClient
import yaml

with open('../config.yaml') as ymlfile:
    config = yaml.load(ymlfile)

TEST_QUEUE_URL = config['amqp']['scrape_news_task_queue_url']

TEST_QUEUE_NAME = 'test'

def test_basic():
    client = CloudAMQPClient(TEST_QUEUE_URL, TEST_QUEUE_NAME)
    
    sentMsg = {'test': 'demo'}
    client.sendMessage(sentMsg)
    client.sleep(10)
    receivedMsg = client.getMessage()
    assert sentMsg == receivedMsg
    print 'test_basic passed!'

if __name__ == "__main__":
    test_basic()
