import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Modal from "@mui/material/Modal";
import Slide from "@mui/material/Slide";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "./Menu.module.scss";

/**
 * Menu principal du site.
 *
 * @component
 */
function Menu() {
  const router = useRouter();
  /* eslint-disable jsx-a11y/anchor-is-valid */
  const [burgerMenuVisible, setBurgerMenuVisibile] = useState<boolean>(false);
  const [shouldFocusCloseButton, setShouldFocusCloseButton] = useState<boolean>(
    false
  );
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const showMenu = () => {
    setBurgerMenuVisibile(true);
  };

  const hideMenu = () => {
    setBurgerMenuVisibile(false);
  };

  useEffect(
    function updateShouldFocusState() {
      if (burgerMenuVisible) {
        setShouldFocusCloseButton(true);
      }
    },
    [burgerMenuVisible]
  );
  useEffect(
    function moveFocusToCloseButton() {
      closeButtonRef.current?.focus();
      setShouldFocusCloseButton(false);
    },
    [shouldFocusCloseButton]
  );

  return (
    <nav className={styles.nav}>
      <button
        className={`${styles.menuIcon} ${styles.menuOpened}`}
        aria-label="Ouvrir le menu"
        aria-expanded="false"
        aria-controls="nav-buttons"
        onClick={showMenu}
      >
        <MenuIcon fontSize="large" />
      </button>
      <Modal
        open={burgerMenuVisible}
        onClose={hideMenu}
        aria-label="Menu"
        closeAfterTransition
      >
        <Slide
          direction="left"
          in={burgerMenuVisible}
          mountOnEnter
          unmountOnExit
        >
          <div>
            <button
              className={`${styles.menuIcon} ${styles.menuClosed}`}
              aria-label={"Fermer le menu"}
              aria-expanded="true"
              aria-controls="nav-buttons"
              onClick={hideMenu}
              ref={closeButtonRef}
            >
              <CloseIcon fontSize="large" />
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
                  aria-current={router.pathname === "/" ? "page" : undefined}
                >
                  Recettes possibles
                </a>
              </Link>
              <Link href="/recipes">
                <a
                  className={`${styles.navLink} ${
                    router.pathname === "/recipes" ? styles.active : ""
                  }`}
                  aria-current={
                    router.pathname === "/recipes" ? "page" : undefined
                  }
                >
                  Catalogue recettes
                </a>
              </Link>
              <Link href="/ingredients">
                <a
                  className={`${styles.navLink} ${
                    router.pathname === "/ingredients" ? styles.active : ""
                  }`}
                  aria-current={
                    router.pathname === "/ingredients" ? "page" : undefined
                  }
                >
                  Catalogue ingrédients
                </a>
              </Link>
            </div>
          </div>
        </Slide>
      </Modal>
    </nav>
  );
  /* eslint-enable jsx-a11y/anchor-is-valid */
}

export default Menu;
