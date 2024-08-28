// require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const shopifyRouter = require('./routes/shopify-router')
const orderRouter = require('./routes/order-router')
const productRouter = require('./routes/product-router')

// const db = require('./config/mongoose-connection')
// require('dotenv').config();



// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/', shopifyRouter);
// app.use('/order', orderRouter);
// app.use('/product', productRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });