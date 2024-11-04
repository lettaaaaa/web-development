import React, { useState, useEffect } from 'react';
import Select from './Select';
import PrimaryButton from './PrimaryButton';
import ProductList from './ProductList';
import './CatalogPage.css';
import { fetchProducts } from '../../api';

const CatalogPage = () => {
    // Состояния для строки поиска и фильтров
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedColor, setSelectedColor] = useState('All Colors');
    const [selectedSize, setSelectedSize] = useState('All Sizes');
    const [selectedCountry, setSelectedCountry] = useState('All Countries');

    // Функция загрузки продуктов
    const loadProducts = async () => {
        const filters = {
            color: selectedColor,
            size: selectedSize,
            country: selectedCountry,
            search: searchTerm,
        };
        const products = await fetchProducts(filters);
        setFilteredProducts(products);
    };

    // Загрузка продуктов при изменении фильтров или строки поиска
    useEffect(() => {
        loadProducts();
    }, [searchTerm, selectedColor, selectedSize, selectedCountry]);

    // Обработчики изменения фильтров
    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleColorChange = (e) => setSelectedColor(e.target.value);
    const handleSizeChange = (e) => setSelectedSize(e.target.value);
    const handleCountryChange = (e) => setSelectedCountry(e.target.value);

    // Применение фильтров по нажатию на "Apply"
    const applyFilters = () => {
        loadProducts();
    };

    return (
        <div>
            {/* Строка поиска */}
            <section className="search-section">
                <input
                    type="text"
                    placeholder="Search by product title..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </section>

            {/* Секция фильтров */}
            <section className="filter-section">
                <Select options={['All Colors', 'black', 'blue', 'pink', 'white']} value={selectedColor} onChange={handleColorChange} />
                <Select options={['All Sizes', '40', '41', '42']} value={selectedSize} onChange={handleSizeChange} />
                <Select options={['All Countries', 'USA', 'England']} value={selectedCountry} onChange={handleCountryChange} />
                <PrimaryButton onClick={applyFilters}>Apply</PrimaryButton>
            </section>

            {/* Список продуктов: показываем отфильтрованные продукты */}
            <ProductList products={filteredProducts} />
        </div>
    );
};

export default CatalogPage;
