import React from 'react';
import { useForm } from 'react-hook-form';

function RecettesForm ({onSubmitRecette}) {

  const { register, handleSubmit, errors, reset} = useForm()

  const onSubmitForm = (data) => {
    onSubmitRecette(data)
    reset()
  }


  return(
    <form id="formRecette" onSubmit={handleSubmit(onSubmitForm)}>
      <fieldset>
      <legend>Ajouter une recette dans mon catalogue</legend>
          <div>
            <label htmlFor="titreRecette"> Titre de la recette : </label>
            <input type="text" name="titreRecette" id="titreRecette" defaultValue=""
            ref={register({ required: true })}/>
            {errors.titreRecette && <span>Ce champ est obligatoire</span>}
          </div>
          <div>
            Catégories :
            <ul>
              <li>
                <input type="checkbox" value="Entrée" name="categorie[0]"
                  aria-label="Entrée" ref={register}/>
              Entrée
              </li>
              <li>
                <input type="checkbox" value="Plat" name="categorie[1]"
                  aria-label="Plat" ref={register}/>
                Plat
              </li>
              <li>
                <input type="checkbox" value="Dessert" name="categorie[2]"
                  aria-label="Dessert" ref={register}/>
                Dessert
              </li>
            </ul>
          </div>
          <div>
            <label htmlFor="tempsRecette"> Temps total de la recette : </label>
            <input type="time" id="tempsRecette" name="tempsRecette" min="00:01"
            ref={register({ required: true })}/>
          </div>
          <fieldset>
            <legend>  Ingrédient : </legend>
              <label htmlFor="ingredient"> Nom : </label>
              <input type="text" name="ingredient" id="ingredient"
              ref={register({ required: true })} defaultValue=""/>
              {errors.ingredient && <span>Ce champ est obligatoire</span>}
              <label htmlFor="ingredientQuantite"> Quantité nécessaire : </label>
              <input type="number" name="ingredientQuantite" id="ingredientQuantite"
              min="0" ref={register({ required: true })} defaultValue=""/>
              {errors.ingredientQuantite && <span>Ce champ est obligatoire</span>}
              <select name="unite" defaultValue="" ref={register({ required: true })}
                aria-label="Unité">
                <option value="">...</option>
                <option value="pièce">pièce</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="cl">cl</option>
              </select>
              {errors.unite && <span>Ce champ est obligatoire</span>}
          </fieldset>
          <div>
            <label htmlFor="descriptionRecette">Corps de la recette : </label>
            <textarea id="descriptionRecette" name="descriptionRecette"
            spellCheck="true" ref={register({ required: true })}>
            </textarea>
            {errors.descriptionRecette && <span>Ce champ est obligatoire</span>}
          </div>
          <input type="submit" value="Confirmer"/>
      </fieldset>
    </form>

  )
}

export default RecettesForm;
