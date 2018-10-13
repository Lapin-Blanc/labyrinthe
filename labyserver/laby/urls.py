from django.urls import path
from .views import index, gameView, getCode, createGame, endRound

app_name = 'laby'
urlpatterns = [
    path('', index, name='index'),
    path('<int:game_id>/', gameView, name='game'),
    path('create/', createGame, name='create'),
    path('json/get_code', getCode, name='get_code'),
    path('json/end_round', endRound, name='end_round'),
]
