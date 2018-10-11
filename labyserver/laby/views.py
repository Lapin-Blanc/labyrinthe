from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.db import IntegrityError

from .models import Game, Rounds


def index(request):
    game_list = Game.objects.all()
    return render(request, 'index.html', {'game_list':game_list})

def createGame(request):
    new_game = Game(name=request.POST['game-name'])
    game_list = Game.objects.all()
    if len(new_game.name) < 5:
      return render(request, 'index.html', {
          'error_message': "Le nom de la partie doit faire au moins 5 caractères",
          'game_list':game_list
       })
    try:
      new_game.save()
    except (IntegrityError):
      return render(request, 'index.html', {
          'error_message': "Une partie avec ce nom existe déjà",
          'game_list':game_list
       })
    # Always return an HttpResponseRedirect after successfully dealing
    # with POST data. This prevents data from being posted twice if a
    # user hits the Back button.
    # ~ return HttpResponseRedirect(reverse('polls:index', args=(question.id,)))
    return HttpResponseRedirect(reverse('laby:game', args=(new_game.id,)))

def gameView(request, game_id):
  ctxt = {}
  g = Game.objects.get(id=game_id)
  ctxt['game'] = g
  rounds = g.rounds_set.all()
  if not rounds : # First round, first player
    r = g.rounds_set.create()
  else:
    r = g.rounds_set.last()
  ctxt['player'] = r.last_active
  r.last_active = (r.last_active + 1) % 2
  r.save()
  ctxt['code'] = '';
  ctxt['round_number'] = r.round_number
  return render(request, 'game.html', ctxt)
  

def getCode(request):
  if request.method == "POST":
    game = Game.objects.get(id=request.POST['game_id'])
    current_round = game.rounds_set.filter(round_number=request.POST['round_number']).last()
    player = request.POST['player']
    code = request.POST['code']
    if player == '0' :
      current_round.player_one_code = code
      current_round.p_one_submitted = True
      current_round.save()
      if current_round.p_two_submitted :
        current_round.over = True
        current_round.save()
        new_round = Rounds(game=game, round_number = current_round.round_number + 1)
        new_round.save()
        response = JsonResponse({
          'code': current_round.player_two_code,
          'next_round' : new_round.round_number
        }, status=200)
        return response
      else :
        response = JsonResponse({'reason': 'waiting for player two\'s code'}, status=202)
        return response
    
    if player == '1' :
      current_round.player_two_code = code
      current_round.p_two_submitted = True
      current_round.save()
      if current_round.p_one_submitted :
        current_round.over = True
        current_round.save()
        new_round = Rounds(game=game, round_number = current_round.round_number + 1)
        new_round.save()
        response = JsonResponse({
          'code': current_round.player_one_code,
          'next_round' : new_round.round_number
        }, status=200)
        return response
      else :
        response = JsonResponse({'reason': 'waiting for player one\'s code'}, status=202)
        return response
