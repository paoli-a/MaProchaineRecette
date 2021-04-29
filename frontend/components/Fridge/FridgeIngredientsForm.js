import React from "react";
import { useForm } from "react-hook-form";
import InputSuggestions from "../InputSuggestions/InputSuggestions";
import PropTypes from "prop-types";
import { useCatalogIngredients, useUnits } from "../../hooks/swrFetch";

function FridgeIngredientsForm({ onSubmit }) {
  const { register, handleSubmit, errors, reset, getValues } = useForm({
    defaultValues: { ingredientName: "" },
  });
  const { catalogIngredients } = useCatalogIngredients();
  const { units } = useUnits();

  const validateIngredientName = () => {
    const name = getValues().ingredientName;
    let authorized = false;
    for (const ingredientPossible of catalogIngredients) {
      if (ingredientPossible.name === name) {
        authorized = true;
        break;
      }
    }
    if (!authorized) {
      return (
        <>
          Cet ingrédient n'existe pas dans le catalogue d'ingrédients. Vous
          pouvez l'y ajouter <a href="/ingredients">ici</a>.
        </>
      );
    } else {
      return undefined;
    }
  };

  const onSubmitWrapper = (data) => {
    onSubmit(data);
    reset();
  };

  const validateAmount = () => {
    if (getValues().ingredientAmount <= 0) {
      return "La quantité doit être supérieure à 0";
    } else return undefined;
  };

  const validateDate = () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const inputDate = new Date(getValues().expirationDate);
    inputDate.setHours(0, 0, 0, 0);
    if (currentDate.getTime() > inputDate.getTime()) {
      return "L'ingrédient est déjà perimé";
    } else return undefined;
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmitWrapper)}>
      <fieldset>
        <legend>Ajouter un ingredient frigo :</legend>
        <div className="form__paragraph">
          <label className="form__label" htmlFor="ingredientName">
            Nom de l'ingrédient :{" "}
          </label>
          <div className="container-error">
            <InputSuggestions
              elements={catalogIngredients}
              id="ingredientName"
              getElementText={(ingredient) => ingredient.name}
              type="text"
              className={
                errors.ingredientName
                  ? "form__input field-error"
                  : "form__input"
              }
              aria-invalid={errors.ingredientName ? "true" : "false"}
              aria-required="true"
              {...register('ingredientName', { required: "Ce champ est obligatoire", validate: validateIngredientName})}
            />
            {errors.ingredientName && (
              <p className="form__error-message" role="alert">
                {errors.ingredientName.message}
              </p>
            )}
          </div>
        </div>
        <div className="form__paragraph">
          <label className="form__label" htmlFor="ingredientAmount">
            Quantité :{" "}
          </label>
          <span className="form__combined-container">
            <div className="container-error">
              <input
                className={
                  errors.ingredientAmount
                    ? "form__combined-input field-error"
                    : "form__combined-input"
                }
                type="number"
                id="ingredientAmount"
                defaultValue=""
                {...register('ingredientAmount', { required: "Ce champ est obligatoire", validate: validateAmount})}
                aria-invalid={errors.ingredientName ? "true" : "false"}
                aria-required="true"
              />
              {errors.ingredientAmount && (
                <p className="form__error-message" role="alert">
                  {errors.ingredientAmount.message}{" "}
                </p>
              )}
            </div>
            <div className="container-error">
              <select
                className={
                  errors.unit
                    ? "form__combined-select field-error"
                    : "form__combined-select"
                }
                defaultValue=""
                {...register('unit', { required: true})}
                aria-label="Unité"
                aria-invalid={errors.ingredientName ? "true" : "false"}
                aria-required="true"
              >
                <option value="">...</option>
                {units.map((unit) => {
                  return (
                    <option value={unit} key={unit}>
                      {unit}
                    </option>
                  );
                })}
              </select>
              {errors.unit && (
                <p className="form__error-message" role="alert">
                  Ce champ est obligatoire
                </p>
              )}
            </div>
          </span>
        </div>
        <div className="form__paragraph">
          <label className="form__label" htmlFor="expirationDate">
            Date de péremption :{" "}
          </label>
          <div className="container-error">
            <input
              className={
                errors.expirationDate
                  ? "form__input field-error"
                  : "form__input"
              }
              type="date"
              id="expirationDate"
              {...register('expirationDate', { required: "Ce champ est obligatoire", validate: validateDate})}
              aria-invalid={errors.ingredientName ? "true" : "false"}
              aria-required="true"
            />
            {errors.expirationDate && (
              <p className="form__error-message" role="alert">
                {errors.expirationDate.message}
              </p>
            )}
          </div>
        </div>
        <p className="form__paragraph">
          <input
            className="button form__submit"
            type="submit"
            value="Confirmer"
          />
        </p>
      </fieldset>
    </form>
  );
}

FridgeIngredientsForm.propTypes = {
  /**
   * Cette fonction est exécutée au moment du submit de l'ingrédient,
   * lorsque la validité de tous les éléments entrés a été vérifiée,
   * et permet de les récupérer.
   */
  onSubmit: PropTypes.func.isRequired,
};

export default FridgeIngredientsForm;
