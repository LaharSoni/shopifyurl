const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order-controller');

// Create a new order
router.post('/createOrder', orderController.createOrder);

// Get all orders
router.get('/getAllOrders', orderController.getAllOrders);

// Get an order by ID
router.get('/getOrders/:id', orderController.getOrderById);

// Update an order by ID
router.put('/updateOrders/:id', orderController.updateOrderById);

// Delete an order by ID
router.delete('/deleteOrder/:id', orderController.deleteOrderById);

// Route to get all pending orders
router.get('/pending', orderController.getPendingOrders);

module.exports = router;
