import random
from datetime import timedelta

import factory
import factory.fuzzy
from catalogs.models import Category, Ingredient, Recipe, RecipeIngredient
from units.tests.factories import UnitFactory


class IngredientFactory(factory.django.DjangoModelFactory):
    name = factory.fuzzy.FuzzyText()

    class Meta:
        model = Ingredient


class FuzzyDuration(factory.fuzzy.BaseFuzzyAttribute):
    """Custom fuzzy factory for generating timedelta."""

    def fuzz(self) -> timedelta:
        """Generate fuzzy value for DurationField.

        Returns:
            A value that will fit with DurationField

        """
        return timedelta(
            minutes=random.randint(0, 59), hours=random.randint(0, 23)  # noqa: S311
        )


class RecipeFactory(factory.django.DjangoModelFactory):
    title = factory.fuzzy.FuzzyText()
    description = factory.fuzzy.FuzzyText()
    duration = FuzzyDuration()

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
        model = Recipe


class RecipeIngredientFactory(factory.django.DjangoModelFactory):
    ingredient = factory.SubFactory(IngredientFactory)
    amount = factory.fuzzy.FuzzyDecimal(0)
    unit = factory.SubFactory(UnitFactory)

    class Meta:
        model = RecipeIngredient


class CategoryFactory(factory.django.DjangoModelFactory):
    name = factory.fuzzy.FuzzyText()

    class Meta:
        model = Category
