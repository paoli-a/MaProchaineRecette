import axios from "axios";
import React, { useState } from "react";
import { useSWRConfig } from "swr";
import { API_PATHS } from "../../constants/paths";
import {
  FridgeIngredient,
  FridgeIngredientToSend,
} from "../../constants/types";
import { useDeleteFridgeIngredient, useFridgeIngredients } from "../../hooks/";
import styles from "./FridgeIngredients.module.scss";
import FridgeIngredientsForm from "./FridgeIngredientsForm";

type DeleteError = {
  id?: string;
  message?: string;
};

type SubmitFridgeIngredient = {
  ingredientName: string;
  ingredientAmount: string;
  unit: string;
  expirationDate: string;
};

/**
 * Ce composant permet d'afficher les ingrédients du frigo, d'en ajouter
 * et d'en supprimer. Seul des noms d'ingrédients déjà présents dans le catalogue
 * des ingrédients sont acceptés.
 *
 * @component
 */
function FridgeIngredients() {
  const { mutate } = useSWRConfig();
  const [postError, setPostError] = useState("");
  const [deleteError, setDeleteError] = useState<DeleteError>({});
  const { fridgeIngredients } = useFridgeIngredients();
  const [ingredientToEdit, setIngredientToEdit] =
    useState<FridgeIngredient | null>(null);
  const [deleteFridgeIngredient] = useDeleteFridgeIngredient({
    onSuccess: () => {
      void mutate(API_PATHS.fridgeIngredients);
      void mutate(API_PATHS.fridgeRecipes);
    },
    onFailure: (id: string) => {
      setDeleteError({
        id: id,
        message: "La suppression a échoué. Veuillez réessayer ultérieurement.",
      });
    },
  });

  const handleSupprClick = (ingredient: FridgeIngredient) => {
    if (ingredient.id) {
      void deleteFridgeIngredient({
        ingredientToDeleteID: ingredient.id,
      });
    } else
      setDeleteError({
        id: undefined,
        message: "La suppression a échoué. Veuillez réessayer ultérieurement.",
      });
  };

  const handleEditClick = (ingredient: FridgeIngredient) => {
    setIngredientToEdit(ingredient);
  };

  const updateFridgeIngredients = async (
    newIngredient: FridgeIngredientToSend
  ) => {
    if (ingredientToEdit) {
      if (ingredientToEdit.id) {
        await axios.put(
          `${API_PATHS.fridgeIngredients}${ingredientToEdit.id}`,
          newIngredient
        );
      } else {
        setPostError("La modification de l'ingrédient a échoué.");
      }
    } else {
      await axios.post(API_PATHS.fridgeIngredients, newIngredient);
    }
  };

  const handleSubmit = async (data: SubmitFridgeIngredient) => {
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
      void mutate(API_PATHS.fridgeIngredients);
      void mutate(API_PATHS.fridgeRecipes);
    } catch (error) {
      if (ingredientToEdit) {
        setPostError("La modification de l'ingrédient a échoué.");
      } else {
        setPostError("L'ajout de l'ingrédient a échoué.");
      }
    }
  };

  const ingredientElement = fridgeIngredients.map(
    (ingredient: FridgeIngredient) => {
      const formatedDate = ingredient.expirationDate.toLocaleDateString();
      return (
        <React.Fragment key={ingredient.id}>
          <li className={styles.ingredientItem} key={ingredient.id}>
            <h3 className={styles.ingredientName}>{ingredient.name}</h3>
            <ul className={styles.ingredientDetails}>
              <li className={styles.ingredientAmount}>
                <span className={styles.ingredientDetailsLabel}>
                  Quantité :
                </span>{" "}
                <span className={styles.ingredientValue}>
                  {ingredient.amount} {ingredient.unit}
                </span>
              </li>
              <li className={styles.ingredientExpiration}>
                <span className={styles.ingredientDetailsLabel}>
                  Expiration :
                </span>{" "}
                <span className={styles.ingredientValue}>{formatedDate}</span>
              </li>
            </ul>
            <button
              className={`${styles.editButton} ${"button"}
              `}
              onClick={() => handleEditClick(ingredient)}
              aria-label="Modifier l'ingrédient"
            >
              <img className={styles.editImg} src="images/edit.svg" alt="" />
            </button>
            <button
              className={`${styles.deleteButton} ${"button"}
              `}
              onClick={() => handleSupprClick(ingredient)}
              aria-label="Supprimer l'ingrédient"
            >
              <img
                className={styles.deleteImg}
                src="images/delete.svg"
                alt=""
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
    <section className={styles.fridgeIngredients}>
      <h2 className={styles.title}>
        <span className={styles.titleName}>Ingrédients du frigo</span>
        <span className={styles.titleBar}></span>
      </h2>
      <FridgeIngredientsForm
        onSubmit={handleSubmit}
        ingredientToEdit={ingredientToEdit}
        resetIngredientToEdit={() => setIngredientToEdit(null)}
      />
      {postError && <span>{postError}</span>}
      <ul className={`${styles.fridgeIngredientsList} fridgeIngredientsList`}>
        {ingredientElement}
      </ul>
    </section>
  );
}

export default FridgeIngredients;
export type { SubmitFridgeIngredient };
