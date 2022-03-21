import React, { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  CatalogRecipe,
  FridgeRecipe,
  RecipeIngredient,
  SuggestionElement,
} from "../../constants/types";
import { useCatalogIngredients, useUnits } from "../../hooks";
import InputSuggestions from "../InputSuggestions/InputSuggestions";
import { FormInputs } from "./RecipesForm";

type RecipeIngredientFormProps = {
  recipeToEdit: null | FridgeRecipe | CatalogRecipe;
};

function RecipeIngredientForm({
  recipeToEdit,
}: RecipeIngredientFormProps): JSX.Element {
  const {
    register,
    formState: { errors },
    watch,
    control,
  } = useFormContext<FormInputs>();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "recipeIngredients",
  });

  const { catalogIngredients } = useCatalogIngredients();
  const { units } = useUnits();

  useEffect(() => {
    if (recipeToEdit) {
      replace(recipeToEdit.ingredients);
    }
  }, [recipeToEdit, replace]);

  function getCleanedIngredients() {
    const ingredients = watch(`recipeIngredients`);
    return ingredients.map(function eliminateEmptyIngredient(
      ingredient: RecipeIngredient
    ) {
      if (!ingredient.ingredient && !ingredient.amount && !ingredient.unit) {
        return null;
      } else return ingredient;
    });
  }

  function validateIngredients(index: number) {
    const ingredients = getCleanedIngredients();
    const noIngredientsFilledAtAll = ingredients.every(
      (ingredient) => ingredient === null
    );
    if (noIngredientsFilledAtAll) {
      return "Il faut au moins un ingrédient dans la recette";
    } else if (ingredients[index] === null) {
      return true;
    }

    const ingredientNames = ingredients
      .map((recipeIngredients) => recipeIngredients?.ingredient)
      .slice();
    const ingredient = ingredientNames[index];

    let authorized = false;
    for (const ingredientPossible of catalogIngredients) {
      if (ingredientPossible.name === ingredient) {
        authorized = true;
        break;
      }
    }
    if (!authorized) {
      return "Cet ingrédient n'existe pas dans le catalogue d'ingrédients. Vous pouvez l'y ajouter ";
    }

    ingredientNames.splice(index, 1);
    if (ingredientNames.includes(ingredient)) {
      return "Vous ne pouvez pas ajouter plusieurs fois le même ingrédient";
    }

    return true;
  }

  function validateAmounts(index: number) {
    const amount = watch(`recipeIngredients.${index}.amount`);
    const ingredients = getCleanedIngredients();
    const noIngredientsFilledAtAll = ingredients.every(
      (ingredient) => ingredient === null
    );
    if (noIngredientsFilledAtAll) {
      return false;
    } else if (ingredients[index] === null) {
      return true;
    }
    if (amount === "") {
      return "Ce champ est obligatoire";
    }

    if (parseFloat(amount) <= 0) {
      return "La quantité doit être supérieure à 0";
    } else return true;
  }

  function validateUnits(index: number) {
    const unit = watch(`recipeIngredients.${index}.unit`);
    const ingredients = getCleanedIngredients();
    const noIngredientsFilledAtAll = ingredients.every(
      (ingredient) => ingredient === null
    );
    if (noIngredientsFilledAtAll) {
      return false;
    } else if (ingredients[index] === null) {
      return true;
    }
    if (unit === "") {
      return "Ce champ est obligatoire";
    }
    return true;
  }

  return (
    <fieldset className="form form-ingredient-recipe">
      <legend>Ingrédients :</legend>
      <div className="form__paragraph">
        <ul>
          {fields.map((item, index) => {
            return (
              <li key={item.id}>
                <label className="form__label" htmlFor={`ingredient${index}`}>
                  Nom
                </label>
                <InputSuggestions
                  className={
                    errors?.[`recipeIngredients`]?.[index]?.ingredient
                      ? "form__input field-error"
                      : "form__input"
                  }
                  elements={catalogIngredients}
                  id={`ingredient${index}`}
                  getElementText={(ingredient: SuggestionElement) =>
                    ingredient.name
                  }
                  {...register(`recipeIngredients.${index}.ingredient`, {
                    validate: () => validateIngredients(index),
                  })}
                  type="text"
                  aria-required="true"
                />
                {errors?.[`recipeIngredients`]?.[index]?.ingredient && (
                  <p className="form__error-message" role="alert">
                    {errors[`recipeIngredients`][index].ingredient?.message}
                  </p>
                )}
                <label
                  className="form__label"
                  htmlFor={`ingredientAmount${index}`}
                >
                  Quantité nécessaire
                </label>
                <span className="form__combined-container">
                  <input
                    className="form__combined-input"
                    type="number"
                    id={`ingredientAmount${index}`}
                    min="0"
                    step=".01"
                    {...register(`recipeIngredients.${index}.amount`, {
                      validate: () => validateAmounts(index),
                    })}
                    aria-required="true"
                  />
                  {errors?.[`recipeIngredients`]?.[index]?.amount && (
                    <p className="form__error-message" role="alert">
                      {errors[`recipeIngredients`][index].amount?.message}
                    </p>
                  )}
                  <select
                    className="form__combined-select"
                    aria-label="Unité"
                    {...register(`recipeIngredients.${index}.unit`, {
                      validate: () => validateUnits(index),
                    })}
                    aria-required="true"
                  >
                    <option value="">...</option>
                    {units.map((unit: string) => {
                      return (
                        <option value={unit} key={unit}>
                          {unit}
                        </option>
                      );
                    })}
                  </select>
                  {errors?.[`recipeIngredients`]?.[index]?.unit && (
                    <p className="form__error-message" role="alert">
                      {errors[`recipeIngredients`][index].unit?.message}
                    </p>
                  )}
                </span>
                {index === fields.length - 1 ? (
                  <button
                    aria-label="Ingredient supplémentaire (plus)"
                    type="button"
                    onClick={() => append({})}
                  >
                    +
                  </button>
                ) : (
                  <button
                    aria-label="Supprimer cet ingredient (moins)"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    -
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </fieldset>
  );
}

export default RecipeIngredientForm;
