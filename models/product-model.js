const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  displayName: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  ean: { type: String },
  description:{type: String},
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  technicalName: { type: mongoose.Schema.Types.ObjectId, ref: 'TechnicalName' },
  label: { type: mongoose.Schema.Types.ObjectId, ref: 'Label' },
  tax_rule: { type: String },
  dimensions: {
    length: { type: Number },
    breadth: { type: Number },
    height: { type: Number }
  },
  weight: { type: Number },
  boxSize: { type: mongoose.Schema.Types.ObjectId, ref: 'BoxSize' },
  mrp:[ {
    mktp_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Marketplace' },
    value: { type: Number }
  }],
  cost:[ {
    mktp_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Marketplace' },
    value: { type: Number }
  }]
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
