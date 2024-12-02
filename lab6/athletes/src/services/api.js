import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/products';

// Функція для отримання всіх продуктів з параметрами
export const fetchProducts = async (filters = {}) => {
    //console.log('filters:', filters);
    try {
        // Формуємо параметри для URL з урахуванням фільтрів і рядка пошуку
        const params = new URLSearchParams(filters).toString();
        //console.log('params:', new URLSearchParams(filters).toString());
        //console.log('params$:',` ${params}`);
        const response = await axios.get(`${BASE_URL}?${params}`);
        return response.data;
    } catch (error) {
        console.error("Помилка при отриманні продуктів:", error);
        throw error;
    }
};
