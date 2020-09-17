import React, { useState, useEffect } from "react";
import FridgeIngredientsForm from "./FridgeIngredientsForm";
import PropTypes from "prop-types";
import axios from "axios";

function FridgeIngredients({ ingredients, possibleIngredients, totalUnits }) {
  const [ingredientsList, setIngredient] = useState(ingredients);
  const [postError, setPostError] = useState("");
  const [deleteError, setDeleteError] = useState({});

  useEffect(() => {
    setIngredient(ingredients);
  }, [ingredients]);

  const handleSupprClick = (id) => {
    axios
      .delete(`/frigo/ingredients/${id}/`)
      .then(() => {
        const ingredientsListUpdated = ingredientsList.slice();
        eliminateIngredientWithId(ingredientsListUpdated, id);
        setIngredient(ingredientsListUpdated);
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
      quantite: data.quantiteIngredient + "",
      unit: data.unit,
    };
    axios
      .post("/frigo/ingredients/", newIngredient)
      .then(({ data }) => {
        const newData = {
          id: data.id,
          name: data.ingredient,
          expirationDate: new Date(data.expiration_date),
          quantite: data.quantite,
          unit: data.unit,
        };
        const ingredientsListUpdated = ingredientsList.slice();
        eliminateIngredientWithId(ingredientsListUpdated, data.id);
        ingredientsListUpdated.push(newData);
        setIngredient(ingredientsListUpdated);
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

  const ingredientElement = ingredientsList.map((ingredient) => {
    const formatedDate = ingredient.expirationDate.toLocaleDateString();
    return (
      <React.Fragment key={ingredient.id}>
        <li key={ingredient.id}>
          - {ingredient.name} : {ingredient.quantite} {ingredient.unit}.
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
      quantite: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
    })
  ).isRequired,
  totalUnits: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default FridgeIngredients;
