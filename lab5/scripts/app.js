document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.getElementById('cards-container');
    const searchInput = document.getElementById('search');
    const sortNameBtn = document.getElementById('sortName');
    const sortAgeBtn = document.getElementById('sortAge');
    const totalAgeDisplay = document.getElementById('total-age');

    let sortBy = '';  // Поле для сортировки
    let reverse = false;  // Порядок сортировки

    function fetchAthletes(query = '') {
        let url = `http://127.0.0.1:5000/athletes?name=${query}&sort_by=${sortBy}&reverse=${reverse}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                renderAthletes(data.athletes);
            })
            .catch(error => console.error('Ошибка загрузки данных:', error));
    }

    function renderAthletes(athletes) {
        cardsContainer.innerHTML = '';
        let totalAge = athletes.reduce((sum, a) => sum + a.age, 0);
        totalAgeDisplay.textContent = `${totalAge}`;

        athletes.forEach(athlete => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <h2>${athlete.name}</h2>
                <p><strong>Клуб:</strong> ${athlete.club}</p>
                <p><strong>Возраст:</strong> ${athlete.age}</p>
                <p><strong>Разряд:</strong> ${athlete.category}</p>
                <button class="edit-btn" data-id="${athlete.id}">Редагувати</button>
                <button class="delete-btn" data-id="${athlete.id}">Видалити</button>
            `;
            cardsContainer.appendChild(card);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                deleteAthlete(id);
            });
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                editAthlete(id);
            });
        });
    }

    function deleteAthlete(id) {
        fetch(`http://127.0.0.1:5000/athletes/${id}`, { method: 'DELETE' })
            .then(() => fetchAthletes())
            .catch(error => console.error('Ошибка удаления:', error));
    }

    function editAthlete(id) {
        const athlete = athletes.find(a => a.id == id);
        localStorage.setItem('editAthleteData', JSON.stringify(athlete));
        window.location.href = 'create.html';
    }

    searchInput.addEventListener('input', () => {
        fetchAthletes(searchInput.value);
    });

    sortNameBtn.addEventListener('click', () => {
        sortBy = 'name';
        reverse = !reverse;
        fetchAthletes(searchInput.value);
    });

    sortAgeBtn.addEventListener('click', () => {
        sortBy = 'age';
        reverse = !reverse;
        fetchAthletes(searchInput.value);
    });

    fetchAthletes();
});
