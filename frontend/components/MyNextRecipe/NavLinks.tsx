import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./NavLinks.module.scss";

type NavLinksProps = {
  burgerMenuVisible: boolean;
};

/**
 * Liens du menu principal du site.
 *
 * @component
 */
function NavLinks({ burgerMenuVisible }: NavLinksProps): JSX.Element {
  const router = useRouter();
  /* eslint-disable jsx-a11y/anchor-is-valid */

  return (
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
          aria-current={router.pathname === "/recipes" ? "page" : undefined}
        >
          Catalogue recettes
        </a>
      </Link>
      <Link href="/ingredients">
        <a
          className={`${styles.navLink} ${
            router.pathname === "/ingredients" ? styles.active : ""
          }`}
          aria-current={router.pathname === "/ingredients" ? "page" : undefined}
        >
          Catalogue ingrédients
        </a>
      </Link>
    </div>
  );
}

export default NavLinks;
