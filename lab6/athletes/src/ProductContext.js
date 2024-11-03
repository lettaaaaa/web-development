import React, { createContext, useContext, useState } from 'react';
import asics from './images/1.jpg';
import balance from './images/2.jpg';
import hoka from './images/3.jpg';
import saucony from './images/4.jpg';


// Создаем контекст
const ProductContext = createContext();

// Хук для использования контекста продуктов
export const useProducts = () => {

    return useContext(ProductContext);
};

// Провайдер, который будет предоставлять данные о продуктах
export const ProductProvider = ({ children }) => {
    // Состояние с информацией о карточках продуктов
    const [products] = useState(
        [
{
            itemNumber: '1',
            title: 'asics',
            description: 'дуже зручні',
            price: '$100',
            color: 'white',
            size: '42',
            country: 'Canada',
            image: asics
        },
        {
            itemNumber: '2',
            title: 'new balance',
            description: 'швидко брудняться',
            price: '$50',
            color: 'white',
            size: '40',
            country: 'England',
            image: balance
        },
        {
            itemNumber: '3',
            title: 'hoka',
            description: 'на кожен день',
            price: '$75',
            color: 'pink',
            size: '40',
            country: 'USA',
            image: hoka
        },
        {
            itemNumber: '4',
            title: 'saucony',
            description: 'какашка',
            price: '$60',
            color: 'grin',
            size: '41',
            country: 'England',
            image: saucony
        }
        ]
    );

    // Возвращаем провайдер с доступом к состоянию продуктов
    return (
        <ProductContext.Provider value={{ products }}>
            {children}
        </ProductContext.Provider>
    );
};
