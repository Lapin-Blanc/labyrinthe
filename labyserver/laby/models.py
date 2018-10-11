from django.db import models


class Games(models.Model):
  player_one_code = models.TextField('Player one code', blank=True, null=True)
  player_two_code = models.TextField('Player two code', blank=True, null=True)
  last_connected = models.IntegerField('Last player connected', default=1)
