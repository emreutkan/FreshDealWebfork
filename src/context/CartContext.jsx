import { createContext, useContext, useEffect } from "react";
import AuthContext from '@src/context/AuthContext.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {addItemToCart, fetchCart, removeItemFromCart} from "@src/redux/thunks/cartThunks";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { authToken } = useContext(AuthContext);
    const dispatch = useDispatch();

    const cartItems = useSelector(state => state.cart.cartItems);
    const cartRestaurantId = useSelector(state => state.cart.cartRestaurantId);
    const setCartRestaurantId = (id) => dispatch({ type: 'cart/setCartRestaurantId', payload: id });

    useEffect(() => {
        const fetchInitialCart = async () => {
            if (!authToken) return;

            try {
                dispatch(fetchCart());
            } catch (error) {
                console.error(error);
            }
        };

        fetchInitialCart();
    }, [authToken, dispatch]);

    const returnCartItems = () => {
        return cartItems;
    }



    const addToCart = async (id, restaurantId) => {
        console.log("⛳️ CartContext içindeki addToCart çalıştı");
        try {
            await dispatch(addItemToCart({
                listing_id: id,
                restaurant_id: restaurantId
            }));
            setCartRestaurantId(restaurantId);
        } catch (e) {
            console.log(e);
        }
    };

    const removeFromCart = async (id) => {
        await dispatch(removeItemFromCart({ id }));
    };

    return (
        <CartContext.Provider value={{ cartRestaurantId, setCartRestaurantId, addToCart, removeFromCart, returnCartItems }}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContext;