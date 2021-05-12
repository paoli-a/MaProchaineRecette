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
  const [editFunctionality, setEditFunctionality] = useState(false);

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

  const handleEditClick = (id) => {
    setEditFunctionality(true);
  };

  const updateFridgeIngredients = async (newIngredient) => {
    await axios.post("/api/fridge/ingredients/", newIngredient);
  };

  const handleSubmit = async (data) => {
    const newIngredient = {
      ingredient: data.ingredientName,
      expiration_date: data.expirationDate,
      amount: data.ingredientAmount + "",
      unit: data.unit,
    };
    try {
      await updateFridgeIngredients(newIngredient);
      mutate("/api/fridge/ingredients/");
      mutate("/api/fridge/recipes/");
      setEditFunctionality(false);
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
          <h3 className="fridge-ingredients__ingredient-name">
            {ingredient.name}
          </h3>
          <ul className="fridge-ingredients__details fridge-ingredient-details">
            <li className="fridge-ingredient-details__amount">
              <span className="fridge-ingredient-details__label">
                Quantité :
              </span>{" "}
              <span className="fridge-ingredient-details__value">
                {ingredient.amount} {ingredient.unit}
              </span>
            </li>
            <li className="fridge-ingredient-details__expiration">
              <span className="fridge-ingredient-details__label">
                Expiration :
              </span>{" "}
              <span className="fridge-ingredient-details__value">
                {formatedDate}
              </span>
            </li>
          </ul>
          <button
            className="button fridge-ingredient-details__edit"
            onClick={() => handleEditClick(ingredient.id)}
          >
            <img
              className="fridge-ingredient-details__edit-img"
              src="images/edit.svg"
              alt="Modifier"
            />
          </button>
          <button
            className="button fridge-ingredient-details__delete"
            onClick={() => handleSupprClick(ingredient.id)}
          >
            <img
              className="fridge-ingredient-details__delete-img"
              src="images/delete.svg"
              alt="Supprimer"
            />
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
      <FridgeIngredientsForm
        onSubmit={handleSubmit}
        isEdit={editFunctionality}
      />
      {postError && <span>{postError}</span>}
      <ul className="fridge-ingredients__list">{ingredientElement}</ul>
    </section>
  );
}

export default FridgeIngredients;
