const express = require('express');
const bodyParser = require('body-parser');
const shopifyRouter = require('./routes/shopify-router')


// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', shopifyRouter);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });