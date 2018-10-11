from django.urls import path
from .views import index, gameView, getCode, createGame

app_name = 'laby'
urlpatterns = [
    path('', index, name='index'),
    path('<int:game_id>/', gameView, name='game'),
    path('create/', createGame, name='create'),
    path('json/', getCode, name='json'),
]
