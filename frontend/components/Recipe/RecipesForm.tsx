import produce from "immer";
import React, { MouseEvent, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  CatalogRecipe,
  FridgeRecipe,
  RecipeIngredient,
  SuggestionElement,
} from "../../constants/types";
import { useCatalogIngredients, useCategories, useUnits } from "../../hooks";
import InputSuggestions from "../InputSuggestions/InputSuggestions";

type FormInputs = {
  recipeTitle: string;
  recipeTime: string;
  recipeDescription: string;
  categories: string[];
  recipeIngredients: RecipeIngredient[];
};

type RecipesFormProps<T> = {
  /**
   * Cette fonction est exécutée au moment du submit de de la recette,
   * lorsque la validité de tous les éléments entrés a été vérifiée,
   * et permet de les récupérer.
   */
  onSubmitRecipe: (newData: FormInputs) => void;
  recipeToEdit: null | T;
  resetRecipeToEdit?: () => void;
};

function RecipesForm<T extends FridgeRecipe | CatalogRecipe>({
  onSubmitRecipe,
  recipeToEdit,
  resetRecipeToEdit,
}: RecipesFormProps<T>): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
    setValue,
    setFocus,
    control,
  } = useForm<FormInputs>({
    defaultValues: {
      recipeIngredients: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "recipeIngredients",
  });

  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientAmount, setIngredientAmount] = useState("");
  const [ingredientUnit, setIngredientUnit] = useState("");
  const [ingredientError, setIngredientError] = useState<JSX.Element | string>(
    ""
  );
  const { catalogIngredients } = useCatalogIngredients();
  const { categories } = useCategories();
  const { units } = useUnits();

  useEffect(() => {
    if (recipeToEdit) {
      setFocus("recipeTitle");
      setValue("recipeTitle", recipeToEdit.title);
      const categoriesToEdit: string[] = [];
      categories.forEach((category: string) => {
        if (recipeToEdit.categories.includes(category)) {
          categoriesToEdit.push(category);
        } else {
          categoriesToEdit.push("");
        }
        return categoriesToEdit;
      });
      setValue(`categories`, categoriesToEdit);
      setValue("recipeTime", recipeToEdit.duration);
      setValue("recipeDescription", recipeToEdit.description);
      setIngredients(recipeToEdit.ingredients);
    }
  }, [recipeToEdit, setFocus, categories, setValue]);

  const onSubmitForm = (data: FormInputs) => {
    /*if (ingredients.length === 0) {
      setIngredientError(
        "Au moins un ingrédient doit être présent dans la recette"
      );
      return;
    }*/

    onSubmitRecipe(data);
    reset();
  };

  const resetIngredient = () => {
    setIngredientName("");
    setIngredientAmount("");
    setIngredientUnit("");
    setIngredientError("");
  };

  class UnauthorizedIngredient extends Error {}

  function getCleanedIngredients() {
    const ingredients = watch(`recipeIngredients`);
    return ingredients.map(function eliminateEmptyIngredient(ingredient) {
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
    console.log("catalogIngredients ", catalogIngredients);
    console.log("ingredient ", ingredient);
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

    if (parseInt(amount, 10) <= 0) {
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

  const validateNewIngredient = () => {
    if (!ingredientName || !ingredientAmount || !ingredientUnit) {
      throw new Error(
        "Tous les champs concernant l'ingrédient doivent être remplis"
      );
    }
    let authorized = false;
    for (const ingredientPossible of catalogIngredients) {
      if (ingredientPossible.name === ingredientName) {
        authorized = true;
        break;
      }
    }
    if (!authorized) {
      throw new UnauthorizedIngredient(
        "Cet ingrédient n'existe pas dans le catalogue d'ingrédients. Vous pouvez l'y ajouter "
      );
    }
    for (const ingredientExistant of ingredients) {
      if (ingredientExistant.ingredient === ingredientName) {
        throw new Error("Cet ingrédient a déjà été ajouté");
      }
    }
    if (parseInt(ingredientAmount, 10) <= 0) {
      throw new Error("La quantité doit être supérieure à 0");
    }
  };

  const handleAddIngredient = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      validateNewIngredient();
      const newIngredients = produce(ingredients, (draftState) => {
        draftState.push({
          ingredient: ingredientName,
          amount: ingredientAmount,
          unit: ingredientUnit,
        });
      });
      setIngredients(newIngredients);
      resetIngredient();
    } catch (error) {
      if (error instanceof UnauthorizedIngredient) {
        const message = (
          <>
            {error.message}
            <a href="/#">ici</a>.
          </>
        );
        setIngredientError(message);
      } else if (error instanceof Error) {
        setIngredientError(error.message);
      }
    }
  };

  const handleSupprIngredient = (name: string) => {
    const ingredientsListUpdated = produce(ingredients, (draftState) => {
      for (let i = 0; i < draftState.length; i++) {
        if (draftState[i].ingredient === name) {
          draftState.splice(i, 1);
          return;
        }
      }
    });
    setIngredients(ingredientsListUpdated);
  };

  const handleCancelClick = () => {
    resetRecipeToEdit && resetRecipeToEdit();
    reset();
    setIngredients([]);
    resetIngredient();
  };

  const validateCategories = () => {
    for (let i = 0; i < categories.length; i++) {
      if (watch(`categories.${i}`)) {
        return true;
      }
    }
    return false;
  };

  const validateTime = () => {
    const hoursAndMinutes = getValues().recipeTime.split(":");
    const hours = parseInt(hoursAndMinutes[0], 10);
    const minutes = hoursAndMinutes[1] ? parseInt(hoursAndMinutes[1], 10) : 0;
    const time = hours + minutes / 60;
    if (time <= 0) {
      return "Le temps nécessaire pour la recette doit être supérieur à 0";
    } else return undefined;
  };
  return (
    <form className="form form-recipe" onSubmit={handleSubmit(onSubmitForm)}>
      <fieldset>
        <legend>
          {recipeToEdit
            ? "Modifier une recette de mon catalogue :"
            : "Ajouter une recette dans mon catalogue :"}
        </legend>
        <div className="form__paragraph">
          <label className="form__label" htmlFor="recipeTitle">
            {" "}
            Titre de la recette :{" "}
          </label>
          <div className="container-error">
            <input
              className={
                errors.recipeTitle ? "form__input field-error" : "form__input"
              }
              type="text"
              id="recipeTitle"
              defaultValue=""
              {...register("recipeTitle", { required: true })}
              aria-invalid={errors.recipeTitle ? "true" : "false"}
              aria-required="true"
            />
            {errors.recipeTitle && (
              <p className="form__error-message" role="alert">
                Ce champ est obligatoire
              </p>
            )}
          </div>
        </div>
        <div className="form__checkbox-container">
          Catégories :
          <ul>
            {categories.map((category: string, index: number) => {
              return (
                <li key={category}>
                  <input
                    type="checkbox"
                    value={category}
                    aria-label={category}
                    {...register(`categories.${index}`, {
                      validate: validateCategories,
                    })}
                    aria-invalid={errors.categories ? "true" : "false"}
                    id={`category-${index}`}
                  />
                  <label htmlFor={`category-${index}`}>{category}</label>
                </li>
              );
            })}
          </ul>
          {errors.categories && (
            <p className="form__error-message" role="alert">
              Au moins une catégorie doit être sélectionnée
            </p>
          )}
        </div>
        <div className="form__paragraph">
          <label className="form__label" htmlFor="recipeTime">
            {" "}
            Temps total de la recette :{" "}
          </label>
          <div className="container-error">
            <input
              className={
                errors.recipeTime ? "form__input field-error" : "form__input"
              }
              type="time"
              id="recipeTime"
              {...register("recipeTime", {
                required: "Ce champ est obligatoire",
                validate: validateTime,
              })}
              aria-invalid={errors.recipeTime ? "true" : "false"}
              aria-required="true"
            />
            {errors.recipeTime && (
              <p className="form__error-message" role="alert">
                {errors.recipeTime.message}
              </p>
            )}
          </div>
        </div>
        <fieldset className="form form-ingredient-recipe">
          <legend> Ingrédients : </legend>
          <div className="form__paragraph">
            <ul>
              {fields.map((item, index) => {
                return (
                  <li key={item.id}>
                    <label
                      className="form__label"
                      htmlFor={`ingredient${index}`}
                    >
                      Nom
                    </label>
                    <InputSuggestions
                      className={
                        errors[`recipeIngredients`] &&
                        errors[`recipeIngredients`][index] &&
                        errors[`recipeIngredients`][index].ingredient
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
                    {errors.recipeIngredients &&
                      errors[`recipeIngredients`][index] &&
                      errors[`recipeIngredients`][index].ingredient && (
                        <p className="form__error-message" role="alert">
                          {
                            errors[`recipeIngredients`][index].ingredient
                              ?.message
                          }
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
                        {...register(`recipeIngredients.${index}.amount`, {
                          validate: () => validateAmounts(index),
                        })}
                        aria-required="true"
                      />
                      {errors.recipeIngredients &&
                        errors[`recipeIngredients`][index] &&
                        errors[`recipeIngredients`][index].amount && (
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
                      {errors.recipeIngredients &&
                        errors[`recipeIngredients`][index] &&
                        errors[`recipeIngredients`][index].unit && (
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
          <div className="form__paragraph">
            <button
              className="button"
              onClick={handleAddIngredient}
              aria-label="Ajouter l'ingrédient"
            >
              Ajouter
            </button>
            {ingredientError && <p role="alert">{ingredientError}</p>}
          </div>
          <ul>
            {ingredients.map((ingredient) => {
              return (
                <li key={ingredient.ingredient}>
                  {ingredient.ingredient} : {ingredient.amount}{" "}
                  {ingredient.unit}
                  <button
                    className="button"
                    onClick={() => handleSupprIngredient(ingredient.ingredient)}
                  >
                    X
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>
        <div className="form__textarea-container">
          <label className="form__label" htmlFor="recipeDescription">
            Corps de la recette :{" "}
          </label>
          <textarea
            className={
              errors.recipeTime
                ? "form__textarea field-error"
                : "form__textarea"
            }
            id="recipeDescription"
            spellCheck="true"
            {...register("recipeDescription", { required: true })}
            aria-invalid={errors.recipeDescription ? "true" : "false"}
            aria-required="true"
          ></textarea>
          {errors.recipeDescription && (
            <p className="form__error-message" role="alert">
              Ce champ est obligatoire
            </p>
          )}
        </div>
        <p className="form__paragraph">
          <input
            className="button form__submit"
            type="submit"
            aria-label={
              recipeToEdit ? "Modifier la recette" : "Ajouter la recette"
            }
            value={recipeToEdit ? "Modifier" : "Ajouter"}
          />
          {recipeToEdit && (
            <button
              className="button form__cancel"
              type="reset"
              onClick={() => handleCancelClick()}
            >
              Annuler
            </button>
          )}
        </p>
      </fieldset>
    </form>
  );
}

export default RecipesForm;
export type { FormInputs };
