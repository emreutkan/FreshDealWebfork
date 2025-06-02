import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import RestaurantMap from '../../src/components/RestaurantMap';

const mockStore = configureMockStore();

describe('RestaurantMap', () => {
  it('renders without crashing', () => {
    const store = mockStore({
      restaurant: { restaurantsProximity: [] },
      address: { addresses: [], selectedAddressId: null },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <RestaurantMap />
        </MemoryRouter>
      </Provider>
    );

    expect(container).toBeInTheDocument();
  });
});
