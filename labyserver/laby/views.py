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
    r_num = int(request.POST['round_number'])
    player = int(request.POST['player'])
    code = request.POST['code']    
    r = game.rounds_set.get(round_number=r_num, over=False)
    if player == 0 :
      if not r.p_one_submitted:
        r.player_one_code = code
        r.p_one_submitted = True
        r.save()
      if r.p_two_submitted :
        response = JsonResponse({
          'code': r.player_two_code,
          }, status=200)
      else :
        response = JsonResponse({
          'reason': 'waiting for player two\'s code'
          }, status=202)
    if player == 1 :
      if not r.p_two_submitted:
        r.player_two_code = code
        r.p_two_submitted = True
        r.save()
      if r.p_one_submitted :
        response = JsonResponse({
          'code': r.player_one_code,
          }, status=200)
      else :
        response = JsonResponse({
          'reason': 'waiting for player two\'s code'
          }, status=202)
    return response

def endRound(request):
  if request.method == "POST":
    game = Game.objects.get(id=request.POST['game_id'])
    r_num = int(request.POST['round_number'])
    player = int(request.POST['player'])
    r = game.rounds_set.get(round_number=r_num)
    if player == 0 :
      r.p_one_ran = True
    if player == 1 :
      r.p_two_ran = True
    if (r.p_one_ran and r.p_two_ran):
      r.over = True
      game.rounds_set.create(round_number=r_num+1)
    r.save()
    response = JsonResponse({
      'next_round': r_num+1,
      }, status=200)
    return response
    
    
