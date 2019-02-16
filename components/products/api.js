const express = require('express');
const multer = require('multer');

const products = require('./service');
const Auth = require('../../middleware/auth');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/images/products');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const productRouter = express.Router();

productRouter.get('/', products.getProducts);
productRouter.get('/:id', products.getOneProduct);
productRouter.post('/', Auth.authorizeRequest('admin'), upload.single('image'), products.createProduct);
productRouter.put('/:id', Auth.authorizeRequest('admin'), upload.single('image'), products.updateProduct);
productRouter.delete('/:id', Auth.authorizeRequest('admin'), products.deleteProduct);

module.exports = productRouter;
