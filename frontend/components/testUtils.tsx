import axios from "axios";
import { API_PATHS } from "../constants/paths";

jest.mock("axios");
export const mockedAxios = axios as jest.Mocked<typeof axios>;

export const recipeCrumble = {
  id: "5",
  categories: ["Dessert"],
  title: "Crumble aux poires",
  ingredients: [
    { ingredient: "poires", amount: "1", unit: "kg" },
    { ingredient: "farine", amount: "150", unit: "g" },
    { ingredient: "beurre", amount: "130", unit: "g" },
    { ingredient: "cassonade", amount: "120", unit: "g" },
  ],
  duration: "1 h",
  description:
    "Épluchez et épépinez les poires. Coupez-les en dés. Faites-les revenir 10 min dans 40 g de beurre et 40 g de cassonade. Préchauffez le four à 210 °C. Mélangez la farine avec le reste de cassonade, 80 g de beurre mou en dés et 1 pincée de sel afin d'obtenir une pâte sableuse. Disposez les poires dans un plat à gratin beurré. Parsemez de pâte en l'effritant du bout des doigts. Enfournez 30 min. Servez chaud ou tiède.",
  priority_ingredients: ["poires"],
  unsure_ingredients: [],
};

export const catalogRecipes = [
  {
    id: "1",
    categories: ["Plat"],
    title: "Salade de pommes de terre radis",
    ingredients: [
      { ingredient: "pommes de terre", amount: "1", unit: "kg" },
      { ingredient: "oeufs", amount: "3", unit: "pièce(s)" },
      { ingredient: "vinaigre non balsamique", amount: "1", unit: "cas" },
      { ingredient: "radis", amount: "2", unit: "botte(s)" },
      { ingredient: "oignons bottes", amount: "2", unit: "pièce(s)" },
      { ingredient: "yaourt grec", amount: "1", unit: "pièce(s)" },
      { ingredient: "mayonnaise", amount: "1", unit: "cas" },
      { ingredient: "moutarde", amount: "0.5", unit: "cas" },
      { ingredient: "ail", amount: "1", unit: "gousse(s)" },
    ],
    duration: "35 min",
    description:
      "Eplucher et couper les patates en rondelles et les cuire à l'eau. Cuire les oeufs durs. Couper les radis en rondelles. Emincer les échalottes et les oignons. Couper les oeufs durs. Mettre le tout dans un saladier et rajouter le vinaigre. Mélanger. Préparer la sauce :  mélanger le yaourt, la mayonnaise, la moutarde, la gousse d'ail rapée. Assaisoner.",
  },
  {
    id: "2",
    categories: ["Entrée"],
    title: "Marinade de saumon fumé",
    ingredients: [
      { ingredient: "saumon fumé", amount: "200", unit: "g" },
      { ingredient: "citon vert", amount: "0.5", unit: "pièce(s)" },
      { ingredient: "vinaigre balsamique", amount: "2", unit: "cas" },
      { ingredient: "huile d'olive", amount: "2", unit: "cas" },
      { ingredient: "échalotte", amount: "1", unit: "pièce(s)" },
      { ingredient: "herbes fraiches", amount: "1", unit: "pièce(s)" },
    ],
    duration: "11:00:00",
    description:
      "Emincez le saumon, l'échalotte et le persil. Ajoutez le vinaigre, l'huile, le citron et un peu de poivre. Mélangez et laissez mariner toute la nuit.",
  },
];
export const fridgeRecipes = [
  {
    id: "1",
    categories: ["Plat", "Entrée"],
    title: "Salade de pommes de terre radis",
    ingredients: [
      { ingredient: "pommes de terre", amount: "1", unit: "kg" },
      { ingredient: "oeufs", amount: "3", unit: "pièce(s)" },
      { ingredient: "vinaigre non balsamique", amount: "1", unit: "cas" },
      { ingredient: "radis", amount: "2", unit: "botte(s)" },
      { ingredient: "oignons bottes", amount: "2", unit: "pièce(s)" },
      { ingredient: "yaourt grec", amount: "1", unit: "pièce(s)" },
      { ingredient: "mayonnaise", amount: "1", unit: "cas" },
      { ingredient: "moutarde", amount: "0.5", unit: "cas" },
      { ingredient: "ail", amount: "1", unit: "gousse(s)" },
    ],
    duration: "35 min",
    description:
      "Epluchez et coupez les patates en rondelles et les cuire à l'eau. Cuire les oeufs durs. Coupez les radis en rondelles. Emincez les échalottes et les oignons. Coupez les oeufs durs. Mettre le tout dans un saladier et rajoutez le vinaigre. Mélangez. Préparez la sauce :  mélangez le yaourt, la mayonnaise, la moutarde, la gousse d'ail rapée. Assaisoner. Une recette en or ...",
    priority_ingredients: ["oeufs"],
    unsure_ingredients: ["ail"],
  },
  {
    id: "2",
    categories: ["Entrée"],
    title: "Marinade de saumon fumé",
    ingredients: [
      { ingredient: "saumon fumé", amount: "200", unit: "g" },
      { ingredient: "citon vert", amount: "0,5", unit: "pièce(s)" },
      { ingredient: "vinaigre balsamique", amount: "2", unit: "cas" },
      { ingredient: "huile d'olive", amount: "2", unit: "cas" },
      { ingredient: "échalotte", amount: "1", unit: "pièce(s)" },
      { ingredient: "herbes fraiches", amount: "1", unit: "cas" },
    ],
    duration: "11 h",
    description:
      "Emincez le saumon, l'échalotte et le persil. Ajoutez le vinaigre, l'huile, le citron et un peu de poivre. Mélangez et laissez mariner toute la nuit.",
    priority_ingredients: ["herbes raiches"],
    unsure_ingredients: [],
  },
  {
    id: "3",
    categories: ["Dessert"],
    title: "Crumble aux poires",
    ingredients: [
      { ingredient: "poires", amount: "1", unit: "kg" },
      { ingredient: "farine", amount: "150", unit: "g" },
      { ingredient: "beurre", amount: "130", unit: "g" },
      { ingredient: "cassonade", amount: "120", unit: "g" },
    ],
    duration: "1 h",
    description:
      "Épluchez et épépinez les poires. Coupez-les en dés. Faites-les revenir 10 min dans 40 g de beurre et 40 g de cassonade. Préchauffez le four à 210 °C. Mélangez la farine avec le reste de cassonade, 80 g de beurre mou en dés et 1 pincée de sel afin d'obtenir une pâte sableuse. Disposez les poires dans un plat à gratin beurré. Parsemez de pâte en l'effritant du bout des doigts. Enfournez 30 min. Servez chaud ou tiède.",
    priority_ingredients: ["poires"],
    unsure_ingredients: [],
  },
];
export const fridgeIngredients = [
  {
    id: 1,
    ingredient: "Epinards",
    expiration_date: new Date(2100, 4, 15),
    amount: "60",
    unit: "g",
  },
  {
    id: 2,
    ingredient: "Mascarpone",
    expiration_date: new Date(2100, 4, 15),
    amount: "1",
    unit: "kg",
  },
  {
    id: 3,
    ingredient: "Poires",
    expiration_date: new Date(2100, 3, 13),
    amount: "1",
    unit: "kg",
  },
];
export const catalogIngredients = [
  { name: "Fraises" },
  { name: "Poires" },
  { name: "Beurre" },
  { name: "Framboises" },
  { name: "Epinards" },
  { name: "Mascarpone" },
];
export const catalogCategories = ["Entrée", "Plat", "Dessert", "Gouter"];
export const units = ["kg", "g", "cl", "pièce(s)"];
let axiosResponseIngredients;
let axiosResponseRecipes;
let axiosResponseFridgeIngredients;
let axiosResponseCategories;
let axiosResponseUnits;
let axiosResponseFridgeRecipes;

