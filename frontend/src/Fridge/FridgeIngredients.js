import React, { useState } from "react";
import FridgeIngredientsForm from "./FridgeIngredientsForm";
import PropTypes from "prop-types";
import axios from "axios";

function FridgeIngredients({
  ingredients,
  possibleIngredients,
  totalUnits,
  feasibleRecipesUpdate,
  updateFridgeIngredients,
}) {
  const [postError, setPostError] = useState("");
  const [deleteError, setDeleteError] = useState({});

  const handleSupprClick = (id) => {
    axios
      .delete(`/api/fridge/ingredients/${id}/`)
      .then(() => {
        const ingredientsListUpdated = ingredients.slice();
        eliminateIngredientWithId(ingredientsListUpdated, id);
        feasibleRecipesUpdate();
        updateFridgeIngredients(ingredientsListUpdated);
      })
      .catch(() => {
        setDeleteError({
          id: id,
          message:
            "La suppression a échoué. Veuillez réessayer ultérieurement.",
        });
      });
  };

  const handleSubmit = (data) => {
    const newIngredient = {
      ingredient: data.ingredientName,
      expiration_date: data.expirationDate,
      amount: data.ingredientAmount + "",
      unit: data.unit,
    };
    axios
      .post("/api/fridge/ingredients/", newIngredient)
      .then(({ data }) => {
        const newData = {
          id: data.id,
          name: data.ingredient,
          expirationDate: new Date(data.expiration_date),
          amount: data.amount,
          unit: data.unit,
        };
        const ingredientsListUpdated = ingredients.slice();
        eliminateIngredientWithId(ingredientsListUpdated, data.id);
        ingredientsListUpdated.push(newData);
        feasibleRecipesUpdate();
        updateFridgeIngredients(ingredientsListUpdated);
      })
      .catch(() => {
        setPostError("L'ajout de l'ingrédient a échoué.");
      });
  };

  function eliminateIngredientWithId(ingredientsToClean, id) {
    const index = ingredientsToClean.findIndex((ingredient) => {
      return ingredient.id === id;
    });
    if (index > -1) {
      ingredientsToClean.splice(index, 1);
    }
  }

  const ingredientElement = ingredients.map((ingredient) => {
    const formatedDate = ingredient.expirationDate.toLocaleDateString();
    return (
      <React.Fragment key={ingredient.id}>
        <li key={ingredient.id}>
          - {ingredient.name} : {ingredient.amount} {ingredient.unit}.
          Expiration : {formatedDate}.
          <button onClick={() => handleSupprClick(ingredient.id)}>
            Supprimer
          </button>
        </li>
        {deleteError.id === ingredient.id && <span>{deleteError.message}</span>}
      </React.Fragment>
    );
  });

  return (
    <section id="fridgeIngredients">
      <h2>Voici les ingrédients du frigo !</h2>
      <FridgeIngredientsForm
        onSubmit={handleSubmit}
        possibleIngredients={possibleIngredients}
        totalUnits={totalUnits}
      />
      {postError && <span>{postError}</span>}
      <ul>{ingredientElement}</ul>
    </section>
  );
}

FridgeIngredients.propTypes = {
  possibleIngredients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  /**
   * Il s'agit ici des ingrédients présents dans le frigo.
   */
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      expirationDate: PropTypes.instanceOf(Date),
      amount: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
    })
  ).isRequired,
  totalUnits: PropTypes.arrayOf(PropTypes.string).isRequired,
  feasibleRecipesUpdate: PropTypes.func.isRequired,
  updateFridgeIngredients: PropTypes.func.isRequired,
};

export default FridgeIngredients;
