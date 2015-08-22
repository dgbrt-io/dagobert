from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from app.serializers import UserSerializer, GroupSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from app.models import Asset, Rate
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

@csrf_exempt
@api_view(['POST'])
def poll_markets(request):
    """
    Updates market data
    """
    assets = Asset.objects.all()

    for asset in assets:
        json = yql('select * from yahoo.finance.quotes where symbol = "%s"' % asset.name)
        quote = json['quote']
        rate = Rate(asset=asset, date_time=timezone.now(), exchange=quote['StockExchange'], bid=quote['Bid'], ask=quote['Ask'], last=quote['LastTradePriceOnly'])
        rate.save()

    print('>>> Successfully updated asset rates')
    return Response('OK')
