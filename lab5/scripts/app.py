from flask import Flask, jsonify, request, abort
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Разрешаем CORS для взаимодействия с фронтендом

# Временное хранилище данных (в памяти)
athletes = []

# Получение списка спортсменов с фильтрацией и сортировкой
@app.route('/athletes', methods=['GET'])
def get_athletes():
    name_filter = request.args.get('name', '').lower()
    sort_by = request.args.get('sort_by')
    reverse = request.args.get('reverse', 'false').lower() == 'true'

    # Фильтрация по имени
    filtered_athletes = [a for a in athletes if name_filter in a['name'].lower()]

    # Сортировка, если указано поле
    if sort_by in ['name', 'age']:
        filtered_athletes.sort(key=lambda x: x[sort_by], reverse=reverse)

    return jsonify({"athletes": filtered_athletes})

# Добавление нового спортсмена
@app.route('/athletes', methods=['POST'])
def create_athlete():
    data = request.json
    if not data.get('name') or not data.get('age'):
        abort(400, 'Необходимо указать имя и возраст')

    new_id = len(athletes) + 1  # Присваиваем новый ID
    data['id'] = new_id
    athletes.append(data)  # Сохраняем данные в памяти
    return jsonify(data), 201

# Удаление спортсмена
@app.route('/athletes/<int:athlete_id>', methods=['DELETE'])
def delete_athlete(athlete_id):
    global athletes
    athletes = [a for a in athletes if a['id'] != athlete_id]
    return '', 204

# Обновление данных спортсмена
@app.route('/athletes/<int:athlete_id>', methods=['PUT'])
def update_athlete(athlete_id):
    data = request.json
    for athlete in athletes:
        if athlete['id'] == athlete_id:
            athlete.update(data)
            return jsonify(athlete)
    abort(404)

if __name__ == '__main__':
    app.run(debug=True)
