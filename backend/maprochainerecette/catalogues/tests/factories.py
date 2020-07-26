from datetime import timedelta
import random

import factory
import factory.fuzzy
import pytest

from catalogues.models import Ingredient, Recette, Categorie, IngredientRecette
from unites.tests.factories import UniteFactory


@pytest.fixture
def ingredient():
    return IngredientFactory()


class IngredientFactory(factory.django.DjangoModelFactory):
    nom = factory.fuzzy.FuzzyText()

    class Meta:
        model = Ingredient


@pytest.fixture
def recette():
    ingredients, categories = [], []
    for _ in range(10):
        ingredients.append(IngredientRecetteFactory())
        categories.append(CategoryFactory())
    return RecetteFactory(ingredients=ingredients, categories=categories)


class FuzzyDuration(factory.fuzzy.BaseFuzzyAttribute):
    """Custom fuzzy factory for generating timedelta."""

    def fuzz(self) -> timedelta:
        """ Generate fuzzy value for DurationField.

        Returns:
            A value that will fit with DurationField

        """
        return timedelta(
            minutes=random.randint(0, 59),
            hours=random.randint(0, 23)
        )


class RecetteFactory(factory.django.DjangoModelFactory):
    titre = factory.fuzzy.FuzzyText()
    description = factory.fuzzy.FuzzyText()
    duree = FuzzyDuration()

    @factory.post_generation
    def ingredients(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for ingredient in extracted:
                self.ingredients.add(ingredient)

    @factory.post_generation
    def categories(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for categorie in extracted:
                self.categories.add(categorie)

    class Meta:
        model = Recette


class IngredientRecetteFactory(factory.django.DjangoModelFactory):
    ingredient = factory.SubFactory(IngredientFactory)
    quantite = factory.fuzzy.FuzzyDecimal(0)
    unite = factory.SubFactory(UniteFactory)

    class Meta:
        model = IngredientRecette


class CategoryFactory(factory.django.DjangoModelFactory):
    nom = factory.fuzzy.FuzzyText()

    class Meta:
        model = Categorie
