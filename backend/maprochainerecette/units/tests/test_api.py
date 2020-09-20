import pytest
from pytest_django.asserts import assertContains
from rest_framework.test import APIRequestFactory
from units.api import UnitViewSet
from units.tests.factories import UnitFactory

pytestmark = pytest.mark.django_db


def test_unit_list_contains_2_units():
    unit1 = UnitFactory()
    unit2 = UnitFactory()
    url = _get_unit_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = UnitViewSet.as_view({"get": "list"})(request)
    assert response.status_code == 200
    assertContains(response, unit1.abbreviation)
    assertContains(response, unit2.abbreviation)


def test_unit_list_has_correct_fields():
    UnitFactory(abbreviation="kg")
    url = _get_unit_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = UnitViewSet.as_view({"get": "list"})(request)
    assert len(response.data) == 1
    assert response.data[0] == "kg"


def _get_unit_list_absolute_url():
    view = UnitViewSet()
    view.basename = "units"
    view.request = None
    return view.reverse_action("list")
