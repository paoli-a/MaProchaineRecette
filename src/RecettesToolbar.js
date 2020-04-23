import React, {useState} from 'react';
import './RecettesToolbar.css';
import { useForm } from 'react-hook-form';

function RecettesToolbar({onChangeCategories, onChangeSearch}) {

  const { register, getValues} = useForm()
  const [isOpen, setOpen] = useState(false);

  const handlePannelClick = () => setOpen(!isOpen)

  const handleCheckboxClick = () => {
    const data = getValues()
    delete data.q;
    const categoriesValues = Object.values(data)
    const filteredValues = categoriesValues.filter(Boolean)
    onChangeCategories(filteredValues)
  }

  const handleSearchClick = () => {
    const values = getValues()
    const search = values.q
    onChangeSearch(search)

  }

  return (
    <fieldset className="dropdown-container">
      <div className="inline">
        <button className="dropdown-closed" aria-expanded="false"
        aria-controls="panneau-depliant" onClick={handlePannelClick}>
          Catégorie
        </button>
        <div id="panneau-depliant" className={isOpen ? null : "hidden"}>
          <ul>
            <li>
              <input type="checkbox" value="Entrée" name="Entrée"
                aria-label="Entrée" ref={register} onClick={handleCheckboxClick}/>
            Entrée
            </li>
            <li>
              <input type="checkbox" value="Plat" name="Plat"
                aria-label="Plat" ref={register} onClick={handleCheckboxClick}/>
              Plat
            </li>
            <li>
              <input type="checkbox" value="Dessert" name="Dessert"
                aria-label="Dessert" ref={register} onClick={handleCheckboxClick}/>
              Dessert
            </li>
          </ul>
        </div>
      </div>
      <div className="inline" role="search">
        <input type="search" id="maRecherche" name="q"
        placeholder="Recherche..." spellCheck="true" size="30" ref={register}/>
        <button onClick={handleSearchClick}>Ok</button>
      </div>
    </fieldset>
  );
}

export default RecettesToolbar;
