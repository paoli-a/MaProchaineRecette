import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./RecipesToolbar.module.scss"

type RecipesToolbarProps = {
  /**
   * Cette fonction permet de récupérer les nouvelles catégories sélectionnées
   * lorsque l'utilisateur clique sur la checkbox des catégories.
   */
  onChangeCategories: (filteredValues: string[]) => void;
  /**
   * Cette fonction permet de récupérer la recherche de l'utilisateur
   * pour filtrer les recettes.
   */
  onChangeSearch: (search: string) => void;
  /**
   * Chaque catégorie est associée à un chiffre qui représente le nombre de
   * recettes ayant cette catégorie.
   */
  categories: {
    [category: string]: number;
  };
};

type CategoryInput = {
  [category: string]: string;
};

type SearchInput = {
  q: string;
};

/**
 * Ce composant permet d'afficher les outils de filtrage des recettes:
 * - la sélection des catégories
 * - la barre de recherche
 *
 * @component
 */
function RecipesToolbar({
  onChangeCategories,
  onChangeSearch,
  categories,
}: RecipesToolbarProps): JSX.Element {
  const {
    register: registerCategories,
    getValues: getCategoriesValues,
  } = useForm<CategoryInput>();
  const {
    register: registerSearch,
    handleSubmit: handleSubmitSearch,
  } = useForm<SearchInput>();
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

  const handleSearch = (data: SearchInput) => {
    const search = data.q;
    onChangeSearch(search);
  };

  const categoriesKeys = Object.keys(categories);
  const categoriesCheckbox = categoriesKeys.map((category) => {
    return (
      <li
        className={styles.collapsibleCategoryListItem}
        key={category}
      >
        <input
          className={styles.collapsibleCheckboxInput}
          type="checkbox"
          value={category}
          aria-label={category}
          onClick={handleCheckbox}
          {...registerCategories(category)}
        />
        {category}
        <span className={styles.collapsibleCheckboxSpan}>
          {categories[category]}
        </span>
      </li>
    );
  });

  return (
    <fieldset className={styles.toolbar}>
      <div className={styles.toolbarContainer}>
        <form
          role="search"
          onSubmit={handleSubmitSearch(handleSearch)}
          className={styles.searchbox}
        >
          <input
            className={styles.searchboxInput}
            type="search"
            placeholder="Recherche..."
            spellCheck="true"
            size={30}
            {...registerSearch("q")}
          />
          <button
            className={styles.searchboxButton}
            data-testid="search-button"
          ></button>
        </form>
        <div className={styles.collapsibleWithButton}>
          <button
            className={`${styles.categoryButton} ${"button"} ${"collapsibleButton"} ${"secondaryButton"} ${
              isPannelOpen ? "collapsibleButtonOpened" : "collapsibleButtonClosed"
            }`}
            aria-expanded="false"
            aria-controls="collapsible-panel"
            onClick={handlePannelClick}
          >
            Catégories
          </button>
          <form
          className={`${styles.categoryPanel} ${
            isPannelOpen ? styles.categoryPanelOpened : "hidden"
          }`}
          >
            <ul className={styles.collapsibleCategoryListContainer}>
              {categoriesCheckbox}
            </ul>
          </form>
        </div>
      </div>
    </fieldset>
  );
}

export default RecipesToolbar;
