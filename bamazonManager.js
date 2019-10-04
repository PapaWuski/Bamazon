const mysql = require("mysql");
const Table = require("cli-table3");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  port: 3306,
  database: "bamazon"
});

connection.connect(err => {
  if (err) throw err;
  start();
  // connection.end()
});
let running = true;
const start = () => {
  if (running) {
    inquirer
      .prompt([
        {
          name: "ui",
          message: "What do you want to do?",
          type: "list",
          choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "quit"
          ]
        }
      ])
      .then(data => {
        switch (data.ui) {
          case "View Products for Sale":
            displayTable();
            break;
          case "View Low Inventory":
            lowInventory();
            break;
          case "Add to Inventory":
            addInventory();
            break;
          case "Add New Product":
                newProduct()
            break;
          default:
            running = false;
            connection.end();
            console.log("goodbye");
            return 0;
            break;
        }
      });
  }
};

const displayTable = () => {
  var table = new Table({
    head: ["Product ID", "Item", "Catagory", "Price", "Remaining Stock"]
    // , colWidths: [100, 200]
  });

  connection.query("SELECT * FROM products", (err, products) => {
    if (err) throw err;
    for (let i = 0; i < products.length; i++) {
      table.push([
        products[i].item_id,
        products[i].product_name,
        products[i].department_name,
        `$ ${products[i].price.toFixed(2)}`,
        products[i].stock_quantity
      ]);
    }

    console.log(table.toString());
    start();
  });
};

const lowInventory = () => {
  var table = new Table({
    head: ["Product ID", "Item", "Catagory", "Price", "Remaining Stock"]
    // , colWidths: [100, 200]
  });

  connection.query(
    "SELECT * FROM products WHERE stock_quantity BETWEEN 0 AND 5",
    (err, products) => {
      if (err) throw err;
      for (let i = 0; i < products.length; i++) {
        table.push([
          products[i].item_id,
          products[i].product_name,
          products[i].department_name,
          `$ ${products[i].price.toFixed(2)}`,
          products[i].stock_quantity
        ]);
      }

      console.log(table.toString());
      start();
    }
  );
};

const addInventory = () => {
  var table = new Table({
    head: ["Product ID", "Item", "Catagory", "Price", "Remaining Stock"]
    // , colWidths: [100, 200]
  });

  connection.query("SELECT * FROM products", (err, products) => {
    if (err) throw err;
    for (let i = 0; i < products.length; i++) {
      table.push([
        products[i].item_id,
        products[i].product_name,
        products[i].department_name,
        `$ ${products[i].price.toFixed(2)}`,
        products[i].stock_quantity
      ]);
    }

    console.log(table.toString());
    inquirer
      .prompt([
        {
          name: "id",
          message: "Please input product ID.",
          type: "input",
          validate: function(value) {
            if (!isNaN(value)) {
              if (value <= products.length && value > 0) {
                return true;
              }
            }
            return false;
          }
        }
      ])
      .then(data => {
        const selectedItem = products[data.id - 1];
        inquirer
          .prompt([
            {
              name: "quantity",
              message: `How many ${selectedItem.product_name} do you want to add?`,
              type: "input",
              validate: function(value) {
                if (!isNaN(value)) {
                  return true;
                }
                return false;
              }
            }
          ])
          .then(data => {
            const totalCost = data.quantity * selectedItem.price;
            const newQuantity = selectedItem.stock_quantity + data.quantity;
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                { stock_quantity: newQuantity },
                { item_id: selectedItem.item_id }
              ],
              (err, res) => {
                if (err) throw err;
                console.log("Inventory Updated !");
                start();
              }
              
            );
            
          });
      });
  });
};


const newProduct = () => {
      inquirer
        .prompt([
            {
                name: "product_name",
                message: "Please input product name.",
                type: "input"
              },          {
                name: "department_name",
                message: "Please input department name.",
                type: "input"
              },          {
                name: "price",
                message: "Please input price",
                type: "input",
                validate: function(value) {
                  if (!isNaN(value)) {
                      return true;
                  }
                  return false;
                }
              },          {
                name: "stock_quantity",
                message: "Please input quanity",
                type: "input",
                validate: function(value) {
                  if (Number.isInteger(parseFloat(value))) {
                      return true;
                  }
                  return false;
                }
              },
        ])
        .then(data => {
              connection.query(
                "INSERT INTO products (product_name,department_name,price,stock_quantity) VALUE (?)",
               [[data.product_name,data.department_name,data.price,data.stock_quantity]],
                (err, res) => {
                  if (err) throw err;
                  console.log("Inventory Updated !");
                  start();
                }
                
              );
              
            });
    
  };