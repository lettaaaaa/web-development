import { createAction } from '@reduxjs/toolkit';
import axios from 'axios';

export const setCart = createAction('cart/setCart');

// Дія для додавання в кошик
export const addToCart = (product) => async (dispatch) => {
    try {
        // Переконання, що токен відправляється з заголовком `Authorization`
        await axios.post('http://localhost:5000/api/cart', product, {
            headers: { Authorization: `${localStorage.getItem('token')}` }
        });
        dispatch(fetchCart());
    } catch (error) {
        console.error("Помилка при додаванні товару в кошик:", error);
    }
};

// Дія для отримання кошика
export const fetchCart = () => async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `${localStorage.getItem('token')}` }
        });
        dispatch(setCart(response.data));
    } catch (error) {
        console.error("Помилка при завантаженні кошика:", error);
    }
};
