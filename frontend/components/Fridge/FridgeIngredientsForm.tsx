import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { FridgeIngredient, SuggestionElement } from "../../constants/types";
import { useCatalogIngredients, useUnits } from "../../hooks";
import InputSuggestions from "../InputSuggestions/InputSuggestions";
import type { SubmitFridgeIngredient } from "./FridgeIngredients";
import styles from "./FridgeIngredientsForm.module.scss";

type FormInputs = {
  ingredientName: string;
  ingredientAmount: string;
  unit: string;
  expirationDate: string;
};

type FridgeIngredientsFormProps = {
  /**
   * Cette fonction est exécutée au moment du submit de l'ingrédient,
   * lorsque la validité de tous les éléments entrés a été vérifiée,
   * et permet de les récupérer.
   */
  onSubmit: (data: SubmitFridgeIngredient) => void;
  /**
   * Il s'agit de l'ingrédient du frigo qui va être modifié.
   */
  ingredientToEdit: null | FridgeIngredient;
  resetIngredientToEdit: () => void;
};

function FridgeIngredientsForm({
  onSubmit,
  ingredientToEdit,
  resetIngredientToEdit,
}: FridgeIngredientsFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm<FormInputs>({
    defaultValues: {
      ingredientName: "",
      ingredientAmount: "",
      unit: "",
      expirationDate: "",
    },
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
      return "Cet ingrédient n'existe pas dans le catalogue d'ingrédients. Vous pouvez l'y ajouter.";
    } else {
      return undefined;
    }
  };

  const onSubmitWrapper = (data: SubmitFridgeIngredient) => {
    onSubmit(data);
    reset();
  };

  const validateAmount = () => {
    if (parseInt(getValues().ingredientAmount, 10) <= 0) {
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
  const inputSuggestionsRef = useRef<HTMLInputElement>(null);

  const handleCancelClick = () => {
    resetIngredientToEdit();
    reset();
  };

  useEffect(() => {
    if (ingredientToEdit) {
      if (inputSuggestionsRef && inputSuggestionsRef.current) {
        inputSuggestionsRef.current.focus();
      }
      setValue("ingredientName", ingredientToEdit.name);
      setValue("ingredientAmount", ingredientToEdit.amount);
      setValue("unit", ingredientToEdit.unit);
      setValue(
        "expirationDate",
        ingredientToEdit.expirationDate.toISOString().substring(0, 10)
      );
    }
  }, [ingredientToEdit]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmitWrapper)}>
      <fieldset>
        <legend className={styles.legend}>
          {" "}
          {ingredientToEdit
            ? "Modifier un ingrédient frigo"
            : "Ajouter un ingrédient frigo"}
        </legend>
        <div className={styles.fieldsContainer}>
          <div
            className={`${styles.paragraph} ${styles.ingredientNameContainer}`}
          >
            <label className={styles.label} htmlFor="ingredientName">
              Nom de l'ingrédient{" "}
            </label>
            <div className={styles.containerError}>
              <InputSuggestions
                elements={catalogIngredients}
                id="ingredientName"
                getElementText={(ingredient: SuggestionElement) =>
                  ingredient.name
                }
                type="text"
                className={
                  errors.ingredientName
                    ? `${styles.input} ${styles.inputIngredientName} ${styles.fieldError}`
                    : `${styles.input} ${styles.inputIngredientName}`
                }
                aria-invalid={errors.ingredientName ? "true" : "false"}
                aria-required="true"
                customRef={inputSuggestionsRef}
                {...register("ingredientName", {
                  required: "Ce champ est obligatoire",
                  validate: validateIngredientName,
                })}
              />
              {errors.ingredientName && (
                <p className={styles.errorMessage} role="alert">
                  {errors.ingredientName.message}
                </p>
              )}
            </div>
          </div>
          <div
            className={`${styles.paragraph} ${styles.ingredientAmountContainer}`}
          >
            <label className={styles.label} htmlFor="ingredientAmount">
              Quantité{" "}
            </label>
            <span className={styles.combinedContainer}>
              <div
                className={`${styles.containerError} ${styles.amountInputContainer}`}
              >
                <input
                  className={
                    errors.ingredientAmount
                      ? `${styles.input} ${styles.inputAmount} ${styles.fieldError}`
                      : `${styles.input} ${styles.inputAmount}`
                  }
                  type="number"
                  id="ingredientAmount"
                  defaultValue=""
                  {...register("ingredientAmount", {
                    required: "Ce champ est obligatoire",
                    validate: validateAmount,
                  })}
                  aria-invalid={errors.ingredientName ? "true" : "false"}
                  aria-required="true"
                />
                {errors.ingredientAmount && (
                  <p className={styles.errorMessage} role="alert">
                    {errors.ingredientAmount.message}{" "}
                  </p>
                )}
              </div>
              <div
                className={`${styles.containerError} ${styles.unitSelectContainer}`}
              >
                <select
                  className={
                    errors.unit
                      ? `select fieldError ${styles.select}`
                      : `select ${styles.select}`
                  }
                  defaultValue=""
                  {...register("unit", { required: true })}
                  aria-label="Unité"
                  aria-invalid={errors.ingredientName ? "true" : "false"}
                  aria-required="true"
                >
                  <option value="">...</option>
                  {units.map((unit: string) => {
                    return (
                      <option value={unit} key={unit}>
                        {unit}
                      </option>
                    );
                  })}
                </select>
                {errors.unit && (
                  <p className={styles.errorMessage} role="alert">
                    Ce champ est obligatoire
                  </p>
                )}
              </div>
            </span>
          </div>
          <div className={`${styles.paragraph} ${styles.expirationContainer}`}>
            <label className={styles.label} htmlFor="expirationDate">
              Date de péremption{" "}
            </label>
            <div className={styles.containerError}>
              <input
                className={
                  errors.expirationDate
                    ? `${styles.input} ${styles.inputExpiration} ${styles.fieldError}`
                    : `${styles.input} ${styles.inputExpiration}`
                }
                type="date"
                id="expirationDate"
                aria-invalid={errors.ingredientName ? "true" : "false"}
                aria-required="true"
                {...register("expirationDate", {
                  required: "Ce champ est obligatoire",
                  validate: validateDate,
                })}
              />
              {errors.expirationDate && (
                <p className={styles.errorMessage} role="alert">
                  {errors.expirationDate.message}
                </p>
              )}
            </div>
          </div>
          <p className={`${styles.paragraph} ${styles.buttonContainer}`}>
            <input
              className={`${styles.submitButton} button primaryButton
            `}
              type="submit"
              value={ingredientToEdit ? "Modifier" : "Ajouter"}
            />
            {ingredientToEdit && (
              <button
                className={`${styles.cancelButton} ${"button"}
              `}
                type="reset"
                onClick={() => handleCancelClick()}
              >
                Annuler
              </button>
            )}
          </p>
        </div>
      </fieldset>
    </form>
  );
}

export default FridgeIngredientsForm;
