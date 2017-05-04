import cnn_news_scraper as scraper

EXPECTED_STRING = "the man charged with killing five people at the Fort Lauderdale airport"
CNN_NEWS_URL = "http://edition.cnn.com/2017/01/17/us/fort-lauderdale-shooter-isis-claim/index.html"

def test_basic():
    news = scraper.extract_news(CNN_NEWS_URL)

    assert EXPECTED_STRING in news
    print news
    print 'test_basic passed!'

if __name__ ==  "__main__":
    test_basic()