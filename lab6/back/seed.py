from app import db, Product, app

# Функция для добавления тестовых данных
def seed_data():
    products = [
        Product(itemNumber="1", title="asics", description="дуже зручні", price=100, color="white", size="42",
                country="Canada", image='./images/1.jpg'),
        Product(itemNumber="2", title="new balance", description="швидко брудняться", price=50, color="white",
                size="40", country="England", image="./images/2.jpg"),
        Product(itemNumber="3", title="hoka", description="на кожен день", price=75, color="pink", size="40",
                country="USA", image="./images/3.jpg"),
        Product(itemNumber="4", title="saucony", description="какашка", price=60, color="green", size="41",
                country="England", image="./images/4.jpg")
    ]

    db.session.bulk_save_objects(products)
    db.session.commit()

# Создание таблиц и добавление данных внутри контекста приложения
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_data()
