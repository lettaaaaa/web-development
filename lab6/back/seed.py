from app import db, Product, app

# Функция для добавления тестовых данных
def seed_data():
    products = [
        # Пара 1
        Product(
            itemNumber="Item 1",
            title="Sneakers Size 40",
            description="Comfortable everyday sneakers",
            price=100,
            color="white",
            size="40",
            country="Canada",
            image="./images/1.jpg",
            max_quantity=15
        ),
        Product(
            itemNumber="Item 5",
            title="Sneakers Size 42",
            description="Comfortable everyday sneakers",
            price=100,
            color="white",
            size="42",
            country="Canada",
            image="./images/1.jpg",
            max_quantity=15
        ),
        # Пара 2
        Product(
            itemNumber="Item 2",
            title="Sporty Shoes Size 40",
            description="Stylish and lightweight",
            price=50,
            color="blue",
            size="40",
            country="England",
            image="./images/2.jpg",
            max_quantity=10
        ),
        Product(
            itemNumber="Item 6",
            title="Sporty Shoes Size 42",
            description="Stylish and lightweight",
            price=50,
            color="blue",
            size="42",
            country="England",
            image="./images/2.jpg",
            max_quantity=10
        ),
        # Пара 3
        Product(
            itemNumber="Item 3",
            title="Casual Runners Size 40",
            description="Perfect for outdoor walks",
            price=75,
            color="pink",
            size="40",
            country="USA",
            image="./images/3.jpg",
            max_quantity=20
        ),
        Product(
            itemNumber="Item 7",
            title="Casual Runners Size 42",
            description="Perfect for outdoor walks",
            price=75,
            color="pink",
            size="42",
            country="USA",
            image="./images/3.jpg",
            max_quantity=20
        ),
        # Пара 4
        Product(
            itemNumber="Item 4",
            title="Trail Sneakers Size 40",
            description="Great for running and hiking",
            price=60,
            color="green",
            size="40",
            country="England",
            image="./images/4.jpg",
            max_quantity=10
        ),
        Product(
            itemNumber="Item 8",
            title="Trail Sneakers Size 42",
            description="Great for running and hiking",
            price=60,
            color="green",
            size="42",
            country="England",
            image="./images/4.jpg",
            max_quantity=10
        ),
    ]

    # Добавляем продукты в сессию базы данных
    db.session.bulk_save_objects(products)
    db.session.commit()

# Создание таблиц и добавление данных внутри контекста приложения
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_data()
        print("Данные успешно добавлены!")
