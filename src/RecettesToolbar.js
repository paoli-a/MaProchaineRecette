import React, {useState} from 'react';
import './RecettesToolbar.css';
import { useForm } from 'react-hook-form';

function RecettesToolbar({onChange}) {

  const { register, getValues} = useForm()
  const [isOpen, setOpen] = useState(false);

  const handleClick = () => setOpen(!isOpen)

  const handleCheckboxClick = () => {
    const categories = getValues()
    const categoriesValues = Object.values(categories)
    const filteredValues = categoriesValues.filter(Boolean)
    onChange(filteredValues)
  }

  return (
    <fieldset className="dropdown-container">
      <div className="inline">
        <button className="dropdown-closed" aria-expanded="false"
        aria-controls="panneau-depliant" onClick={handleClick}>
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
                aria-label="Plat"ref={register} onClick={handleCheckboxClick}/>
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
      <div className="inline">
        <input type="text" placeholder="Recherche"/>
      </div>
    </fieldset>
  );
}

export default RecettesToolbar;
