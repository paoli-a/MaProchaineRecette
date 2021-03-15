import React, { useState } from "react";
import FridgeIngredientsForm from "./FridgeIngredientsForm";
import axios from "axios";
import { useFridgeIngredients } from "../../hooks/swrFetch";
import { mutate } from "swr";

/**
 * Ce composant permet d'afficher les ingrédients du frigo, d'en ajouter
 * et d'en supprimer. Seul des noms d'ingrédients déjà présents dans le catalogue
 * des ingrédients sont acceptés.
 *
 * @component
 */
function FridgeIngredients() {
  const [postError, setPostError] = useState("");
  const [deleteError, setDeleteError] = useState({});
  const { fridgeIngredients } = useFridgeIngredients();

  const handleSupprClick = (id) => {
    axios
      .delete(`/api/fridge/ingredients/${id}/`)
      .then(() => {
        const ingredientsListUpdated = fridgeIngredients.slice();
        eliminateIngredientWithId(ingredientsListUpdated, id);
        mutate("/api/fridge/ingredients/");
        mutate("/api/fridge/recipes/");
      })
      .catch(() => {
        setDeleteError({
          id: id,
          message:
            "La suppression a échoué. Veuillez réessayer ultérieurement.",
        });
      });
  };

  const updateFridgeIngredients = async (newIngredient) => {
    const { data } = await axios.post(
      "/api/fridge/ingredients/",
      newIngredient
    );
    const newData = {
      id: data.id,
      name: data.ingredient,
      expirationDate: new Date(data.expiration_date),
      amount: data.amount,
      unit: data.unit,
    };
    const ingredientsListUpdated = fridgeIngredients.slice();
    eliminateIngredientWithId(ingredientsListUpdated, data.id);
    ingredientsListUpdated.push(newData);
    return ingredientsListUpdated;
  };

  const handleSubmit = async (data) => {
    const newIngredient = {
      ingredient: data.ingredientName,
      expiration_date: data.expirationDate,
      amount: data.ingredientAmount + "",
      unit: data.unit,
    };
    const ingredientsListUpdated = fridgeIngredients.slice();
    eliminateIngredientWithId(ingredientsListUpdated, data.id);
    ingredientsListUpdated.push(newIngredient);
    mutate("/api/fridge/ingredients/", ingredientsListUpdated, false);
    try {
      await mutate(
        "/api/fridge/ingredients/",
        updateFridgeIngredients(newIngredient)
      );
      mutate("/api/fridge/recipes/");
    } catch (error) {
      setPostError("L'ajout de l'ingrédient a échoué.");
    }
  };

  function eliminateIngredientWithId(ingredientsToClean, id) {
    const index = ingredientsToClean.findIndex((ingredient) => {
      return ingredient.id === id;
    });
    if (index > -1) {
      ingredientsToClean.splice(index, 1);
    }
  }

  const ingredientElement = fridgeIngredients.map((ingredient) => {
    const formatedDate = ingredient.expirationDate.toLocaleDateString();
    return (
      <React.Fragment key={ingredient.id}>
        <li className="fridge-ingredients__ingredient" key={ingredient.id}>
          - {ingredient.name} : {ingredient.amount} {ingredient.unit}.
          Expiration : {formatedDate}.
          <button
            className="button"
            onClick={() => handleSupprClick(ingredient.id)}
          >
            Supprimer
          </button>
        </li>
        {deleteError.id === ingredient.id && <span>{deleteError.message}</span>}
      </React.Fragment>
    );
  });

  return (
    <section className="fridge-ingredients">
      <h2 className="fridge-ingredients__title-h2">
        Voici les ingrédients du frigo !
      </h2>
      <FridgeIngredientsForm onSubmit={handleSubmit} />
      {postError && <span>{postError}</span>}
      <ul className="fridge-ingredients__list">{ingredientElement}</ul>
    </section>
  );
}

export default FridgeIngredients;
