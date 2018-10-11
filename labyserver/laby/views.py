from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Rounds
from django.shortcuts import render


def gameView(request):
  d = {}
  current_round = Rounds.objects.filter(over__exact=False).last() # New round
  if (not current_round):
    current_round = Rounds()
    d['player'] = current_round.last_active
  else: # current round exists
    current_round.last_active = (current_round.last_active + 1) % 2
    d['player'] = current_round.last_active
  current_round.save()
  d['code'] = '';
  d['round_number'] = current_round.round_number
  return render(request, 'index.html', d)
  

def getCode(request):
  if request.method == "POST":
    current_round = Rounds.objects.filter(round_number__exact=request.POST['round_number']).last()
    player = request.POST['player']
    code = request.POST['code']
    if player == '0' :
      current_round.player_one_code = code
      current_round.p_one_submitted = True
      current_round.save()
      if current_round.p_two_submitted :
        current_round.over = True
        current_round.save()
        new_round = Rounds(round_number = current_round.round_number + 1)
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
        new_round = Rounds(round_number = current_round.round_number + 1)
        new_round.save()
        response = JsonResponse({
          'code': current_round.player_one_code,
          'next_round' : new_round.round_number
        }, status=200)
        return response
      else :
        response = JsonResponse({'reason': 'waiting for player one\'s code'}, status=202)
        return response
