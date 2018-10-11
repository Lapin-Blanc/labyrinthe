from django.db import models


class Rounds(models.Model):
  round_number = models.IntegerField('Round number', default=1)
  player_one_code = models.TextField('Player one code', blank=True, default='')
  p_one_submitted = models.BooleanField('Player one submitted code', default=False)
  p_two_submitted = models.BooleanField('Player two submitted code', default=False)
  player_two_code = models.TextField('Player two code', blank=True, default='')
  last_active = models.IntegerField('Last player', default=0)
  over = models.BooleanField('Round over', default=False)
  
  def __str__(self):
    return "Round {}, last active {}, over = {}".format(
      self.round_number,
      self.last_active,
      self.over
    )
