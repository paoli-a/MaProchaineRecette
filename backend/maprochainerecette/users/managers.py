from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """Custom model to use email as unique identifier instead of username."""

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a User with the given email and password.

        Args:
            email: the email mandatory field.
            password: the password mandatory field.
            extra_fields: the other fields of the User model.

        Returns:
            The created user.

        Raises:
            ValueError: email not provided.

        """
        if not email:
            raise ValueError(_("The Email must be set"))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a SuperUser with the given email and password.

        Args:
            email: the email mandatory field.
            password: the password mandatory field.
            extra_fields: the other fields of the User model.

        Returns:
            The created superuser.

        Raises:
            ValueError: staff or superuser property must be true.

        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))
        return self.create_user(email, password, **extra_fields)
