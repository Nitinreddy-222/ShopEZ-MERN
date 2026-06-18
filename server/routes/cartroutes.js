const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
} = require('../controllers/cartcontroller');
const { protect } = require('../controllers/usercontroller');

router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);

router.route('/:productId')
  .put(protect, updateCartQuantity)
  .delete(protect, removeFromCart);

module.exports = router;
