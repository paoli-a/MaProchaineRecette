import React, { useState, useEffect } from "react";
import IngredientsFrigoForm from "./IngredientsFrigoForm";
import PropTypes from "prop-types";
import axios from "axios";

function IngredientsFrigo({ ingredients, ingredientsPossibles, totalUnites }) {
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
        const index = ingredientsListUpdated.findIndex((ingredient) => {
          return ingredient.id === id;
        });
        ingredientsListUpdated.splice(index, 1);
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
      ingredient: data.nomIngredient,
      date_peremption: data.datePeremption,
      quantite: data.quantiteIngredient + "",
      unite: data.unite,
    };
    axios
      .post("/frigo/ingredients/", ingredientNouveau)
      .then(({ data }) => {
        const newData = {
          id: data.id,
          nom: data.ingredient,
          datePeremption: new Date(data.date_peremption),
          quantite: data.quantite,
          unite: data.unite,
        };
        const ingredientsListUpdated = ingredientsList.slice();
        ingredientsListUpdated.push(newData);
        setIngredient(ingredientsListUpdated);
      })
      .catch(() => {
        setPostError("L'ajout de l'ingrédient a échoué.");
      });
  };
  const ingredientElement = ingredientsList.map((monIngredient) => {
    const formatedDate = monIngredient.datePeremption.toLocaleDateString();
    return (
      <React.Fragment key={monIngredient.id}>
        <li key={monIngredient.id}>
          - {monIngredient.nom} : {monIngredient.quantite} {monIngredient.unite}
          . Expiration : {formatedDate}.
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
    <section id="ingredientsFrigo">
      <h2>Voici les ingrédients du frigo !</h2>
      <IngredientsFrigoForm
        onSubmit={handleSubmit}
        ingredientsPossibles={ingredientsPossibles}
        totalUnites={totalUnites}
      />
      {postError && <span>{postError}</span>}
      <ul>{ingredientElement}</ul>
    </section>
  );
}

IngredientsFrigo.propTypes = {
  ingredientsPossibles: PropTypes.arrayOf(
    PropTypes.shape({
      nom: PropTypes.string.isRequired,
    })
  ).isRequired,
  /**
   * Il s'agit ici des ingrédients présents dans le frigo.
   */
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nom: PropTypes.string.isRequired,
      datePeremption: PropTypes.instanceOf(Date),
      quantite: PropTypes.string.isRequired,
      unite: PropTypes.string.isRequired,
    })
  ).isRequired,
  totalUnites: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default IngredientsFrigo;
