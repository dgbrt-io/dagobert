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
	price = models.DecimalField(max_digits=19, decimal_places=10)

class Watchlist(models.Model):
	name = models.CharField(max_length=200)
	description = models.CharField(max_length=200)
	assets = models.ManyToManyField(Asset)
