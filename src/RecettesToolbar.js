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
      <div>
        <div>
          <button className="dropdown-closed" aria-expanded="false"
          aria-controls="panneau-depliant" onClick={handlePannelClick}>
            Catégories
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
        <form role="search" onSubmit={handleSubmitSearch(handleSearch)}
          id="recherche">
          <input type="search" id="maRecherche" name="q"
          placeholder="Recherche..." spellCheck="true" size="30" ref={registerSearch}/>
          <button data-testid="search-button"></button>
        </form>
      </div>
    </fieldset>
  );
}

export default RecettesToolbar;
