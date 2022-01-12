import { fireEvent, render } from "@testing-library/react";
import * as NextRouter from "next/router";
import React from "react";
import Menu from "./Menu";

const useRouter = jest.spyOn(NextRouter, "useRouter");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
useRouter.mockReturnValue({
  pathname: "/",
  prefetch: jest.fn(
    () => new Promise<void>((resolve) => resolve())
  ),
});

describe("Burger menu", () => {
  it(`sets the focus on the close icon when clicking on the burger icon and
  sets it back on the burger icon when clicking on the close icon`, () => {
    const { getByLabelText } = render(<Menu />);
    getByLabelText(/Ouvrir le menu/).focus();
    fireEvent.click(getByLabelText(/Ouvrir le menu/));
    expect(getByLabelText(/Fermer le menu/)).toHaveFocus();
    fireEvent.click(getByLabelText(/Fermer le menu/));
    expect(getByLabelText(/Ouvrir le menu/)).toHaveFocus();
  });

  it(`sets correctly aria-expanded property on the burger and close buttons
    when opening and closing the menu`, async () => {
    const { getByLabelText, getByRole, findByRole } = render(<Menu />);
    fireEvent.click(getByLabelText(/Ouvrir le menu/));
    expect(
      getByRole("button", { name: /Fermer le menu/, expanded: true })
    ).toBeInTheDocument();
    fireEvent.click(getByLabelText(/Fermer le menu/));
    expect(
      await findByRole("button", { name: /Ouvrir le menu/, expanded: false })
    ).toBeInTheDocument();
  });
});
