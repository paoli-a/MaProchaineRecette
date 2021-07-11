import pytest

from ..models import User

from .factories import UserFactory

pytestmark = pytest.mark.django_db

def test_user_str():
    user = UserFactory(email="john@doe.com")
    assert str(user) == "john@doe.com"


def test_user_manager_create_user_raises_exception_if_no_email():
    with pytest.raises(ValueError, match="mail"):
        User.objects.create_user(email="")


def test_user_manager_create_user_normalizes_email():
    user = User.objects.create_user(
        email="John@Doe.com"
    )
    assert user.email == "John@doe.com"


def test_user_manager_create_user_does_not_set_user_as_staff_or_superuser():
    user = User.objects.create_user(
        email="john@doe.com"
    )
    assert not user.is_staff
    assert not user.is_superuser


def test_user_manager_create_superuser_sets_user_as_staff_and_superuser():
    user = User.objects.create_superuser(
        email="john@doe.com"
    )
    assert user.is_staff
    assert user.is_superuser
