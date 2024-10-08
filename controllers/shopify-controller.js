// // const express = require("express");
// // const router = express.Router();

// // module.exports.shopifyorder = async (req, res) => {
// //     const shopify = req.body;
// //     console.log(shopify)
// // }




// // const express = require("express");
// // const router = express.Router();
// // const auth = require("../middlewares/auth-middleware");
// // const { model } = require("mongoose");
// const Product = require('../models/product-model')

// const Order = require('../models/order-model');


// // async function mapProductIdsToOrders(Order) {
// //   // Fetch all products from the database
// //   const products = await Product.find({});

// //   // Create a lookup map for quick SKU to product ID mapping
// //   const productSkuMap = {};
// //   products.forEach(product => {
// //     productSkuMap[product.sku] = product._id; // Assuming the product model has 'sku' and '_id' fields
// //   });

// //   // Iterate over each order
// //   Order.forEach(order => {
// //     // Iterate over each item in the order
// //     order.items.forEach(item => {
// //       const productId = productSkuMap[item.sku];
// //       if (productId) {
// //         item.productId = productId; // Add productId to the item
// //       } else {
// //         item.productId = null; // Handle case where SKU is not found
// //         console.warn(`Product with SKU "${item.sku}" not found for order "${order._id}".`);
// //       }
// //     });
// //   });

// //   return Order;
// // }
// module.exports.shopifyorder = async (req, res) => {
//     const shopify = req.body;
//     console.log(shopify);
//     // console.log(shopify.line_items.length);

//     async function mapProductIdsToOrders(items) {
//       const products = await Product.find({});
//       const productSkuMap = {};
//       products.forEach(product => {
//         productSkuMap[product.sku] = product._id;
//       });
  
//       items.forEach(item => {
//         const productId = productSkuMap[item.sku];
//         if (productId) {
//           item.productId = productId;
//         } else {
//           item.productId = null;
//           console.warn(`Product with SKU "${item.sku}" not found.`);
//         }
//       });
  
//       return items;
//     }


//   try {
//     // Capture and log the webhook payload

//     const shopifydata = {
//             date: shopify.date,
//             customer: {
//               name: shopify.customer.first_name + shopify.customer.last_name|| "",
//               phone: shopify.customer.phone || "",
//               billing_addr: shopify.billing_address.address1 + shopify.billing_address.city + shopify.billing_address.province + shopify.billing_address.country  || "",
//             },
//             payment_mode: shopify.payment_gateway_names || "",
//             // item: [
//             //   {
//             //     qty: shopify.line_items[0].current_quantity || "",
//             //     product_id: await mapProductIdsToOrders(shopify.line_items) || "",

//             //     amount: shopify.line_items[0].price_set.shop_money.amount || "",
//             //   },
//             // ],

//             item: await mapProductIdsToOrders(shopify.line_items),

//             total_amt: shopify.current_subtotal_price_set.shop_money.amount || "",
//             shipping_addr: shopify.shipping_address.address1 + shopify.shipping_address.city + shopify.shipping_address.province + shopify.shipping_address.country || "",
//             order_status: shopify.order_status_url || "",
        
//       };
//     console.log("Webhook received:", shopifydata);

//         console.log("this is our data",shopifydata)
//     // await shopifydata.save();
//     // await shopifyorder(shopifydata);

//     // Send a 200 OK response to Shopify
//     res.status(200).send("Order received and saved");
//   } catch (error) {
//     console.error("Error saving order:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };




  





const express = require("express");
const router = express.Router();
const Product = require('../models/product-model');
const Order = require('../models/order-model');
// Function to map product SKUs to product IDs in the order items
async function mapProductIdsToOrders(items) {
  // Fetch all products from the database
  const products = await Product.find({});
  // Create a lookup map for quick SKU to product ID mapping
  const productSkuMap = {};
  products.forEach(product => {
    productSkuMap[product.sku] = product._id; // Assuming the product model has 'sku' and '_id' fields
  });
  // Iterate over each item in the order
  items.forEach(item => {
    const productId = productSkuMap[item.sku];
    if (productId) {
      item.productId = productId; // Add productId to the item
    } else {
      item.productId = null; // Handle case where SKU is not found
      console.warn(`Product with SKU "${item.sku}" not found.`);
    }
  });
  return items;
}
module.exports.shopifyorder = async (req, res) => {
  const shopify = req.body;
  console.log(shopify);
  try {
    // Capture and log the webhook payload
    const shopifydata = {
      date: shopify.created_at,
      customer: {
        name: `${shopify.customer.first_name} ${shopify.customer.last_name}`.trim() || "",
        phone: shopify.customer.phone || "",
        billing_addr: `${shopify.billing_address.address1}, ${shopify.billing_address.city}, ${shopify.billing_address.province}, ${shopify.billing_address.country}` || "",
      },
      payment_mode: shopify.payment_gateway_names.join(", ") || "",
      // items: await mapProductIdsToOrders(shopify.line_items), // Map the line items

      item: await mapProductIdsToOrders(shopify.line_items).map(item => ({
        qty: item.current_quantity || "",
        product_id: item.productId || "",
        amount: item.price_set.shop_money.amount || "",
      })),

      total_amt: shopify.current_subtotal_price_set.shop_money.amount || "",
      shipping_addr: `${shopify.shipping_address.address1}, ${shopify.shipping_address.city}, ${shopify.shipping_address.province}, ${shopify.shipping_address.country}` || "",
      order_status: shopify.order_status_url || "",
    };
    console.log("Webhook received:", shopifydata);
    // You may want to save shopifydata into your Order model here
    // const newOrder = new Order(shopifydata);
    // await newOrder.save();
    res.status(200).send("Order received and saved");
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).send("Internal Server Error");
  }
};