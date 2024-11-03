document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('athleteForm');
    let editIndex = localStorage.getItem('editAthleteIndex');
    let editAthleteData = localStorage.getItem('editAthleteData');

    // Если есть данные для редактирования, заполняем поля
    if (editAthleteData) {
        const athlete = JSON.parse(editAthleteData);
        document.getElementById('name').value = athlete.name;
        document.getElementById('club').value = athlete.club;
        document.getElementById('age').value = athlete.age;
        document.getElementById('category').value = athlete.category;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const club = document.getElementById('club').value;
        const age = parseInt(document.getElementById('age').value); // Преобразуем в число
        const category = document.getElementById('category').value;

        // Проверка на положительное значение возраста
        if (age <= 0) {
            alert('Возраст должен быть больше нуля!'); // Сообщение об ошибке
            return; // Прерываем выполнение функции
        }

        // Проверка на дубликаты по имени
        let athletes = JSON.parse(localStorage.getItem('athletes')) || [];
        if (athletes.some(athlete => athlete.name.toLowerCase() === name.toLowerCase() && athlete.name !== "")) {
            alert('Спортсмен с таким именем уже существует!'); // Сообщение об ошибке
            return; // Прерываем выполнение функции
        }

        const newAthlete = { name, club, age, category };

        if (editIndex !== null) {
            athletes[editIndex] = newAthlete;
            localStorage.removeItem('editAthleteIndex');
            localStorage.removeItem('editAthleteData');
        } else {
            athletes.push(newAthlete);
        }

        localStorage.setItem('athletes', JSON.stringify(athletes));

        // Очищаем форму
        document.getElementById('name').value = '';
        document.getElementById('club').value = '';
        document.getElementById('age').value = '';
        document.getElementById('category').value = '';

        alert('Athlete saved!');
        if (editIndex !== null) {
            window.location.href = 'index.html';
        }
    });
});
