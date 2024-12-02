from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import os

app = Flask(__name__)
CORS(app)

# Налаштування бази даних і секретного ключа
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///products.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'mysecretkey')  # Вкажіть свій секретний ключ для JWT
db = SQLAlchemy(app)


# Модель для продукту
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    itemNumber = db.Column(db.String(10), nullable=False)
    title = db.Column(db.String(40), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    color = db.Column(db.String(25), nullable=False)
    size = db.Column(db.String(1), nullable=False)
    country = db.Column(db.String(25), nullable=False)
    image = db.Column(db.String(50), nullable=False)
    max_quantity = db.Column(db.Integer, nullable=False)  # Нове поле для максимальної кількості товарів


# Модель для користувача
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)  # Хешований пароль
    nonpassword = db.Column(db.String(200), nullable=False)  # Не хешований пароль


# Модель для елементів кошика
class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    itemNumber = db.Column(db.String(10), nullable=False)
    title = db.Column(db.String(40), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    size = db.Column(db.String(1), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    user = db.relationship('User', backref=db.backref('cart_items', lazy=True))


@app.route('/api/users', methods=['GET'])
def get_users():
    query = User.query
    users = query.all()
    users_list = [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "password": user.nonpassword
        } for user in users
    ]
    return jsonify(users_list)


# Реєстрація нового користувача
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(username=data['username'], email=data['email'], password=hashed_password,
                    nonpassword=data['password'])
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Користувач успішно зареєстрований"}), 201
    except:
        return jsonify({"message": "Користувач із такою електронною поштою або ім'ям вже існує"}), 409


# Авторизація користувача і генерація JWT
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        token = jwt.encode(
            {'user_id': user.id, 'exp': datetime.utcnow() + timedelta(hours=1)},
            app.config['SECRET_KEY'],
            algorithm="HS256"
        )
        return jsonify({'token': token})
    else:
        return jsonify({"message": "Недійсні облікові дані"}), 401


# Декоратор для захисту маршрутів з використанням JWT
from functools import wraps


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        print("token", token)
        if not token:
            return jsonify({"message": "Токен відсутній"}), 403
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({"message": "Токен недійсний або закінчився"}), 403
        return f(current_user, *args, **kwargs)

    return decorated


@app.route('/api/products', methods=['GET'])
def get_products():
    print("get_products")
    query = Product.query
    color = request.args.get('color')
    size = request.args.get('size')
    country = request.args.get('country')
    search = request.args.get('search')

    # Застосування фільтрів, якщо вони передані
    if color and color != 'All Colors':
        query = query.filter(Product.color == color)
    if size and size != 'All Sizes':
        query = query.filter(Product.size == size)
    if country and country != 'All Countries':
        query = query.filter(Product.country == country)
    if search:
        query = query.filter(Product.title.ilike(f"%{search}%"))

    products = query.all()
    products_list = [
        {
            'id': product.id,
            "itemNumber": product.itemNumber,
            "title": product.title,
            "description": product.description,
            "price": product.price,
            "color": product.color,
            "size": product.size,
            "country": product.country,
            "image": product.image,
            "max_quantity": product.max_quantity

        } for product in products
    ]
    print(products_list)
    return jsonify(products_list)


# Маршрут для додавання товару до кошика
@app.route('/api/cart', methods=['POST'])
@token_required
def add_to_cart(current_user):
    data = request.get_json()
    item_number = data['itemNumber']
    size = data['size']
    quantity = data['quantity']
    print("item_number", item_number)

    product = Product.query.filter_by(itemNumber=item_number).first()
    print("query", Product.query.filter_by(itemNumber=item_number))

    print("product", product)
    if not product:
        return jsonify({"message": "Товар не знайдено"}), 404
    if quantity > product.max_quantity:
        return jsonify({"message": "Кількість перевищує максимальне обмеження"}), 400

    cart_item = CartItem.query.filter_by(user_id=current_user.id, itemNumber=item_number, size=size).first()
    if cart_item:
        cart_item.quantity = min(cart_item.quantity + quantity, product.max_quantity)
    else:
        cart_item = CartItem(user_id=current_user.id, itemNumber=item_number, title=product.title,
                             quantity=quantity, size=size, price=product.price)
        db.session.add(cart_item)

    db.session.commit()
    return jsonify({"message": "Товар додано до кошика"}), 200


# Маршрут для отримання кошика поточного користувача
@app.route('/api/cart', methods=['GET'])
@token_required
def get_cart(current_user):
    cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
    cart = [
        {
            "itemNumber": item.itemNumber,
            "title": item.title,
            "price": item.price,
            "quantity": item.quantity,
            "size": item.size
        }
        for item in cart_items
    ]
    return jsonify(cart)


# Маршрут для виходу з облікового запису (очищення токена)
@app.route('/api/logout', methods=['POST'])
def logout():
    response = make_response({"message": "Вийшли з облікового запису"})
    response.headers['Authorization'] = ''
    return response, 200


if __name__ == '__main__':
    with app.app_context():  # Контекст додатку для роботи з базою даних
        db.create_all()  # Створення таблиць у базі даних
    app.run(debug=True)
