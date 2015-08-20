from django.db import models

class Asset(models.Model):
	isin = models.CharField(max_length=200, primary_key=True)
	name = models.CharField(max_length=200, blank=False)
	asset_type = models.CharField(max_length=200)

	def __unicode__(self):
		return u'ISIN: %s,  NAME: %s, ASSET TYPE: %s' % (self.isin, self.name, self.asset_type)

class Rate(models.Model):
	asset = models.ForeignKey('Asset')
	date_time = models.DateTimeField(blank=False)
	exchange = models.CharField(max_length=200, blank=False)
	currency = models.CharField(max_length=200, blank=False)
	bid = models.DecimalField(max_digits=19, decimal_places=10, blank=False)
	ask = models.DecimalField(max_digits=19, decimal_places=10, blank=False)
	last = models.DecimalField(max_digits=19, decimal_places=10, blank=False)

	def __unicode__(self):
		return u'asset (isin): %s, date_time: %s, exchange: %s, bid: %s, ask: %s, last: %s' % (self.asset.isin, self.date_time, self.exchange, self.bid, self.ask, self.last)

class Watchlist(models.Model):
	name = models.CharField(max_length=200)
	description = models.CharField(max_length=200)
	assets = models.ManyToManyField(Asset)
