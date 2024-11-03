document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.getElementById('cards-container');
    const searchInput = document.getElementById('search');
    const sortNameBtn = document.getElementById('sortName');
    const sortAgeBtn = document.getElementById('sortAge');
    const totalAgeDisplay = document.getElementById('total-age'); // Элемент для отображения суммарного возраста

    // Загрузка данных спортсменов из localStorage
    let athletes = JSON.parse(localStorage.getItem('athletes')) || [];

    // Функция для отображения карточек спортсменов
    function renderAthletes(filter = '') {
        cardsContainer.innerHTML = '';
        filter = filter.trim();
        let filteredAthletes = athletes.filter(athlete => athlete.name.toLowerCase().includes(filter.toLowerCase()));
        let totalAge = 0; // Переменная для подсчета суммарного возраста

        filteredAthletes.forEach((athlete, index) => {
            totalAge += parseInt(athlete.age); // Суммируем возраст каждого атлета

            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <h2>${athlete.name}</h2>
                <p><strong>Клуб:</strong> ${athlete.club}</p>
                <p><strong>Возраст:</strong> ${athlete.age}</p>
                <p><strong>Разряд:</strong> ${athlete.category}</p>
                <button class="edit-btn" data-index="${index}">редагувати</button>
                <button class="delete-btn" data-index="${index}">видалити</button>
            `;
            cardsContainer.appendChild(card);
        });

        totalAgeDisplay.textContent = `${totalAge}`; // Обновляем отображение суммарного возраста

        // Привязываем обработчики к кнопкам "Удалить" и "Редактировать"
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deleteAthlete(index);
            });
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                editAthlete(index);
            });
        });
    }

    function deleteAthlete(index) {
        athletes.splice(index, 1);
        localStorage.setItem('athletes', JSON.stringify(athletes));
        renderAthletes(searchInput.value);
    }

    function editAthlete(index) {
        const athleteToEdit = athletes[index];
        localStorage.setItem('editAthleteIndex', index);
        localStorage.setItem('editAthleteData', JSON.stringify(athleteToEdit));
        window.location.href = 'create.html';
    }

    searchInput.addEventListener('input', () => {
        renderAthletes(searchInput.value);
    });

    sortNameBtn.addEventListener('click', () => {
        athletes.sort((a, b) => a.name.localeCompare(b.name));
        renderAthletes(searchInput.value);
    });

    sortAgeBtn.addEventListener('click', () => {
        athletes.sort((a, b) => a.age - b.age);
        renderAthletes(searchInput.value);
    });

    renderAthletes();
});
