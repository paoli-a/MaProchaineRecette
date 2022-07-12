import Head from "next/head";
import { Menu } from "../components/MyNextRecipe";
import styles from "./Home.module.scss";

/**
 * Page d'accueil de l'application.
 *
 * @component
 */
function Home() {
  return (
    <>
      <Head>
        <title>Page d'accueil</title>
      </Head>
      <Menu />
      <main className={styles.HomeComponent}>
        <h1 className={styles.title}>Ma prochaine recette</h1>
        <section className={styles.homePageSection}>
          <img
            className={styles.recipeImg}
            src="images/recipe_Img.jpg"
            alt=""
          />
          <div className={styles.contentContainer}>
            <p className={styles.paragraph}>
              Cette application va vous permettre non seulement d’enregistrer
              vos recettes préférées mais aussi de vous proposer vos recettes
              possibles en fonction des ingrédients que vous avez dans votre
              frigo !
            </p>
            <p className={styles.paragraph}>
              Et en plus ces recettes sont classées en fonction de la date
              d’expiration des ingrédients nécessaires.
            </p>
            <p className={styles.paragraph}>
              Inscrivez-vous pour faciliter votre quotidien !
            </p>
            <div className={styles.buttonsContainer}>
              <button
                className={`${styles.signUpButton} button primaryButton
                `}
              >
                S'inscrire
              </button>
              <button
                className={`${styles.logInButton} button secondaryButtonAccent
                `}
              >
                Se connecter
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
