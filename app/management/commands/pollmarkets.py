from django.core.management.base import BaseCommand, CommandError
from app.models import Asset, Rate, Watchlist
from django.utils import timezone
import json
import requests


def yql(q, format="json", env="store://datatables.org/alltableswithkeys"):

    res = requests.get('https://query.yahooapis.com/v1/public/yql', params={
        'q': q,
        'format': format,
        'env': env
    })
    return res.json()['query']['results']

class Command(BaseCommand):
    help = 'Updates rates of all watchlist assets'

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):

        print('>>> Scanning assets')
        assets = Asset.objects.all()

        for asset in assets:
            json = yql('select * from yahoo.finance.quotes where symbol = "%s"' % asset.name)
            quote = json['quote']
            rate = Rate(asset=asset, date_time=timezone.now(), exchange=quote['StockExchange'], bid=quote['Bid'], ask=quote['Ask'], last=quote['LastTradePriceOnly'])
            rate.save()

        print('>>> Successfully updated asset rates')
        sleep(60)
