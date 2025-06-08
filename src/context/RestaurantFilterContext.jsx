import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const RestaurantFilterContext = createContext();

export const useRestaurantFilter = () => useContext(RestaurantFilterContext);

export const RestaurantFilterProvider = ({ children, initialShowClosedRestaurants = false }) => {
  const [showClosedRestaurants, setShowClosedRestaurants] = useState(initialShowClosedRestaurants);

  const toggleShowClosedRestaurants = () => {
    setShowClosedRestaurants(prevState => !prevState);
  };

  return (
    <RestaurantFilterContext.Provider value={{ showClosedRestaurants, toggleShowClosedRestaurants }}>
      {children}
    </RestaurantFilterContext.Provider>
  );
};

// Add prop types validation
RestaurantFilterProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialShowClosedRestaurants: PropTypes.bool,
};
