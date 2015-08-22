import requests

def yql(q, format="json", env="store://datatables.org/alltableswithkeys"):

    res = requests.get('https://query.yahooapis.com/v1/public/yql', params={
        'q': q,
        'format': format,
        'env': env
    })
    return res.json()['query']['results']
