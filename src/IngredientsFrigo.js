import React, { useState } from "react";
import IngredientsFrigoForm from "./IngredientsFrigoForm";

function IngredientsFrigo({ ingredients, ingredientsPossibles }) {
  const [ingredientsList, setIngredient] = useState(ingredients);

  const handleSupprClick = (id) => {
    const ingredientsListUpdated = ingredientsList.slice();
    const index = ingredientsListUpdated.findIndex((ingredient) => {
      return ingredient.id === id;
    });
    ingredientsListUpdated.splice(index, 1);
    setIngredient(ingredientsListUpdated);
  };

  const handleSubmit = (data) => {
    const id = new Date().getTime();
    const quantite = data.quantiteIngredient + "";
    const formatedQuantite = quantite + data.unite;
    const datePeremption = new Date(data.datePeremption);

    const ingredientNouveau = {
      id: id,
      nom: data.nomIngredient,
      datePeremption: datePeremption,
      quantite: formatedQuantite,
    };

    const ingredientsListUpdated = ingredientsList.slice();
    ingredientsListUpdated.push(ingredientNouveau);
    setIngredient(ingredientsListUpdated);
  };

  const ingredientElement = ingredientsList.map((monIngredient) => {
    const formatedDate = monIngredient.datePeremption.toLocaleDateString();
    return (
      <li key={monIngredient.id}>
        {monIngredient.nom} : {monIngredient.quantite}. Expiration :{" "}
        {formatedDate}.
        <button onClick={() => handleSupprClick(monIngredient.id)}>
          Supprimer
        </button>
      </li>
    );
  });

  return (
    <div>
      <h1>Voici les ingrédients du frigo !</h1>
      <IngredientsFrigoForm
        onSubmit={handleSubmit}
        ingredientsPossibles={ingredientsPossibles}
      />
      <ul>{ingredientElement}</ul>
    </div>
  );
}

export default IngredientsFrigo;
