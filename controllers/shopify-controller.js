const express = require("express");
const router = express.Router();

module.exports.shopifyorder = async (req, res) => {
    const shopify = req.body;
    console.log(shopify)
}