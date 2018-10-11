from django.shortcuts import render
from django.http import HttpResponse
from .models import Games
from django.shortcuts import render


def gameView(request):
  d = {}  
  game = Games.objects.get(pk=1)
  if game.last_connected == 1:
    game.last_connected = 0
    game.player_one_code = "";
    game.player_two_code = "";
    game.save()
    d['player'] = 0
    d['code'] = game.player_one_code
    
  else:
    game.last_connected = 1
    game.save()
    d['player'] = 1
    d['code'] = game.player_two_code
  
  return render(request, 'index.html', d)
  

def getCode(request):
  if request.method == "POST":
    game = Games.objects.get(pk=1)
    player = request.POST['player']
    code = request.POST['code']

    if player == '0' :
      print(code)
      game.player_one_code = code
      game.save()
      if game.player_two_code :
        return HttpResponse(game.player_two_code, status=200)
      else :
        return HttpResponse(status=202)
    else :
      print(code)
      game.player_two_code = code
      game.save()
      if game.player_one_code :
        return HttpResponse(game.player_one_code, status=200)
      else :
        return HttpResponse(status=202)
