from django.contrib import admin
from .models import Game, Rounds
# Register your models here.

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
  pass

@admin.register(Rounds)
class RoundsAdmin(admin.ModelAdmin):
  pass
