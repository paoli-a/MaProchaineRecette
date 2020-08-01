import pytest
from pytest_django.asserts import (
    assertContains,
)

from rest_framework.test import APIRequestFactory

from unites.api import UniteViewSet
from unites.tests.factories import UniteFactory


pytestmark = pytest.mark.django_db


def test_unite_list_contains_2_unites():
    unite1 = UniteFactory()
    unite2 = UniteFactory()
    url = _get_unite_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = UniteViewSet.as_view({'get': 'list'})(request)
    assert response.status_code == 200
    assertContains(response, unite1.abbreviation)
    assertContains(response, unite2.abbreviation)


def test_unite_list_has_correct_fields():
    UniteFactory(abbreviation="kg")
    url = _get_unite_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = UniteViewSet.as_view({'get': 'list'})(request)
    assert len(response.data) == 1
    assert response.data[0] == "kg"


def _get_unite_list_absolute_url():
    view = UniteViewSet()
    view.basename = "unites"
    view.request = None
    return view.reverse_action("list")
