import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./Menu.module.scss";

/**
 * Menu principal du site.
 *
 * @component
 */
function Menu() {
  const router = useRouter();
  /* eslint-disable jsx-a11y/anchor-is-valid */
  const [burgerMenuVisible, setBurgerMenuVisibile] = useState<boolean | null>(
    null
  );

  const showMenu = () => {
    setBurgerMenuVisibile(true);
  };

  const hideMenu = () => {
    setBurgerMenuVisibile(false);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (burgerMenuVisible) {
          hideMenu();
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [burgerMenuVisible]);

  return (
    <nav className={styles.nav}>
      <button
        className={`${styles.menuIcon} ${
          burgerMenuVisible ? styles.menuOpened : styles.menuClosed
        }`}
        aria-label={burgerMenuVisible ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={burgerMenuVisible ? true : false}
        aria-controls="nav-buttons"
        onClick={burgerMenuVisible ? hideMenu : showMenu}
      >
        {burgerMenuVisible ? (
          <CloseIcon fontSize="large" />
        ) : (
          <MenuIcon fontSize="large" />
        )}
      </button>
      <div
        className={`${styles.navButtons} ${
          burgerMenuVisible ? styles.menuOpened : styles.menuClosed
        }`}
        id="nav-buttons"
      >
        <Link href="/">
          <a
            className={`${styles.navLink} ${
              router.pathname === "/" ? styles.active : ""
            }`}
          >
            Ma prochaine recette
          </a>
        </Link>
        <Link href="/recipes">
          <a
            className={`${styles.navLink} ${
              router.pathname === "/recipes" ? styles.active : ""
            }`}
          >
            Catalogue des recettes
          </a>
        </Link>
        <Link href="/ingredients">
          <a
            className={`${styles.navLink} ${
              router.pathname === "/ingredients" ? styles.active : ""
            }`}
          >
            Catalogue des ingrédients
          </a>
        </Link>
      </div>
    </nav>
  );
  /* eslint-enable jsx-a11y/anchor-is-valid */
}

export default Menu;
