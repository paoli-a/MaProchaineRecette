from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class UserChangeForm(forms.ModelForm):
    """A form for updating users.

    Includes all the fields on the user, but replaces the password
    field with admin's password hash display field.

    """

    password = ReadOnlyPasswordHashField(
        label=("Password"),
        help_text=(
            "Raw passwords are not stored, so there is no way to see "
            "this user's password, but you can change the password "
            'using <a href="../password/">this form</a>.'
        ),
    )

    class Meta:
        model = User
        fields = (
            "email",
            "password",
            "is_active",
            "is_admin",
        )

    def clean_password(self):
        """Return the initial value regardless of what the user provides.

        This is done here, rather than on the field, because the
        field does not have access to the initial value

        Returns:
            The initial password.

        """
        return self.initial["password"]


class UserCreationForm(forms.ModelForm):
    """A form for creating new users.

    Includes all the required fields, plus a repeated password.

    """

    password1 = forms.CharField(label=_("Password"), widget=forms.PasswordInput)
    password2 = forms.CharField(
        label=_("Password confirmation"), widget=forms.PasswordInput
    )

    class Meta:
        model = User
        fields = (
            "email",
        )

    def clean_password2(self):
        """Check that the two password entries match.

        Returns:
            The resulting password.

        Raises:
            ValidationError: if the two passwords do not match.

        """
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError(_("Passwords don't match."))
        return password2

    def clean_email(self):
        """Check the unicity of the email.

        Returns:
            Unique email.

        Raises:
            ValidationError: if the email is not unique.

        """
        email = self.cleaned_data["email"]

        try:
            User.objects.get(email=email)
        except User.DoesNotExist:
            return email

        raise ValidationError(_("This email has already been taken."))

    def save(self, commit=True):
        """Save the provided password in hashed format.

        Args:
            commit: whether the user should be saved on the database or not.

        Returns:
            The user with the hashed password.

        """
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user
