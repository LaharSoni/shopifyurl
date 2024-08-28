const express = require('express');
const router = express.Router();
// const auth = require('../middlewares/auth-middleware'); 

const {createSimpleProductController,showAllProductController,showProductController,showProductController_id,updateProductController,updateProductMarketplaces} = require('../controllers/product-controller');


router.post('/createSimpleProduct',createSimpleProductController.create);
router.get('/showAllProduct',showAllProductController);
router.get('/showAllProduct/:_id',showProductController_id);
router.get('/showProduct',showProductController);
router.put('/updateProduct/:_id',updateProductController);

router.put('/:productId/marketplaces', updateProductMarketplaces);

module.exports = router;