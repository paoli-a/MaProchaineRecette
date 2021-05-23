import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputSuggestions from "../InputSuggestions/InputSuggestions";
import PropTypes from "prop-types";
import produce from "immer";
import {
  useCatalogIngredients,
  useCategories,
  useUnits,
} from "../../hooks/swrFetch";

function RecipesForm({ onSubmitRecipe }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
  } = useForm();
  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientAmount, setIngredientAmount] = useState("");
  const [ingredientUnit, setIngredientUnit] = useState("");
  const [ingredientError, setIngredientError] = useState("");
  const { catalogIngredients } = useCatalogIngredients();
  const { categories } = useCategories();
  const { units } = useUnits();

  const onSubmitForm = (data) => {
    if (ingredients.length === 0) {
      setIngredientError(
        "Au moins un ingrédient doit être présent dans la recette"
      );
      return;
    }
    const newData = produce(data, (draftState) => {
      draftState.ingredients = ingredients;
    });
    onSubmitRecipe(newData);
    reset();
    setIngredients([]);
    resetIngredient();
  };

  const resetIngredient = () => {
    setIngredientName("");
    setIngredientAmount("");
    setIngredientUnit("");
    setIngredientError("");
  };

  class UnauthorizedIngredient extends Error {}

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
    for (let ingredientExistant of ingredients) {
      if (ingredientExistant.ingredient === ingredientName) {
        throw new Error("Cet ingrédient a déjà été ajouté");
      }
    }
    if (ingredientAmount <= 0) {
      throw new Error("La quantité doit être supérieure à 0");
    }
  };

  const handleAddIngredient = (event) => {
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
      } else {
        setIngredientError(error.message);
      }
    }
  };

  const handleSupprIngredient = (name) => {
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

  const validateCategories = () => {
    for (let i = 0; i < categories.length; i++) {
      if (watch(`categories[${i}]`)) {
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
        <legend>Ajouter une recette dans mon catalogue :</legend>
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
              aria-invalid={errors.ingredientName ? "true" : "false"}
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
            {categories.map((category, index) => {
              return (
                <li key={category}>
                  <input
                    type="checkbox"
                    value={category}
                    aria-label={category}
                    {...register(`categories[${index}]`, {
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
            <label className="form__label" htmlFor="ingredient">
              {" "}
              Nom :{" "}
            </label>
            <InputSuggestions
              className="form__input"
              elements={catalogIngredients}
              id="ingredient"
              getElementText={(ingredient) => ingredient.name}
              onChangeValue={(name) => setIngredientName(name)}
              value={ingredientName}
              name="ingredient"
              type="text"
              aria-required="true"
            />
          </div>
          <p className="form__paragraph">
            <label className="form__label" htmlFor="ingredientAmount">
              {" "}
              Quantité nécessaire :{" "}
            </label>
            <span className="form__combined-container">
              <input
                className="form__combined-input"
                type="number"
                name="ingredientAmount"
                id="ingredientAmount"
                min="0"
                onChange={(e) => setIngredientAmount(e.target.value)}
                value={ingredientAmount}
                aria-required="true"
              />
              <select
                className="form__combined-select"
                name="unit"
                aria-label="Unité"
                onChange={(e) => setIngredientUnit(e.target.value)}
                onBlur={(e) => setIngredientUnit(e.target.value)}
                value={ingredientUnit}
                aria-required="true"
              >
                <option value="">...</option>
                {units.map((unit) => {
                  return (
                    <option value={unit} key={unit}>
                      {unit}
                    </option>
                  );
                })}
              </select>
            </span>
          </p>
          <div className="form__paragraph">
            <button className="button" onClick={handleAddIngredient}>
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
            value="Confirmer"
          />
        </p>
      </fieldset>
    </form>
  );
}

RecipesForm.propTypes = {
  /**
   * Cette fonction est exécutée au moment du submit de de la recette,
   * lorsque la validité de tous les éléments entrés a été vérifiée,
   * et permet de les récupérer.
   */
  onSubmitRecipe: PropTypes.func.isRequired,
};

export default RecipesForm;
