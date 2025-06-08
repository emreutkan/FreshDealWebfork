import React, { createContext, useContext, useState } from 'react';

const RestaurantFilterContext = createContext();

export const RestaurantFilterProvider = ({ children, initialShowClosedRestaurants = false }) => {
  const [showClosedRestaurants, setShowClosedRestaurants] = useState(initialShowClosedRestaurants);

  const toggleShowClosedRestaurants = () => {
    setShowClosedRestaurants(prev => !prev);
  };

  return (
    <RestaurantFilterContext.Provider value={{ showClosedRestaurants, toggleShowClosedRestaurants }}>
      {children}
    </RestaurantFilterContext.Provider>
  );
};

export const useRestaurantFilter = () => useContext(RestaurantFilterContext);

export default RestaurantFilterContext;
