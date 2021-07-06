const express = require('express');
const Product = require('./products');
const Users = require('./users');
let users = Users.users;
const products = Product.products;
const app = express();
const PORT = 8080;
app.use(express.json());
let orders = [];

app.get('/',(req,res)=>{
    res.send('Home');
})

app.get('/fetchProducts',(req,res)=>{
    res.send(products);
})


app.get('/fetchProducts/:category',(req,res)=>{
    let category = req.params.category;
    //console.log(category);
    let currentCategoryProducts = [];
    products.forEach(element => {
        if(element.category == category)currentCategoryProducts.push(element);
    });
    if(currentCategoryProducts.length == 0)res.status(404).send('No Category found');
    else res.send(currentCategoryProducts);
})

app.get('/fetchProductDetails/:pid',(req,res)=>{
    let pid = req.params.pid;
    let obj = {};
    let flag = false;
    products.forEach(element => {
        if(element.id == pid){
            obj = element;
            flag=true;
        }
    });
    if(flag)res.send(obj);
    else res.status(404).send('Id not found');
})

app.post('/placeOrder',(req,res)=>{
    let uId = parseInt(req.body.uId);
    let pId = req.body.pId;
    let quantity = req.body.quantity;

    console.log(uId,pId,quantity);
    let flagId = false;
    
    users.forEach(element => {
        if(element.id == uId)flagId=true;
    });

    if(flagId == false)res.status(400).send('Invalid User');
    
    let price=0;
    products.forEach(element => {
        if(element.id == pId)price = element.price;
    });
    if(price == 0)res.status(400).send('Invalid Product');

    let currentDate = new Date();
    let oId = Date.now();
    let tAmount = price*quantity;
    let currentOrder = {
        id:oId,
        orderDate:currentDate,
        userId:uId,
        ProductId:pId,
        totalAmount:tAmount
    }
    orders.push(currentOrder);
    res.send(currentOrder);

})

app.get('/fetchAllOrders/:fromDate/:toDate',(req,res)=>{
    let fromDate = req.params.fromDate;
    let toDate = req.params.toDate;

    let firstDate = new Date(fromDate).getTime();
    let endDate = new Date(toDate).getTime();
    let ar =[];
    orders.forEach(element => {
        if(element.Date>=firstDate && element.Date<=endDate){
            ar.push(element);
        }
    });
    res.send(ar);
})

app.get('/fetchAllOrders',(req,res)=>{
    if(orders.length==0)res.send('No orders yet');
    else res.send(orders);
})

app.get('/fetchOrderDetails/:ordId',(req,res)=>{
    let flag = false;
    let obj = {};
    orders.forEach(element => {
        if(element.id == ordId){
            obj = element;
        }
    });
    if(flag)res.send(obj);
    else res.status(404).send('Id Not found');
})

app.listen(PORT,()=>{
    console.log(`Listen on port ${PORT}`);
})