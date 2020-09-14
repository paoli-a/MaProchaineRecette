import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import InputSuggestions from "./InputSuggestions";
import PropTypes from "prop-types";

function IngredientsFrigoForm({ onSubmit, possibleIngredients, totalUnites }) {
  const {
    register,
    handleSubmit,
    errors,
    reset,
    getValues,
    watch,
    setValue,
    setError,
  } = useForm({ defaultValues: { nomIngredient: "" } });
  const { nomIngredient } = watch();

  const validateNomIngredient = () => {
    const nom = getValues().nomIngredient;
    let authorized = false;
    for (const ingredientPossible of possibleIngredients) {
      if (ingredientPossible.nom === nom) {
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
    register({ name: "nomIngredient" });
  }, [register]);

  const handleNomIngredient = (value) => {
    setValue("nomIngredient", value);
  };

  const onSubmitWrapper = (data) => {
    const ingredientError = validateNomIngredient();
    if (ingredientError) {
      setError("nomIngredient", "notMatch", ingredientError);
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
    const inputDate = new Date(getValues().datePeremption);
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
          <label htmlFor="nomIngredient">Nom de l'ingrédient : </label>
          <InputSuggestions
            elements={possibleIngredients}
            id="nomIngredient"
            getElementText={(ingredient) => ingredient.nom}
            onChangeValue={handleNomIngredient}
            value={nomIngredient}
            name="ingredient"
            type="text"
          />
          {errors.nomIngredient && errors.nomIngredient.message}
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
              name="unite"
              defaultValue=""
              ref={register({ required: true })}
              aria-label="Unité"
            >
              <option value="">...</option>
              {totalUnites.map((unite) => {
                return (
                  <option value={unite} key={unite}>
                    {unite}
                  </option>
                );
              })}
            </select>
            {errors.unite && <span>Ce champ est obligatoire</span>}
          </span>
        </p>
        <p>
          <label htmlFor="datePeremption">Date de péremption : </label>
          <input
            type="date"
            name="datePeremption"
            id="datePeremption"
            ref={register({
              required: "Ce champ est obligatoire",
              validate: validateDate,
            })}
          />
          {errors.datePeremption && errors.datePeremption.message}
        </p>
        <p>
          <input type="submit" value="Confirmer" />
        </p>
      </fieldset>
    </form>
  );
}

IngredientsFrigoForm.propTypes = {
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
      nom: PropTypes.string.isRequired,
    })
  ).isRequired,
  totalUnites: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default IngredientsFrigoForm;
