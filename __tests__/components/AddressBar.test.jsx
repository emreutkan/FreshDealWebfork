import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import AddressBar from "../../src/components/AddressBar";

const mockStore = configureStore([]);

const renderWithProviders = (ui, { initialState }) => {
  const store = mockStore(initialState);
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe("AddressBar", () => {
  test("displays the selected address if it exists", () => {
    const initialState = {
      address: {
        selectedAddressId: 2,
        addresses: [
          { id: 1, street: "1st Street", neighborhood: "Old Town", district: "East District", is_primary: false },
          { id: 2, street: "2nd Avenue", neighborhood: "Downtown", district: "Central District", is_primary: true },
        ],
      },
    };

    renderWithProviders(<AddressBar />, { initialState });

    expect(screen.getByText(/2nd Avenue, Downtown, Central District/i)).toBeInTheDocument();
  });

  test("shows fallback message when no addresses exist", () => {
    const initialState = {
      address: {
        selectedAddressId: null,
        addresses: [],
      },
    };

    renderWithProviders(<AddressBar />, { initialState });

    expect(screen.getByText(/Add your delivery address/i)).toBeInTheDocument();
  });

  test("displays primary address if no selected address is set", () => {
    const initialState = {
      address: {
        selectedAddressId: null,
        addresses: [
          { id: 3, street: "Main Street", neighborhood: "Greenwood", district: "Northside", is_primary: true },
        ],
      },
    };

    renderWithProviders(<AddressBar />, { initialState });

    expect(screen.getByText(/Main Street, Greenwood, Northside/i)).toBeInTheDocument();
  });

  test("link navigates to /Address", () => {
    const initialState = {
      address: {
        selectedAddressId: null,
        addresses: [],
      },
    };

    renderWithProviders(<AddressBar />, { initialState });

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/Address");
  });
});
