import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Account from '../../src/pages/Account';
import userReducer from '../../src/redux/slices/userSlice';
import restaurantReducer from '../../src/redux/slices/restaurantSlice';

jest.mock('../../src/redux/thunks/userThunks', () => {
  const thunkNames = [
    'fetchUserAchievementsThunk',
    'loginUserThunk',
    'registerUserThunk',
    'updateUsernameThunk',
    'updateEmailThunk',
    'updatePasswordThunk',
    'getUserDataThunk',
    'getUserRankingsThunk',
    'getFavoritesThunk',
    'addFavoriteThunk',
    'removeFavoriteThunk'
  ];

  const mockedThunks = {};

  thunkNames.forEach(name => {
    mockedThunks[name] = {
      pending: `${name}/pending`,
      fulfilled: `${name}/fulfilled`,
      rejected: `${name}/rejected`,
    };
  });

  const getUserRankThunk = () => ({ type: 'getUserRankThunk/mock' });
  getUserRankThunk.pending = 'getUserRankThunk/pending';
  getUserRankThunk.fulfilled = 'getUserRankThunk/fulfilled';
  getUserRankThunk.rejected = 'getUserRankThunk/rejected';

  mockedThunks.getUserRankThunk = getUserRankThunk;

  return mockedThunks;
});




const renderWithStore = (ui, { preloadedState }) => {
  const store = configureStore({
    reducer: {
      user: userReducer,
      restaurant: restaurantReducer,
    },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/account']}>
        <Routes>
          <Route path="/account" element={ui} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

test('Account component renders without crashing', () => {
  const preloadedState = {
    user: {
      token: 'mock-token',
      info: { id: 1 },
    },
    restaurant: {
      favoriteRestaurantsIDs: [],
    },
  };

  renderWithStore(<Account />, { preloadedState });
});
