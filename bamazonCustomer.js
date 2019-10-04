const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table3");

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
});

const start = () => {
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
              message: `How many ${selectedItem.product_name} do you want to buy?`,
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
            if (data.quantity > selectedItem.stock_quantity) {
              console.log("Insufficient quantity!");
              return;
            }
            const totalCost = data.quantity * selectedItem.price;
            console.log(`This purchase costed $ ${totalCost.toFixed(2)}!`);
            const newQuantity = selectedItem.stock_quantity - data.quantity;
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                { stock_quantity: newQuantity },
                { item_id: selectedItem.item_id }
              ],
              (err, res) => {
                if (err) throw err;
                console.log("transaction complete!");
              }
            );
            connection.end()
          });
      });
  });
};
