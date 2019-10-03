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

connection.connect(err =>{
  if (err) throw err;
  start()
  connection.end()
})

const start = () => {
  var table = new Table({
    head: ['Product ID', 'Item', 'Catagory', 'Price', 'Remaining Stock']
  // , colWidths: [100, 200]
});
 
  connection.query("SELECT * FROM products",(err,products)=>{
    if (err) throw err;
    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    // table.push(products
    // );
    for (let i = 0; i < products.length; i ++){
      table.push([products[i].item_id,products[i].product_name,products[i].department_name,`$ ${products[i].price}`,products[i].stock_quantity])
    }
     
    console.log(table.toString());
    const choices = [];
    for (let i = 0; i < products.length;i++){
      const id = products[i].item_id
      const product_name = products[i].product_name
      const price = products[i].price
      choices.push(`${id} ${product_name} $${price}`)
    }
    inquirer.prompt([{
      name:"input",
      message:"Please input product ID.",
      type:"input",
      validate: function(value){
        if (!isNaN(value)){
          if (value <= products.length && value >0){
            return true
          }
        } 
        return false
      }
    }]).then(data =>{
      console.log(data)
    })

  })
}