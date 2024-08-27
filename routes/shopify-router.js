const express = require('express');
const router = express.Router();

const { shopifyorder } = require('../controllers/shopify-controller');


router.post('/shopify/order',shopifyorder);


module.exports = router;