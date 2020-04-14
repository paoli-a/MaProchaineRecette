import React, {useState} from 'react';
import './RecettesToolbar.css';
import { useForm } from 'react-hook-form';

function RecettesToolbar() {

  const { register} = useForm()
  const [isOpen, setOpen] = useState(false);

  const handleClick = () => setOpen(!isOpen)

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
              <input type="checkbox" value="Entrée" ref={register}/>
            Entrée
            </li>
            <li>
              <input type="checkbox" value="Plat" ref={register}/>
              Plat
            </li>
            <li>
              <input type="checkbox" value="Dessert" ref={register}/>
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
