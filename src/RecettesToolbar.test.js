import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RecettesToolbar from './RecettesToolbar';

test('The collapsible panel is not visible when the button is clicked', () => {
  const {getByText, getByRole} = render(<RecettesToolbar/>);
  const listbox = getByRole("listbox")
  const button = getByText("Catégorie");
  expect(listbox).not.toBeVisible();
  fireEvent.click(button);
  expect(listbox).toBeVisible();
});
