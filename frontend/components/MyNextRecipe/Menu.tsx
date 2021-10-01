import Link from "next/link";
import { useRouter } from "next/router";

/**
 * Menu principal du site.
 *
 * @component
 */
function Menu() {
  const router = useRouter();
  /* eslint-disable jsx-a11y/anchor-is-valid */
  return (
    <div>
      <nav className="nav">
        <Link href="/">
          <a className={`nav__link ${router.pathname === "/" ? "active" : ""}`}>
            Ma prochaine recette
          </a>
        </Link>
        <Link href="/recipes">
          <a
            className={`nav__link ${
              router.pathname === "/recipes" ? "active" : ""
            }`}
          >
            Catalogue des recettes
          </a>
        </Link>
        <Link href="/ingredients">
          <a
            className={`nav__link ${
              router.pathname === "/ingredients" ? "active" : ""
            }`}
          >
            Catalogue des ingrédients
          </a>
        </Link>
      </nav>
    </div>
  );
  /* eslint-enable jsx-a11y/anchor-is-valid */
}

export default Menu;
