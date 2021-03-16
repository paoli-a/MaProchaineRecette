import React from "react";
import {
  render,
  fireEvent,
  within,
  waitFor,
  act,
} from "@testing-library/react";
import axios from "axios";
import CatalogIngredients from "./CatalogIngredients";
import { axiosGetGlobalMock } from "../testUtils";
import { SWRConfig, cache } from "swr";

require("mutationobserver-shim");
jest.mock("axios");

beforeEach(() => {
  cache.clear();
  axiosGetGlobalMock();
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderCatalog = async () => {
  let app;
  await act(async () => {
    app = render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <CatalogIngredients />
      </SWRConfig>
    );
  });
  return app;
};

it("removes the correct ingredient when clicking on remove button", async () => {
  const { getByText, getAllByRole } = await renderCatalog();
  const axiosDeleteResponse = { data: "" };
  axios.delete.mockResolvedValue(axiosDeleteResponse);
  const ingredient = getByText("Fraises", { exact: false });
  const button = within(ingredient).getByText("X");
  fireEvent.click(button);
  axios.get.mockResolvedValue({
    data: [
      { name: "Poires" },
      { name: "Beurre" },
      { name: "Framboises" },
      { name: "Epinards" },
      { name: "Mascarpone" },
    ],
  });
  await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
  const listItems = getAllByRole("listitem");
  expect(ingredient).not.toBeInTheDocument();
  expect(listItems).toHaveLength(5);
});

it(`displays an error message and keeps the ingredient if the ingredient removal
was not successful on backend side`, async () => {
  const { getByText, getAllByRole } = await renderCatalog();
  const axiosDeleteResponse = { data: "" };
  axios.delete.mockRejectedValue(axiosDeleteResponse);
  const ingredient = getByText("Fraises", { exact: false });
  const button = within(ingredient).getByText("X");
  fireEvent.click(button);
  await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
  const listItems = getAllByRole("listitem");
  expect(ingredient).toBeInTheDocument();
  expect(listItems).toHaveLength(6);
  const error = getByText(/La suppression a échoué/);
  expect(error).toBeInTheDocument();
});

it(`adds the correct ingredient when filling the form and clicking
  on submit`, async () => {
  const { getByLabelText, getByText, getAllByRole } = await renderCatalog();
  const axiosPostResponse = { data: { name: "Chocolat" } };
  axios.post.mockResolvedValue(axiosPostResponse);
  const inputName = getByLabelText("Nom de l'ingrédient à ajouter :");
  const submitButton = getByText("Envoyer");
  fireEvent.change(inputName, { target: { value: "Chocolat" } });
  fireEvent.click(submitButton);
  axios.get.mockResolvedValue({
    data: [
      { name: "Fraises" },
      { name: "Poires" },
      { name: "Beurre" },
      { name: "Framboises" },
      { name: "Epinards" },
      { name: "Mascarpone" },
      { name: "Chocolat" },
    ],
  });
  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  const ingredient = getByText("Chocolat", { exact: false });
  const listItems = getAllByRole("listitem");
  expect(listItems).toHaveLength(7);
  expect(ingredient).toBeInTheDocument();
});

it(`displays an error message and does not add the ingredient if the ingredient adding
was not successful on backend side`, async () => {
  const {
    getByLabelText,
    getByText,
    queryByText,
    getAllByRole,
  } = await renderCatalog();
  const axiosPostResponse = {};
  axios.post.mockRejectedValue(axiosPostResponse);
  const inputName = getByLabelText("Nom de l'ingrédient à ajouter :");
  const submitButton = getByText("Envoyer");
  fireEvent.change(inputName, { target: { value: "Chocolat" } });
  fireEvent.click(submitButton);
  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  const ingredient = queryByText("Chocolat", { exact: false });
  const listItems = getAllByRole("listitem");
  expect(listItems).toHaveLength(6);
  expect(ingredient).not.toBeInTheDocument();
  const error = getByText(/L'ajout a échoué/);
  expect(error).toBeInTheDocument();
});

describe("the search bar functionality works properly", () => {
  it(`displays the correct ingredients when a letter is entered in the
    search bar`, async () => {
    const {
      getByText,
      queryByText,
      getByPlaceholderText,
    } = await renderCatalog();
    const searchBar = getByPlaceholderText("Recherche...");
    fireEvent.change(searchBar, { target: { value: "M" } });
    expect(getByText("Mascarpone")).toBeInTheDocument();
    expect(queryByText("Fraises")).not.toBeInTheDocument();
    fireEvent.change(searchBar, { target: { value: "Fra" } });
    expect(getByText("Fraises")).toBeInTheDocument();
    expect(queryByText("Mascarpone")).not.toBeInTheDocument();
  });

  it("redisplays all the ingredient of the catalog after a search", async () => {
    const {
      getByText,
      queryByText,
      getByPlaceholderText,
    } = await renderCatalog();
    const searchBar = getByPlaceholderText("Recherche...");
    fireEvent.change(searchBar, { target: { value: "fr" } });
    expect(getByText("Fraises")).toBeInTheDocument();
    expect(queryByText("Mascarpone")).not.toBeInTheDocument();
    fireEvent.change(searchBar, { target: { value: "" } });
    expect(getByText("Fraises")).toBeInTheDocument();
    expect(getByText("Mascarpone")).toBeInTheDocument();
  });
});
