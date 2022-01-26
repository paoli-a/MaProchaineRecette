import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Modal from "@mui/material/Modal";
import Slide from "@mui/material/Slide";
import { useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "../../hooks";
import styles from "./Menu.module.scss";
import NavLinks from "./NavLinks";

/**
 * Menu principal du site.
 *
 * @component
 */
function Menu() {
  const [burgerMenuVisible, setBurgerMenuVisibile] = useState<boolean>(false);
  const [shouldFocusCloseButton, setShouldFocusCloseButton] =
    useState<boolean>(false);
  const { width: windowWidth } = useWindowDimensions();
  const mobileMenu = windowWidth <= 750;
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
      {mobileMenu ? (
        <>
          <button
            className={`${styles.menuIcon} ${styles.menuOpened}`}
            aria-label="Ouvrir le menu"
            aria-expanded="false"
            aria-controls="nav-buttons"
            onClick={showMenu}
          >
            <MenuIcon sx={{ width: "35rem", height: "35rem" }} />
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
                  <CloseIcon
                    fontSize="large"
                    sx={{ width: "35rem", height: "35rem" }}
                  />
                </button>
                <NavLinks burgerMenuVisible={burgerMenuVisible} />
              </div>
            </Slide>
          </Modal>
        </>
      ) : (
        <NavLinks burgerMenuVisible={burgerMenuVisible} />
      )}
    </nav>
  );
  /* eslint-enable jsx-a11y/anchor-is-valid */
}

export default Menu;
