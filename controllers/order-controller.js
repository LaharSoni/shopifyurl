const Order = require('../models/order-model');
// const Inventory = require('../models/inventory-model');

// Create a new order
// exports.createOrder = async (req, res) => {
//     try {
//         const newOrder = new Order(req.body);
//         const savedOrder = await newOrder.save();
//         res.status(201).json(savedOrder);
//     } catch (err) {
//         res.status(500).json({ error: "Error creating order", details: err.message });
//     }
// };

//Mind :- there are two status of an order - "complete" or "pending"
exports.createOrder = async (req, res) => {
    try {
        const { items } = req.body;
        let isPending = false;

        // Check inventory availability for each item in the order based on the total field
        for (let item of items) {
            // Find the inventory for the product
            const inventory = await Inventory.findOne({ product_id: item.product_id });

            if (!inventory || inventory.total < item.qty) {
                // If the total inventory is less than the ordered quantity, set order to pending
                isPending = true;
                break;
            }
        }

        // Set the order status based on the inventory check
        const newOrder = new Order({
            ...req.body,
            order_status: isPending ? 'Pending' : 'Complete'
        });

        // Save the order
        const savedOrder = await newOrder.save();

        // If the order is complete, deduct the stock from the total field in inventory
        if (!isPending) {
            for (let item of items) {
                const inventory = await Inventory.findOne({ product_id: item.product_id });

                if (inventory) {
                    inventory.total -= item.qty;

                    // Save the updated inventory
                    await inventory.save();
                }
            }
        }

        res.status(201).json(savedOrder);

    } catch (err) {
        res.status(500).json({ error: "Error creating order", details: err.message });
    }
};








// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: "Error fetching orders", details: err.message });
    }
};

// Get an order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ error: "Error fetching order", details: err.message });
    }
};

// Update an order by ID
exports.updateOrderById = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json({ error: "Error updating order", details: err.message });
    }
};

// Delete an order by ID
exports.deleteOrderById = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: "Error deleting order", details: err.message });
    }
};


// Get all pending orders
exports.getPendingOrders = async (req, res) => {
    try {
        const pendingOrders = await Order.find({ order_status: 'Pending' });
        res.status(200).json(pendingOrders);
    } catch (err) {
        res.status(500).json({ error: "Error fetching pending orders", details: err.message });
    }
};