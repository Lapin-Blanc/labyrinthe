from django.db import models

class Player(models.Model):
  nickname = models.CharField('Pseudo', max_length=50, unique=True)

  def __str__(self):
    return "Joueur {}".format(self.nickname)


class Game(models.Model):
  name = models.CharField('Nom de la partie', max_length=50, unique=True, blank=False, null=False)
  over = models.BooleanField('Game over', default=False)
  player_one = models.ForeignKey(Player, 
        verbose_name = 'Joueur un',
        on_delete = models.SET_NULL,
        null = True,
        related_name = 'player_one')
  player_two = models.ForeignKey(Player, 
        verbose_name = 'Joueur deux',
        on_delete = models.SET_NULL,
        null = True,
        related_name = 'player_two')
  
  def __str__(self):
    return "Partie {}".format(self.name)
  

class Rounds(models.Model):
  round_number = models.IntegerField('Round number', default=1)
  player_one_code = models.TextField('Player one code', blank=True, default='')
  p_one_submitted = models.BooleanField('Player one submitted code', default=False)
  p_two_submitted = models.BooleanField('Player two submitted code', default=False)
  player_two_code = models.TextField('Player two code', blank=True, default='')
  last_active = models.IntegerField('Last player', default=0)
  over = models.BooleanField('Round over', default=False)
  game = models.ForeignKey(Game, on_delete=models.CASCADE)
  
  def __str__(self):
    return "Round {}, c1 = {}, c2={} last active {}, over = {}".format(
        self.round_number,
        self.player_one_code[:10],
        self.player_two_code[:10],
        self.last_active,
        self.over)
