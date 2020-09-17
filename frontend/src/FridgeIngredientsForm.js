import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import InputSuggestions from "./InputSuggestions";
import PropTypes from "prop-types";

function FridgeIngredientsForm({ onSubmit, possibleIngredients, totalUnits }) {
  const {
    register,
    handleSubmit,
    errors,
    reset,
    getValues,
    watch,
    setValue,
    setError,
  } = useForm({ defaultValues: { ingredientName: "" } });
  const { ingredientName } = watch();

  const validateNomIngredient = () => {
    const name = getValues().ingredientName;
    let authorized = false;
    for (const ingredientPossible of possibleIngredients) {
      if (ingredientPossible.name === name) {
        authorized = true;
        break;
      }
    }
    if (!authorized) {
      return (
        <React.Fragment>
          Cet ingrédient n'existe pas dans le catalogue d'ingrédients. Vous
          pouvez l'y ajouter <a href="/#">ici</a>.
        </React.Fragment>
      );
    } else {
      return undefined;
    }
  };

  useEffect(() => {
    register({ name: "ingredientName" });
  }, [register]);

  const handleNomIngredient = (value) => {
    setValue("ingredientName", value);
  };

  const onSubmitWrapper = (data) => {
    const ingredientError = validateNomIngredient();
    if (ingredientError) {
      setError("ingredientName", "notMatch", ingredientError);
      return;
    }
    onSubmit(data);
    reset();
  };

  const validateQuantite = () => {
    if (getValues().quantiteIngredient <= 0) {
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
    <form id="formFrigo" onSubmit={handleSubmit(onSubmitWrapper)}>
      <fieldset>
        <legend>Ajouter un ingredient frigo :</legend>
        <p>
          <label htmlFor="ingredientName">Nom de l'ingrédient : </label>
          <InputSuggestions
            elements={possibleIngredients}
            id="ingredientName"
            getElementText={(ingredient) => ingredient.name}
            onChangeValue={handleNomIngredient}
            value={ingredientName}
            name="ingredient"
            type="text"
          />
          {errors.ingredientName && errors.ingredientName.message}
        </p>
        <p>
          <label htmlFor="quantiteIngredient">Quantité : </label>
          <span>
            <input
              type="number"
              name="quantiteIngredient"
              id="quantiteIngredient"
              defaultValue=""
              ref={register({
                required: "Ce champ est obligatoire",
                validate: validateQuantite,
              })}
            />
            {errors.quantiteIngredient && errors.quantiteIngredient.message}
            <select
              name="unit"
              defaultValue=""
              ref={register({ required: true })}
              aria-label="Unité"
            >
              <option value="">...</option>
              {totalUnits.map((unit) => {
                return (
                  <option value={unit} key={unit}>
                    {unit}
                  </option>
                );
              })}
            </select>
            {errors.unit && <span>Ce champ est obligatoire</span>}
          </span>
        </p>
        <p>
          <label htmlFor="expirationDate">Date de péremption : </label>
          <input
            type="date"
            name="expirationDate"
            id="expirationDate"
            ref={register({
              required: "Ce champ est obligatoire",
              validate: validateDate,
            })}
          />
          {errors.expirationDate && errors.expirationDate.message}
        </p>
        <p>
          <input type="submit" value="Confirmer" />
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
  /**
   * Il s'agit ici des ingrédients autorisés, c'est-à-dire ceux entrés
   * dans le catalogue des ingrédients.
   */
  possibleIngredients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  totalUnits: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default FridgeIngredientsForm;
