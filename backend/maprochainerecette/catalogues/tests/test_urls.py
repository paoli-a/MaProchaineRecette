import pytest
from django.urls import resolve

from .factories import IngredientFactory, ingredient


pytestmark = pytest.mark.django_db


def test_detail_resolve_does_not_raise_404(ingredient):
    url = f"/catalogues/ingredients/{ingredient.nom}/"
    assert resolve(url)
