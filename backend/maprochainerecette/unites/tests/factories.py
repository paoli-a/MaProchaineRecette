import factory
import factory.fuzzy

from unites.models import Unite, TypeUnite


class TypeUniteFactory(factory.django.DjangoModelFactory):
    nom = factory.fuzzy.FuzzyText()

    class Meta:
        model = TypeUnite


class UniteFactory(factory.django.DjangoModelFactory):
    nom = factory.fuzzy.FuzzyText()
    abbreviation = factory.fuzzy.FuzzyText()
    rapport = factory.fuzzy.FuzzyDecimal(0.0000000001)
    type = factory.SubFactory(TypeUniteFactory)

    class Meta:
        model = Unite
