import React, { createContext, useContext, useEffect, useState } from "react";
import AuthContext from '@src/context/AuthContext.jsx';
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { authToken } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([])
    const [cartRestaurantId, setCartRestaurantId] = useState(0)

    useEffect(() => {
      const fetchInitialCart = async () => {
        if (!authToken) return;
    
        try {
          const response = await axios.get("https://freshdealbackend.azurewebsites.net/v1/cart", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            }
          });
    
          const cartData = response.data.cart || [];
    
          setCartItems(cartData);
    
          if (cartData.length > 0) {
            setCartRestaurantId(cartData[0].restaurant_id);
          }
        } catch (error) {
          console.error(error);
        }
      };
    
      fetchInitialCart();
    }, [authToken]);

    const returnCartItems = () => {
        return cartItems
    }

    /*const getCartItems = async (restaurantId) => {
        const response = await axios.get("https://freshdealbackend.azurewebsites.net/v1/cart"
            , {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              }
            })
            console.log("catirems", response.data.cart)
            setCartItems(response.data.cart)
  axios.get(`https://freshdealbackend.azurewebsites.net/v1/listings?restaurant_id=${restaurantId}&page=1&per_page=10`).then(res => console.log("listingler", res.data.data));

    }*/

    const addToCart = async (id, restaurantId) => {
      console.log("⛳️ CartContext içindeki addToCart çalıştı"); // 🚨
try {
  const response = await axios.post("https://freshdealbackend.azurewebsites.net/v1/cart",
    { listing_id: id, count: 1 }
    , {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      }
    })
      setCartRestaurantId(restaurantId)
    
  } catch (e) {
    console.log(e);
  }

    };

    const removeFromCart = async (id) => {
        const response = await axios.delete(`https://freshdealbackend.azurewebsites.net/v1/cart/${id}`
            , {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              }
            })
            console.log(response)
    };

    return (
        <CartContext.Provider value={{ cartRestaurantId, setCartRestaurantId, addToCart, removeFromCart, returnCartItems }}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContext;
