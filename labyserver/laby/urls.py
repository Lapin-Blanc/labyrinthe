from django.urls import path
from .views import gameView, getCode


urlpatterns = [
    path('', gameView),
    path('xml/', getCode),
]
