import uuid

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    """Default user for My Next Recipe."""

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    id = models.UUIDField(
        verbose_name=_("Public identifier"),
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    email = models.EmailField(_("Email address"), unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = "email"

    objects = UserManager()

    def __str__(self):
        return self.email
