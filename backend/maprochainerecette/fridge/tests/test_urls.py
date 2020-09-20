import pytest
from django.urls import resolve

from .factories import fridgeIngredient

pytestmark = pytest.mark.django_db


def test_recipe_detail_resolve_does_not_raise_404(fridgeIngredient):
    url = f"/fridge/ingredients/{fridgeIngredient.id}/"
    assert resolve(url)
