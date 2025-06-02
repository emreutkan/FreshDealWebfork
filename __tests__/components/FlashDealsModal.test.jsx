import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FlashDealsModal from '../../src/components/FlashDealsModal';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';

jest.mock('@src/redux/thunks/restaurantThunks.js', () => ({
  getFlashDealsThunk: () => ({ type: 'MOCK_GET_FLASH_DEALS' }),
}));

const mockStore = configureStore({
  middlewares: [thunk],
});


const renderWithProviders = (ui, { initialState }) => {
  const store = mockStore(initialState);
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    ),
    store,
  };
};

describe('FlashDealsModal', () => {
  const mockRestaurants = [
    {
      id: 1,
      restaurantName: 'Pizza Place',
      flash_deals_available: true,
      image_url: '',
      rating: 4.5,
      distance_km: 2.3,
    },
  ];

  const initialStateWithData = {
    restaurant: {
      flashDealsRestaurants: mockRestaurants,
      flashDealsLoading: false,
    },
  };

  const initialStateLoading = {
    restaurant: {
      flashDealsRestaurants: [],
      flashDealsLoading: true,
    },
  };

  test('renders modal content with available discounts and restaurants', () => {
    renderWithProviders(<FlashDealsModal show={true} onHide={jest.fn()} />, {
      initialState: initialStateWithData,
    });

    expect(screen.getByText('Available Discounts:')).toBeInTheDocument();
    expect(screen.getByText('Pizza Place')).toBeInTheDocument();
    expect(screen.getByText('Flash Deal Available')).toBeInTheDocument();
  });

  test('renders loading spinner when loading is true', () => {
    renderWithProviders(<FlashDealsModal show={true} onHide={jest.fn()} />, {
      initialState: initialStateLoading,
    });

    expect(screen.getAllByText('Loading Flash Deals...')).toHaveLength(2);
    expect(screen.getByRole('status')).toBeInTheDocument(); // spinner
  });

  test('calls onHide when Close button is clicked', () => {
    const mockOnHide = jest.fn();

    renderWithProviders(<FlashDealsModal show={true} onHide={mockOnHide} />, {
      initialState: initialStateWithData,
    });

    fireEvent.click(screen.getByText('Close'));
    expect(mockOnHide).toHaveBeenCalledTimes(1);
  });

  test('dispatches getFlashDealsThunk when modal is shown', () => {
    const { store } = renderWithProviders(<FlashDealsModal show={true} onHide={() => {}} />, {
      initialState: initialStateWithData,
    });

    const actions = store.getActions();
    expect(actions).toEqual(expect.arrayContaining([{ type: 'MOCK_GET_FLASH_DEALS' }]));
  });
});
