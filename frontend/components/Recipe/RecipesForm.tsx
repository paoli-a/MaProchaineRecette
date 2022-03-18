import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  CatalogRecipe,
  FridgeRecipe,
  RecipeIngredient,
} from "../../constants/types";
import { useCategories } from "../../hooks";
import RecipeIngredientForm from "./RecipeIngredientForm";

type FormInputs = {
  recipeTitle: string;
  recipeTime: string;
  recipeDescription: string;
  categories: string[];
  recipeIngredients: RecipeIngredient[];
};

type RecipesFormProps<T> = {
  /**
   * Cette fonction est exécutée au moment du submit de de la recette,
   * lorsque la validité de tous les éléments entrés a été vérifiée,
   * et permet de les récupérer.
   */
  onSubmitRecipe: (newData: FormInputs) => void;
  recipeToEdit: null | T;
  resetRecipeToEdit?: () => void;
};

function RecipesForm<T extends FridgeRecipe | CatalogRecipe>({
  onSubmitRecipe,
  recipeToEdit,
  resetRecipeToEdit,
}: RecipesFormProps<T>): JSX.Element {
  const methods = useForm<FormInputs>({
    defaultValues: {
      recipeIngredients: [{}],
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
    setValue,
    setFocus,
  } = methods;

  const { categories } = useCategories();

  useEffect(() => {
    if (recipeToEdit) {
      setFocus("recipeTitle");
      setValue("recipeTitle", recipeToEdit.title);
      const categoriesToEdit: string[] = [];
      categories.forEach((category: string) => {
        if (recipeToEdit.categories.includes(category)) {
          categoriesToEdit.push(category);
        } else {
          categoriesToEdit.push("");
        }
        return categoriesToEdit;
      });
      setValue(`categories`, categoriesToEdit);
      setValue("recipeTime", recipeToEdit.duration);
      setValue("recipeDescription", recipeToEdit.description);
    }
  }, [recipeToEdit, setFocus, categories, setValue]);

  const onSubmitForm = (data: FormInputs) => {
    const clearedIngredients = data.recipeIngredients.filter(
      function filterEmptyIngredient(ingredient) {
        if (!ingredient.ingredient && !ingredient.amount && !ingredient.unit) {
          return false;
        } else return true;
      }
    );
    const clearedData = { ...data, recipeIngredients: clearedIngredients };
    onSubmitRecipe(clearedData);
    reset();
  };

  const handleCancelClick = () => {
    resetRecipeToEdit && resetRecipeToEdit();
    reset();
  };

  const validateCategories = () => {
    for (let i = 0; i < categories.length; i++) {
      if (watch(`categories.${i}`)) {
        return true;
      }
    }
    return false;
  };

  const validateTime = () => {
    const hoursAndMinutes = getValues().recipeTime.split(":");
    const hours = parseInt(hoursAndMinutes[0], 10);
    const minutes = hoursAndMinutes[1] ? parseInt(hoursAndMinutes[1], 10) : 0;
    const time = hours + minutes / 60;
    if (time <= 0) {
      return "Le temps nécessaire pour la recette doit être supérieur à 0";
    } else return undefined;
  };

  return (
    <FormProvider {...methods}>
      <form className="form form-recipe" onSubmit={handleSubmit(onSubmitForm)}>
        <fieldset>
          <legend>
            {recipeToEdit
              ? "Modifier une recette de mon catalogue :"
              : "Ajouter une recette dans mon catalogue :"}
          </legend>
          <div className="form__paragraph">
            <label className="form__label" htmlFor="recipeTitle">
              {" "}
              Titre de la recette :{" "}
            </label>
            <div className="container-error">
              <input
                className={
                  errors.recipeTitle ? "form__input field-error" : "form__input"
                }
                type="text"
                id="recipeTitle"
                defaultValue=""
                {...register("recipeTitle", { required: true })}
                aria-invalid={errors.recipeTitle ? "true" : "false"}
                aria-required="true"
              />
              {errors.recipeTitle && (
                <p className="form__error-message" role="alert">
                  Ce champ est obligatoire
                </p>
              )}
            </div>
          </div>
          <div className="form__checkbox-container">
            Catégories :
            <ul>
              {categories.map((category: string, index: number) => {
                return (
                  <li key={category}>
                    <input
                      type="checkbox"
                      value={category}
                      aria-label={category}
                      {...register(`categories.${index}`, {
                        validate: validateCategories,
                      })}
                      aria-invalid={errors.categories ? "true" : "false"}
                      id={`category-${index}`}
                    />
                    <label htmlFor={`category-${index}`}>{category}</label>
                  </li>
                );
              })}
            </ul>
            {errors.categories && (
              <p className="form__error-message" role="alert">
                Au moins une catégorie doit être sélectionnée
              </p>
            )}
          </div>
          <div className="form__paragraph">
            <label className="form__label" htmlFor="recipeTime">
              {" "}
              Temps total de la recette :{" "}
            </label>
            <div className="container-error">
              <input
                className={
                  errors.recipeTime ? "form__input field-error" : "form__input"
                }
                type="time"
                id="recipeTime"
                {...register("recipeTime", {
                  required: "Ce champ est obligatoire",
                  validate: validateTime,
                })}
                aria-invalid={errors.recipeTime ? "true" : "false"}
                aria-required="true"
              />
              {errors.recipeTime && (
                <p className="form__error-message" role="alert">
                  {errors.recipeTime.message}
                </p>
              )}
            </div>
          </div>
          <RecipeIngredientForm recipeToEdit={recipeToEdit} />
          <div className="form__textarea-container">
            <label className="form__label" htmlFor="recipeDescription">
              Corps de la recette :{" "}
            </label>
            <textarea
              className={
                errors.recipeTime
                  ? "form__textarea field-error"
                  : "form__textarea"
              }
              id="recipeDescription"
              spellCheck="true"
              {...register("recipeDescription", { required: true })}
              aria-invalid={errors.recipeDescription ? "true" : "false"}
              aria-required="true"
            ></textarea>
            {errors.recipeDescription && (
              <p className="form__error-message" role="alert">
                Ce champ est obligatoire
              </p>
            )}
          </div>
          <p className="form__paragraph">
            <input
              className="button form__submit"
              type="submit"
              aria-label={
                recipeToEdit ? "Modifier la recette" : "Ajouter la recette"
              }
              value={recipeToEdit ? "Modifier" : "Ajouter"}
            />
            {recipeToEdit && (
              <button
                className="button form__cancel"
                type="reset"
                onClick={() => handleCancelClick()}
              >
                Annuler
              </button>
            )}
          </p>
        </fieldset>
      </form>
    </FormProvider>
  );
}

export default RecipesForm;
export type { FormInputs };
