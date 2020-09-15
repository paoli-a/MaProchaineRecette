import React, { useState, useEffect } from "react";
import FridgeIngredientsForm from "./FridgeIngredientsForm";
import PropTypes from "prop-types";
import axios from "axios";

function FridgeIngredients({ ingredients, possibleIngredients, totalUnites }) {
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
    const ingredientNouveau = {
      ingredient: data.ingredientName,
      date_peremption: data.datePeremption,
      quantite: data.quantiteIngredient + "",
      unite: data.unite,
    };
    axios
      .post("/frigo/ingredients/", ingredientNouveau)
      .then(({ data }) => {
        const newData = {
          id: data.id,
          name: data.ingredient,
          datePeremption: new Date(data.date_peremption),
          quantite: data.quantite,
          unite: data.unite,
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

  const ingredientElement = ingredientsList.map((monIngredient) => {
    const formatedDate = monIngredient.datePeremption.toLocaleDateString();
    return (
      <React.Fragment key={monIngredient.id}>
        <li key={monIngredient.id}>
          - {monIngredient.name} : {monIngredient.quantite}{" "}
          {monIngredient.unite}. Expiration : {formatedDate}.
          <button onClick={() => handleSupprClick(monIngredient.id)}>
            Supprimer
          </button>
        </li>
        {deleteError.id === monIngredient.id && (
          <span>{deleteError.message}</span>
        )}
      </React.Fragment>
    );
  });

  return (
    <section id="fridgeIngredients">
      <h2>Voici les ingrédients du frigo !</h2>
      <FridgeIngredientsForm
        onSubmit={handleSubmit}
        possibleIngredients={possibleIngredients}
        totalUnites={totalUnites}
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
      datePeremption: PropTypes.instanceOf(Date),
      quantite: PropTypes.string.isRequired,
      unite: PropTypes.string.isRequired,
    })
  ).isRequired,
  totalUnites: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default FridgeIngredients;
