DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products
(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    price FLOAT(23,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY(item_id)
);

    INSERT INTO products
        (product_name,department_name,price,stock_quantity)
    VALUES
        ("cheese", "food", 5, 100),
        ("beer", "food", 3.51, 100),
        ("tennis balls", "sports", 1, 100),
        ("beef", "food", 4, 100),
        ("personal computer", "electronics", 1000, 5),
        ("macbook", "electronics", 3000, 5),
        ("xbox controller", "electronics", 30, 100),
        ("camera", "electronics", 1500, 100),
        ("halloween candy", "food", 1, 100),
        ("door", "home", 100, 100),
        ("bookcase", "home", 100, 5),
        ("plushies", "home", 50, 500);