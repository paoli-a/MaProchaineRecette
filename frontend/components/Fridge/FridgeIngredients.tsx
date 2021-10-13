import axios from "axios";
import React, { useState } from "react";
import { mutate } from "swr";
import { API_PATHS } from "../../constants/paths";
import { FridgeIngredientType } from "../../constants/types";
import { useFridgeIngredients } from "../../hooks/swrFetch";
import { useDeleteFridgeIngredient } from "../../hooks/swrMutate";
import FridgeIngredientsForm from "./FridgeIngredientsForm";

type DeleteErrorType = {
  id?: string;
  message?: string;
};

type NewIngredientType = {
  ingredient: string;
  expiration_date: Date;
  amount: string;
  unit: string;
};

/**
 * Ce composant permet d'afficher les ingrédients du frigo, d'en ajouter
 * et d'en supprimer. Seul des noms d'ingrédients déjà présents dans le catalogue
 * des ingrédients sont acceptés.
 *
 * @component
 */
function FridgeIngredients() {
  const [postError, setPostError] = useState("");
  const [deleteError, setDeleteError] = useState<DeleteErrorType>({});
  const { fridgeIngredients } = useFridgeIngredients();
  const [ingredientToEdit, setIngredientToEdit] = useState(null);
  const [deleteFridgeIngredient] = useDeleteFridgeIngredient({
    onSuccess: () => {
      mutate(API_PATHS.fridgeIngredients);
      mutate(API_PATHS.fridgeRecipes);
    },
    onFailure: (id: string) => {
      setDeleteError({
        id: id,
        message: "La suppression a échoué. Veuillez réessayer ultérieurement.",
      });
    },
  });

  const handleSupprClick = (id: string) => {
    const index = fridgeIngredients.findIndex(
      (ingredient: FridgeIngredientType) => {
        return ingredient.id === id;
      }
    );
    const ingredientToSend = fridgeIngredients[index];
    deleteFridgeIngredient({ ingredientToSend });
  };

  const handleEditClick = (id: string) => {
    fridgeIngredients.forEach((ingredientObject: any) => {
      for (const key in ingredientObject) {
        if (key === "id" && ingredientObject[key] === id) {
          setIngredientToEdit(ingredientObject);
        }
      }
    });
  };

  const updateFridgeIngredients = async (newIngredient: NewIngredientType) => {
    if (ingredientToEdit) {
      await axios.put(
        `${API_PATHS.fridgeIngredients}${ingredientToEdit.id}`,
        newIngredient
      );
    } else {
      await axios.post(API_PATHS.fridgeIngredients, newIngredient);
    }
  };

  const handleSubmit = async (data: any) => {
    const newIngredient = {
      ingredient: data.ingredientName,
      expiration_date: data.expirationDate,
      amount: data.ingredientAmount + "",
      unit: data.unit,
    };
    try {
      /* We add the fridge ingredient in a non optimistic way because
      the backend may merge several ingredients before sending them back
      and we can't know that in advance on frontend side. */
      await updateFridgeIngredients(newIngredient);
      mutate(API_PATHS.fridgeIngredients);
      mutate(API_PATHS.fridgeRecipes);
    } catch (error) {
      if (ingredientToEdit) {
        setPostError("La modification de l'ingrédient a échoué.");
      } else {
        setPostError("L'ajout de l'ingrédient a échoué.");
      }
    }
  };

  const ingredientElement = fridgeIngredients.map(
    (ingredient: FridgeIngredientType) => {
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
          {deleteError.id === ingredient.id && (
            <span>{deleteError.message}</span>
          )}
        </React.Fragment>
      );
    }
  );

  return (
    <section className="fridge-ingredients">
      <h2 className="fridge-ingredients__title-h2">
        Voici les ingrédients du frigo !
      </h2>
      <FridgeIngredientsForm
        onSubmit={handleSubmit}
        ingredientToEdit={ingredientToEdit}
        resetIngredientToEdit={() => setIngredientToEdit(null)}
      />
      {postError && <span>{postError}</span>}
      <ul className="fridge-ingredients__list">{ingredientElement}</ul>
    </section>
  );
}

export default FridgeIngredients;
