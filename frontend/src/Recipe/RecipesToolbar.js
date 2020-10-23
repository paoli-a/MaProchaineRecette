import React, { useState } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

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

  const handlePannelClick = () => setPannelOpen(!isPannelOpen);

  const handleCheckbox = () => {
    const data = getCategoriesValues();
    const categoriesValues = Object.values(data);
    const filteredValues = categoriesValues.filter(Boolean);
    onChangeCategories(filteredValues);
  };

  const handleSearch = (data) => {
    const search = data.q;
    onChangeSearch(search);
  };

  const categoriesKeys = Object.keys(categories);
  const categoriesCheckbox = categoriesKeys.map((category) => {
    return (
      <li key={category}>
        <input
          type="checkbox"
          value={category}
          name={category}
          aria-label={category}
          ref={registerCategories}
          onClick={handleCheckbox}
        />
        {category}
        <span>{categories[category]}</span>
      </li>
    );
  });

  return (
    <fieldset className="dropdown-container">
      <div>
        <div>
          <button
            className={isPannelOpen ? "dropdown-open" : "dropdown-closed"}
            aria-expanded="false"
            aria-controls="dropdown-panel"
            onClick={handlePannelClick}
          >
            Catégories
          </button>
          <form id="dropdown-panel" className={isPannelOpen ? null : "hidden"}>
            <ul>{categoriesCheckbox}</ul>
          </form>
        </div>
        <form
          role="search"
          onSubmit={handleSubmitSearch(handleSearch)}
          id="search"
        >
          <input
            type="search"
            id="mySearch"
            name="q"
            placeholder="Recherche..."
            spellCheck="true"
            size="30"
            ref={registerSearch}
          />
          <button className="button" data-testid="search-button"></button>
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
