import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { CatalogIngredient } from "../../constants/types";
import {
  useAddCatalogIngredient,
  useCatalogIngredients,
  useDeleteCatalogIngredient,
} from "../../hooks/";
import useFilterSearch from "../useFilterSearch";
import styles from "./CatalogIngredients.module.scss";

type DeleteError = {
  name?: string;
  message?: string;
};

type FormInputs = {
  ingredientName: string;
};

/**
 * Ce composant permet d'afficher les ingrédients du catalogue, d'en ajouter
 * et d'en supprimer. Une recherche peut etre faite sur le nom des ingrédients et
 * permettra d'afficher au fur et à mesure les ingrédients correspondants.
 *
 * @component
 */
function CatalogIngredients() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormInputs>();
  const [searchResults, setSearchResults] = useState("");
  const [deleteError, setDeleteError] = useState<DeleteError>({});
  const { catalogIngredients } = useCatalogIngredients();
  const [addCatalogIngredient] = useAddCatalogIngredient({
    onSuccess: () => reset(),
    onFailure: () => {
      setError("ingredientName", {
        message: "L'ajout a échoué.",
      });
    },
  });
  const [deleteCatalogIngredient] = useDeleteCatalogIngredient({
    onSuccess: () => setDeleteError({}),
    onFailure: (name: string) => {
      setDeleteError({
        name: name,
        message: "La suppression a échoué. Veuillez réessayer ultérieurement.",
      });
    },
  });

  const onSubmitWrapper = (dataForm: FormInputs) => {
    const ingredientToSend = {
      name: dataForm.ingredientName,
    };
    void addCatalogIngredient({ ingredientToSend });
  };

  const handleSupprClick = (name: string) => {
    const index = catalogIngredients.findIndex(
      (ingredient: CatalogIngredient) => {
        return ingredient.name === name;
      }
    );
    const ingredientToDelete = catalogIngredients[index];
    void deleteCatalogIngredient({
      ingredientToDeleteName: ingredientToDelete.name,
    });
  };

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchResults(event.target.value);
  };

  const filteredIngredients = useFilterSearch({
    elementsToFilter: catalogIngredients,
    searchResults: searchResults,
    getSearchElement: (ingredient: CatalogIngredient) => ingredient.name,
  });

  const ingredientsToDisplay = filteredIngredients.map(
    (ingredient: CatalogIngredient) => {
      return (
        <React.Fragment key={ingredient.name}>
          <li className={styles.ingredientName} key={ingredient.name}>
            {ingredient.name}
            <button
              className={`${styles.deleteButton} ${"button"}
              `}
              onClick={() => handleSupprClick(ingredient.name)}
              aria-label="Supprimer l'ingrédient"
            >
              <img
                className={styles.deleteImg}
                src="images/delete.svg"
                alt=""
              />
            </button>
          </li>
          {deleteError.name === ingredient.name && (
            <p className={styles.errorMessage} role="alert">
              {deleteError.message}
            </p>
          )}
        </React.Fragment>
      );
    }
  );

  return (
    <main className={styles.catalogIngredientsComponent}>
      <h1 className={styles.title}>Catalogue de tous mes ingrédients</h1>
      <section className={styles.addIngredientsSection}>
        <fieldset className={styles.formContainer}>
          <legend className={styles.legend}>
            Ajouter un ingredient dans le catalogue
          </legend>
          <form
            className={styles.form}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={handleSubmit(onSubmitWrapper)}
          >
            <div className={styles.paragraph}>
              <label className={styles.label} htmlFor="ingredientName">
                {" "}
                Nom de l'ingrédient
              </label>
              <div className={styles.containerError}>
                <input
                  className={
                    errors.ingredientName
                      ? `${styles.input} ${styles.inputIngredientName} ${styles.fieldError}`
                      : `${styles.input} ${styles.inputIngredientName}`
                  }
                  type="text"
                  id="ingredientName"
                  defaultValue=""
                  {...register("ingredientName", {
                    required: "Ce champ est obligatoire",
                  })}
                  aria-required="true"
                  aria-invalid={errors.ingredientName ? "true" : "false"}
                />
                {errors.ingredientName && (
                  <p className={styles.errorMessage} role="alert">
                    {errors.ingredientName.message}
                  </p>
                )}
                {errors.ingredientName && errors.ingredientName.types && (
                  <p className={styles.errorMessage} role="alert">
                    {errors.ingredientName.types.message}
                  </p>
                )}
              </div>
            </div>
            <p className={styles.paragraph}>
              <input
                className={`${styles.submitButton} button primaryButton
                `}
                type="submit"
                value="Ajouter"
              />
            </p>
          </form>
        </fieldset>
        <img
          className={styles.ingredientIMG}
          src="images/ingredient_smallImg.jpg"
          alt=""
        />
      </section>

      <section
        className={styles.displayCatalogIngredientsSection}
        data-testid="catalogIngredientsList"
      >
        <form className={styles.searchbox}>
          <input
            className={styles.searchboxInput}
            type="search"
            value={searchResults}
            placeholder="Recherche..."
            spellCheck="true"
            size={30}
            onChange={handleChangeSearch}
          />
        </form>
        <ul className={styles.catalogIngredientList}>{ingredientsToDisplay}</ul>
      </section>
    </main>
  );
}

export default CatalogIngredients;
