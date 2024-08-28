const Product = require("../models/product-model");
// const Brand = require("../models/brand-model");
// const Category = require("../models/category-model");
// const TechnicalName = require("../models/technicalName-model");
// const Label = require("../models/label-model");
// const BoxSize = require("../models/boxSize-model");
// const Marketplace = require("../models/marketPlace-model");

module.exports.createSimpleProductController = {
  create: async (req, res) => {
    try {
      const products = Array.isArray(req.body) ? req.body : [req.body]; 

      const bulkOperations = products.map(product => ({
        insertOne: {
          document: {
            displayName: product.displayName,
            sku: product.sku,
            ean: product.ean,
            brand: product.brand_id,
            category: product.category_id,
            description: product.description,
            technicalName: product.technical_id,
            label: product.label_id,
            tax_rule: product.tax_rule,
            dimensions: {
              length: product.length,
              breadth: product.breadth,
              height: product.height,
            },
            weight: product.weight,
            boxSize: product.box_size_id,
            mrp: [{
              mktp_id: product.mktp_id,
              value: product.value
            }],
            cost: [{
              mktp_id: product.cost_id,
              value: product.value
            }]
          }
        }
      }));

      const existingProducts = await Product.find({
        sku: { $in: products.map(product => product.sku) }
      });

      if (existingProducts.length) {
        return res.status(400).json({
          error: "Some SKUs already exist",
          existingSkus: existingProducts.map(product => product.sku),
        });
      }

      const result = await Product.bulkWrite(bulkOperations);
      return res.status(201).json({
        message: `${result.insertedCount} product(s) created successfully`,
        result,
      });
    } catch (err) {
      return res.status(500).json({
        error: "Error creating product(s)",
        details: err.message,
      });
    }
  },
};


// Show All Products with Populated Fields

module.exports.showAllProductController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const products = await Product.find({})
      .populate('brand')
      .populate('category')
      .populate('technicalName')
      .populate('label')
      .populate('boxSize')
      .populate('mrp.mktp_id')
      .populate('cost.mktp_id')
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments();

    res.send({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).send(error);
  }
 
};

// Show Product by ID with Populated Fields
module.exports.showProductController_id = async (req, res) => {
  try {
    const product = await Product.findById(req.params._id)
      .populate('brand')
      .populate('category')
      .populate('technicalName')
      .populate('label')
      .populate('boxSize')
      .populate('mrp.mktp_id')
      .populate('cost.mktp_id');
      
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Show Product by SKU or ID with Populated Fields



// query request
// module.exports.showProductController = async (req, res) => {
//   try {
//     const { sku, id } = req.query;
//     let product;

//     if (sku) {
//       product = await Product.findOne({ sku: sku })
//         .populate('brand')
//         .populate('category')
//         .populate('technicalName')
//         .populate('label')
//         .populate('boxSize')
//         .populate('mrp.mktp_id')
//         .populate('cost.mktp_id');
//     }
//     else if (id) {
//       product = await Product.findOne({ _id: id })
//         .populate('brand')
//         .populate('category')
//         .populate('technicalName')
//         .populate('label')
//         .populate('boxSize')
//         .populate('mrp.mktp_id')
//         .populate('cost.mktp_id');
//     }
//     else {
//       return res.status(400).send('Please provide either an ID or a SKU');
//     }

//     if (!product) return res.status(404).send('Product not found');
//     res.send(product);
//   } catch (err) {
//     res.status(500).send('Server error');
//   }
// };





module.exports.updateProductController = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({ error: "Request body is missing" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params._id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).send({ error: "Product not found" });
    }
    return res.status(200).send(updatedProduct);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};



module.exports.productSearchController = async(req,res) =>{
  console.log(req.params.key)
  let data = await Product.find(
    {
      "$or":[
        {"displayName":{$regex:req.params.key}},
        
        
      ]
    }
  )
  res.send(data)

}


 // by query request
 module.exports.showProductController = async (req, res) => {
  try {
        const { sku, brand, category, displayName,description } = req.query;
    
        // Building the query object
        let query = {};
    
        if (sku) {
          query.sku = { $regex: sku };
        }
        if (description) {
          query.description = { $regex: description };
        }
        if (displayName) {
          query.displayName = { $regex: displayName, $options: 'i' };
        }

        let productsQuery = Product.find(query);

        if (brand) {
            productsQuery = productsQuery.populate({
                path: 'brand',
                select: 'name' // Adjust fields to include as needed
            });
        }

        if (category) {
            productsQuery = productsQuery.populate({
                path: 'category',
                select: 'name' // Adjust fields to include as needed
            });
        }

        // const products = await Product.find(query);
        const products = await productsQuery.exec();

        res.status(200).json(products)

  } catch (err) {
      res.status(500).send('Server error');
  }
  }






  module.exports.updateProductMarketplaces = async (req, res) => {
    try {
      const { productId } = req.params;
      const { mrp, cost } = req.body;
  
      // Validate input
      if (!Array.isArray(mrp) || !Array.isArray(cost)) {
        return res.status(400).json({ error: 'MRP and Cost must be arrays' });
      }
  
      // Find the product by its ID
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Process MRP entries
      if (mrp) {
        mrp.forEach(entry => {
          if (!entry.mktp_id) {
            return res.status(400).json({ error: 'mktp_id is required for MRP entry' });
          }
          const existingMrp = product.mrp.find(m => m.mktp_id && m.mktp_id.toString() === entry.mktp_id.toString());
          if (existingMrp) {
            existingMrp.value = entry.value; // Update existing entry
          } else {
            product.mrp.push(entry); // Add new entry
          }
        });
      }
  
      // Process Cost entries
      if (cost) {
        cost.forEach(entry => {
          if (!entry.mktp_id) {
            return res.status(400).json({ error: 'mktp_id is required for Cost entry' });
          }
          const existingCost = product.cost.find(c => c.mktp_id && c.mktp_id.toString() === entry.mktp_id.toString());
          if (existingCost) {
            existingCost.value = entry.value; // Update existing entry
          } else {
            product.cost.push(entry); // Add new entry
          }
        });
      }
  
      // Save the updated product document
      const updatedProduct = await product.save();
  
      res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Error updating product', details: error.message });
    }
  };