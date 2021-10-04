import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

/**
 * Ce composant permet d'afficher les outils de filtrage des recettes:
 * - la sélection des catégories
 * - la barre de recherche
 *
 * @component
 */
function RecipesToolbar({ onChangeCategories, onChangeSearch, categories }) {
  const {
    register: registerCategories,
    getValues: getCategoriesValues,
  } = useForm();
  const {
    register: registerSearch,
    handleSubmit: handleSubmitSearch,
  } = useForm();
  const [isPannelOpen, setPannelOpen] = useState(false);
  const [categoryValuesUpdated, setCategoryValuesUpdated] = useState(0);

  const handlePannelClick = () => setPannelOpen(!isPannelOpen);

  const handleCheckbox = () => {
    setCategoryValuesUpdated(categoryValuesUpdated + 1);
  };

  useEffect(() => {
    const data = getCategoriesValues();
    const categoriesValues = Object.values(data);
    const filteredValues = categoriesValues.filter(Boolean);
    onChangeCategories(filteredValues);
  }, [categoryValuesUpdated]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (data) => {
    const search = data.q;
    onChangeSearch(search);
  };

  const categoriesKeys = Object.keys(categories);
  const categoriesCheckbox = categoriesKeys.map((category) => {
    return (
      <li
        className="collapsible-with-button__list-container collapsible-checkbox"
        key={category}
      >
        <input
          className="collapsible-with-button__list-container collapsible-checkbox__input"
          type="checkbox"
          value={category}
          aria-label={category}
          onClick={handleCheckbox}
          {...registerCategories(category)}
        />
        {category}
        <span className="collapsible-with-button__list-container collapsible-checkbox__span">
          {categories[category]}
        </span>
      </li>
    );
  });

  return (
    <fieldset className="toolbar">
      <div className="toolbar__container">
        <div className="collapsible-with-button">
          <button
            className={
              isPannelOpen
                ? "collapsible-with-button__button open"
                : "collapsible-with-button__button closed"
            }
            aria-expanded="false"
            aria-controls="collapsible-panel"
            onClick={handlePannelClick}
          >
            Catégories
          </button>
          <form
            className={
              isPannelOpen
                ? "collapsible-with-button__panel"
                : "collapsible-with-button__panel hidden"
            }
          >
            <ul className="collapsible-with-button__list-container">
              {categoriesCheckbox}
            </ul>
          </form>
        </div>
        <form
          role="search"
          onSubmit={handleSubmitSearch(handleSearch)}
          className="searchbox"
        >
          <input
            className="searchbox__input"
            type="search"
            placeholder="Recherche..."
            spellCheck="true"
            size={30}
            {...registerSearch("q")}
          />
          <button
            className=" searchbox__button button"
            data-testid="search-button"
          ></button>
        </form>
      </div>
    </fieldset>
  );
}

RecipesToolbar.propTypes = {
  /**
   * Cette fonction permet de récupérer les nouvelles catégories sélectionnées
   * lorsque l'utilisateur clique sur la checkbox des catégories.
   */
  onChangeCategories: PropTypes.func.isRequired,
  /**
   * Cette fonction permet de récupérer la recherche de l'utilisateur
   * pour filtrer les recettes.
   */
  onChangeSearch: PropTypes.func.isRequired,
  /**
   * Chaque catégorie est associée à un chiffre qui représente le nombre de
   * recettes ayant cette catégorie.
   */
  categories: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default RecipesToolbar;
