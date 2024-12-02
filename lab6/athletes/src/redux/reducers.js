import { createReducer, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setCart } from './actions';

const initialState = {
    cart: []
};

// Асинхронна дія для додавання товару в кошик
export const addToCart = createAsyncThunk('cart/addToCart', async (product, { dispatch, rejectWithValue }) => {
    try {
        await axios.post('http://localhost:5000/api/cart', product, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        dispatch(fetchCart()); // Після додавання товару оновлюємо кошик
    } catch (error) {
        console.error("Помилка при додаванні товару в кошик:", error);
        return rejectWithValue(error.response.data);
    }
});

// Асинхронна дія для отримання кошика з бази даних
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error("Помилка при завантаженні кошика:", error);
        return rejectWithValue(error.response.data);
    }
});

// Ред'юсер
const cartReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setCart, (state, action) => {
            state.cart = action.payload;
        })
        .addCase(fetchCart.fulfilled, (state, action) => {
            state.cart = action.payload;
        })
        .addCase(addToCart.fulfilled, (state, action) => {
            const { itemNumber, quantity, size } = action.meta.arg; // Отримуємо дані з аргументів виклику
            const existingProductIndex = state.cart.findIndex(
                item => item.itemNumber === itemNumber && item.size === size
            );

            if (existingProductIndex !== -1) {
                state.cart[existingProductIndex].quantity += quantity; // Збільшуємо або зменшуємо кількість
                if (state.cart[existingProductIndex].quantity <= 0) {
                    // Якщо кількість 0 або менше, видаляємо товар
                    state.cart.splice(existingProductIndex, 1);
                }
            } else {
                state.cart.push({ ...action.meta.arg, quantity });
            }
        });
});

export default cartReducer;
