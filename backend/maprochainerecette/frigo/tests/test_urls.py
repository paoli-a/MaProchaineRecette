import pytest
from django.urls import resolve

from .factories import ingredientFrigo


pytestmark = pytest.mark.django_db


def test_recette_detail_resolve_does_not_raise_404(ingredientFrigo):
    url = f"/catalogues/recettes/{ingredientFrigo.id}/"
    assert resolve(url)
