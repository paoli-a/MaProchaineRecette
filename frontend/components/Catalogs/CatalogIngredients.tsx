import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { IngredientType } from "../../constants/types";
import { useCatalogIngredients } from "../../hooks/swrFetch";
import {
  useAddCatalogIngredient,
  useDeleteCatalogIngredient,
} from "../../hooks/swrMutate";
import useFilterSearch from "../useFilterSearch";

type DeleteErrorType = {
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
  const [deleteError, setDeleteError] = useState<DeleteErrorType>({});
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
    const index = catalogIngredients.findIndex((ingredient: IngredientType) => {
      return ingredient.name === name;
    });
    const ingredientToSend = catalogIngredients[index];
    void deleteCatalogIngredient({ ingredientToSend });
  };

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchResults(event.target.value);
  };

  const filteredIngredients = useFilterSearch({
    elementsToFilter: catalogIngredients,
    searchResults: searchResults,
    getSearchElement: (ingredient: IngredientType) => ingredient.name,
  });

  const ingredientsToDisplay = filteredIngredients.map(
    (ingredient: IngredientType) => {
      return (
        <React.Fragment key={ingredient.name}>
          <li className="catalog-ingredients__ingredient" key={ingredient.name}>
            {ingredient.name}
            <button
              className="button"
              onClick={() => handleSupprClick(ingredient.name)}
            >
              X
            </button>
          </li>
          {deleteError.name === ingredient.name && (
            <p className="ingredient__error-message" role="alert">
              {deleteError.message}
            </p>
          )}
        </React.Fragment>
      );
    }
  );

  return (
    <main className="component-catalog-ingredients">
      <h1 className="component-catalog-ingredients__title-h1">
        Catalogue de tous mes ingrédients
      </h1>
      <section className="add-catalog-ingredient">
        <fieldset className="add-catalog-ingredient__form-container">
          <legend>Ajouter un ingredient dans le catalogue :</legend>
          <form className="form" onSubmit={handleSubmit(onSubmitWrapper)}>
            <div className="form__paragraph">
              <label className="form__label" htmlFor="ingredientName">
                {" "}
                Nom de l'ingrédient à ajouter :{" "}
              </label>
              <div className="container-error">
                <input
                  className={
                    errors.ingredientName
                      ? "form__input field-error"
                      : "form__input"
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
                  <p className="form__error-message" role="alert">
                    {errors.ingredientName.message}
                  </p>
                )}
                {errors.ingredientName && errors.ingredientName.types && (
                  <p className="form__error-message" role="alert">
                    {errors.ingredientName.types.message}
                  </p>
                )}
              </div>
            </div>
            <p className="form__paragraph">
              <input
                className="button form__submit"
                type="submit"
                value="Envoyer"
              />
            </p>
          </form>
        </fieldset>
      </section>
      <section className="catalog-ingredients">
        <form className="searchbox">
          <input
            className="searchbox__input"
            type="search"
            value={searchResults}
            placeholder="Recherche..."
            spellCheck="true"
            size={30}
            onChange={handleChangeSearch}
          />
        </form>
        <ul className="catalog-ingredients__ingredients-container">
          {ingredientsToDisplay}
        </ul>
      </section>
    </main>
  );
}

export default CatalogIngredients;
