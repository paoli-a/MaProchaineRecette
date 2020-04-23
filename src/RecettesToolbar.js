import React, {useState} from 'react';
import './RecettesToolbar.css';
import { useForm } from 'react-hook-form';

function RecettesToolbar({onChangeCategories, onChangeSearch}) {

  const { register: registerCategories, getValues: getCategoriesValues } = useForm()
  const {register: registerSearch, handleSubmit: handleSubmitSearch} = useForm()
  const [isPannelOpen, setPannelOpen] = useState(false)

  const handlePannelClick = () => setPannelOpen(!isPannelOpen)

  const handleCheckbox = () => {
    const data = getCategoriesValues()
    const categoriesValues = Object.values(data)
    const filteredValues = categoriesValues.filter(Boolean)
    onChangeCategories(filteredValues)
  }

  const handleSearch = (data) => {
    const search = data.q
    onChangeSearch(search)
  }

  return (
    <fieldset className="dropdown-container">
      <div className="inline">
        <button className="dropdown-closed" aria-expanded="false"
        aria-controls="panneau-depliant" onClick={handlePannelClick}>
          Catégorie
        </button>
        <form id="panneau-depliant" className={isPannelOpen ? null : "hidden"}>
          <ul>
            <li>
              <input type="checkbox" value="Entrée" name="Entrée"
                aria-label="Entrée" ref={registerCategories} onClick={handleCheckbox}/>
            Entrée
            </li>
            <li>
              <input type="checkbox" value="Plat" name="Plat"
                aria-label="Plat" ref={registerCategories} onClick={handleCheckbox}/>
              Plat
            </li>
            <li>
              <input type="checkbox" value="Dessert" name="Dessert"
                aria-label="Dessert" ref={registerCategories} onClick={handleCheckbox}/>
              Dessert
            </li>
          </ul>
        </form>
      </div>
      <form className="inline" role="search" onSubmit={handleSubmitSearch(handleSearch)}>
        <input type="search" id="maRecherche" name="q"
        placeholder="Recherche..." spellCheck="true" size="30" ref={registerSearch}/>
        <button>Ok</button>
      </form>
    </fieldset>
  );
}

export default RecettesToolbar;
