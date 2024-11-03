document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('athleteForm');
    let editAthleteData = localStorage.getItem('editAthleteData');

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
        const age = parseInt(document.getElementById('age').value);
        const category = document.getElementById('category').value;

        const newAthlete = { name, club, age, category };

        if (editAthleteData) {
            const athlete = JSON.parse(editAthleteData);
            fetch(`http://127.0.0.1:5000/athletes/${athlete.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAthlete)
            })
            .then(() => {
                alert('Athlete updated!');
                localStorage.removeItem('editAthleteData');
                window.location.href = 'index.html';
            })
            .catch(error => console.error('Ошибка при обновлении:', error));
        } else {
            fetch('http://127.0.0.1:5000/athletes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAthlete)
            })
            .then(() => {
                alert('Athlete created!');
                window.location.href = 'index.html';
            })
            .catch(error => console.error('Ошибка при создании:', error));
        }
    });
});
