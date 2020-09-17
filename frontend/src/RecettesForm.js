import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputSuggestions from "./InputSuggestions";
import PropTypes from "prop-types";

function RecettesForm({
  onSubmitRecette,
  possibleIngredients,
  totalCategories,
  totalUnits,
}) {
  const { register, handleSubmit, errors, reset, watch, getValues } = useForm();
  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientAmount, setIngredientAmount] = useState("");
  const [ingredientUnit, setIngredientUnit] = useState("");
  const [ingredientError, setIngredientError] = useState("");

  const onSubmitForm = (data) => {
    if (ingredients.length === 0) {
      setIngredientError(
        "Au moins un ingrédient doit être présent dans la recette"
      );
      return;
    }
    data.ingredients = ingredients.slice();
    onSubmitRecette(data);
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
    for (const ingredientPossible of possibleIngredients) {
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
      const newIngredients = ingredients.slice();
      newIngredients.push({
        ingredient: ingredientName,
        amount: ingredientAmount,
        unit: ingredientUnit,
      });
      setIngredients(newIngredients);
      resetIngredient();
    } catch (error) {
      if (error instanceof UnauthorizedIngredient) {
        const message = (
          <React.Fragment>
            {error.message}
            <a href="/#">ici</a>.
          </React.Fragment>
        );
        setIngredientError(message);
      } else {
        setIngredientError(error.message);
      }
    }
  };

  const handleSupprIngredient = (name) => {
    const ingredientsListUpdated = ingredients.slice();
    for (let i = 0; i < ingredientsListUpdated.length; i++) {
      if (ingredientsListUpdated[i].ingredient === name) {
        ingredientsListUpdated.splice(i, 1);
        setIngredients(ingredientsListUpdated);
        return;
      }
    }
  };

  const validateCategories = () => {
    for (let i = 0; i < totalCategories.length; i++) {
      if (watch(`categories[${i}]`)) {
        return true;
      }
    }
    return false;
  };

  const validateTime = () => {
    const hoursAndMinutes = getValues().tempsRecette.split(":");
    const hours = parseInt(hoursAndMinutes[0], 10);
    const minutes = hoursAndMinutes[1] ? parseInt(hoursAndMinutes[1], 10) : 0;
    const time = hours + minutes / 60;
    if (time <= 0) {
      return "Le temps nécessaire pour la recette doit être supérieur à 0";
    } else return undefined;
  };

  return (
    <form id="formRecette" onSubmit={handleSubmit(onSubmitForm)}>
      <fieldset>
        <legend>Ajouter une recette dans mon catalogue :</legend>
        <p>
          <label htmlFor="titreRecette"> Titre de la recette : </label>
          <input
            type="text"
            name="titreRecette"
            id="titreRecette"
            defaultValue=""
            ref={register({ required: true })}
          />
          {errors.titreRecette && <span>Ce champ est obligatoire</span>}
        </p>
        <div>
          Catégories :
          <ul>
            {totalCategories.map((categorie, index) => {
              return (
                <li key={categorie}>
                  <input
                    type="checkbox"
                    value={categorie}
                    name={`categories[${index}]`}
                    aria-label={categorie}
                    ref={register({ validate: validateCategories })}
                  />
                  {categorie}
                </li>
              );
            })}
          </ul>
          {errors.categories && (
            <span>Au moins une catégorie doit être sélectionnée</span>
          )}
        </div>
        <p>
          <label htmlFor="tempsRecette"> Temps total de la recette : </label>
          <input
            type="time"
            id="tempsRecette"
            name="tempsRecette"
            ref={register({
              required: "Ce champ est obligatoire",
              validate: validateTime,
            })}
          />
          {errors.tempsRecette && errors.tempsRecette.message}
        </p>
        <fieldset id="FormIngredientRecette">
          <legend> Ingrédients : </legend>
          <p>
            <label htmlFor="ingredient"> Nom : </label>
            <InputSuggestions
              elements={possibleIngredients}
              id="ingredient"
              getElementText={(ingredient) => ingredient.name}
              onChangeValue={(name) => setIngredientName(name)}
              value={ingredientName}
              name="ingredient"
              type="text"
            />
          </p>
          <p>
            <label htmlFor="ingredientAmount"> Quantité nécessaire : </label>
            <span>
              <input
                type="number"
                name="ingredientAmount"
                id="ingredientAmount"
                min="0"
                onChange={(e) => setIngredientAmount(e.target.value)}
                value={ingredientAmount}
              />
              <select
                name="unit"
                aria-label="Unité"
                onChange={(e) => setIngredientUnit(e.target.value)}
                value={ingredientUnit}
              >
                <option value="">...</option>
                {totalUnits.map((unit) => {
                  return (
                    <option value={unit} key={unit}>
                      {unit}
                    </option>
                  );
                })}
              </select>
            </span>
          </p>
          <p>
            <button onClick={handleAddIngredient}>Ajouter</button>
            {ingredientError && <span>{ingredientError}</span>}
          </p>
          <ul>
            {ingredients.map((ingredient) => {
              return (
                <li key={ingredient.ingredient}>
                  {ingredient.ingredient} : {ingredient.amount}{" "}
                  {ingredient.unit}
                  <button
                    onClick={() => handleSupprIngredient(ingredient.ingredient)}
                  >
                    X
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>
        <div id="description">
          <label htmlFor="descriptionRecette">Corps de la recette : </label>
          <textarea
            id="descriptionRecette"
            name="descriptionRecette"
            spellCheck="true"
            ref={register({ required: true })}
          ></textarea>
          {errors.descriptionRecette && <span>Ce champ est obligatoire</span>}
        </div>
        <p>
          <input type="submit" value="Confirmer" />
        </p>
      </fieldset>
    </form>
  );
}

RecettesForm.propTypes = {
  /**
   * Cette fonction est exécutée au moment du submit de de la recette,
   * lorsque la validité de tous les éléments entrés a été vérifiée,
   * et permet de les récupérer.
   */
  onSubmitRecette: PropTypes.func.isRequired,
  /**
   * Il s'agit ici des ingrédients autorisés, c'est-à-dire ceux entrés
   * dans le catalogue des ingrédients.
   */
  possibleIngredients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  totalCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  totalUnits: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RecettesForm;
