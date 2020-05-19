import React, { useState } from "react";
import "./RecettesToolbar.css";
import { useForm } from "react-hook-form";

function RecettesToolbar({ onChangeCategories, onChangeSearch, categories }) {
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
  const categoriesCheckbox = categoriesKeys.map((categorie) => {
    return (
      <li key={categorie}>
        <input
          type="checkbox"
          value={categorie}
          name={categorie}
          aria-label={categorie}
          ref={registerCategories}
          onClick={handleCheckbox}
        />
        {categorie}
        <span>{categories[categorie]}</span>
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
            aria-controls="panneau-depliant"
            onClick={handlePannelClick}
          >
            Catégories
          </button>
          <form
            id="panneau-depliant"
            className={isPannelOpen ? null : "hidden"}
          >
            <ul>{categoriesCheckbox}</ul>
          </form>
        </div>
        <form
          role="search"
          onSubmit={handleSubmitSearch(handleSearch)}
          id="recherche"
        >
          <input
            type="search"
            id="maRecherche"
            name="q"
            placeholder="Recherche..."
            spellCheck="true"
            size="30"
            ref={registerSearch}
          />
          <button data-testid="search-button"></button>
        </form>
      </div>
    </fieldset>
  );
}

export default RecettesToolbar;
