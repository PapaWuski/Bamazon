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
let running = true
const start = () => {
    if (running){
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
            displayTable()
          break;
        case "View Low Inventory":
            lowInventory()
          break;
        case "Add to Inventory":
          break;
        case "Add New Product":
          break;
        default:
            running = false;
            connection.end()
            console.log("goodbye")
            return 0
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
    start()
  });
};

const lowInventory = () => {
    var table = new Table({
      head: ["Product ID", "Item", "Catagory", "Price", "Remaining Stock"]
      // , colWidths: [100, 200]
    });
  
    connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN 0 AND 5", (err, products) => {
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
      start()
    });
  };