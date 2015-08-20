from django.contrib import admin

from .models import Asset, Rate, Watchlist

admin.site.register(Asset)
admin.site.register(Rate)
admin.site.register(Watchlist)
