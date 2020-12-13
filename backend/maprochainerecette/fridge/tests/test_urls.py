import pytest
from django.urls import resolve

pytestmark = pytest.mark.django_db


def test_recipe_detail_resolve_does_not_raise_404(fridge_ingredient):
    url = f"/api/fridge/ingredients/{fridge_ingredient.id}/"
    assert resolve(url)
