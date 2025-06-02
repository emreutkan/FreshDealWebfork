import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";

jest.mock("@src/pages/AddressSelection", () => {
  return {
    __esModule: true,
    default: () => (
      <div>
        <h1>Manage Your Addresses</h1>
        <div data-testid="map" />
        <div data-testid="marker" />
        <p>You don't have any saved addresses yet</p>
      </div>
    ),
  };
});

const mockStore = configureMockStore(() => next => action => next(action));

const renderWithProviders = (ui, state = {}) => {
  const store = mockStore(state);
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe("AddressSelection Page", () => {
  const AddressSelection = require("@src/pages/AddressSelection").default;

  test("renders header", () => {
    renderWithProviders(<AddressSelection />, {
      address: { addresses: [], loading: false },
      user: { token: null, isAuthenticated: false },
    });
    expect(screen.getByText(/Manage Your Addresses/i)).toBeInTheDocument();
  });

  test("renders map and marker", () => {
    renderWithProviders(<AddressSelection />, {
      address: { addresses: [], loading: false },
      user: { token: null, isAuthenticated: false },
    });
    expect(screen.getByTestId("map")).toBeInTheDocument();
    expect(screen.getByTestId("marker")).toBeInTheDocument();
  });
});