export function axiosGetGlobalMock() {
  axiosResponseIngredients = { data: catalogIngredients };
  axiosResponseRecipes = { data: catalogRecipes };
  axiosResponseFridgeRecipes = { data: fridgeRecipes };
  axiosResponseFridgeIngredients = { data: fridgeIngredients };
  axiosResponseCategories = { data: catalogCategories };
  axiosResponseUnits = { data: units };
  mockAxiosGet();
}

function mockAxiosGet(rejectedElement?: string) {
  mockedAxios.get.mockImplementation((url) => {
    if (url === API_PATHS.catalogIngredients) {
      return rejectedElement === "ingredients"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseIngredients);
    } else if (url === API_PATHS.catalogRecipes) {
      return rejectedElement === "recipes"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseRecipes);
    } else if (url === API_PATHS.fridgeIngredients) {
      return rejectedElement === "fridge"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseFridgeIngredients);
    } else if (url === API_PATHS.fridgeRecipes) {
      return rejectedElement === "feasibleRecipes"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseFridgeRecipes);
    } else if (url === API_PATHS.catalogCategories) {
      return rejectedElement === "categories"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseCategories);
    } else if (url === API_PATHS.units) {
      return rejectedElement === "units"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseUnits);
    } else {
      return Promise.reject(new Error(`L'URL '${url}' n'est pas supportée.`));
    }
  });
}
