const Cart = require('../models/cartmodel');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, products: [] });
    }
    
    res.json({ success: true, message: 'Cart fetched', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, products: [] });
    }

    const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    
    // Populate before sending response
    await cart.populate('products.product');

    res.json({ success: true, message: 'Added to cart', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex((p) => p.product.toString() === req.params.productId);

    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      await cart.populate('products.product');
      res.json({ success: true, message: 'Cart updated', data: cart });
    } else {
      res.status(404).json({ success: false, message: 'Product not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.products = cart.products.filter((p) => p.product.toString() !== req.params.productId);
    
    await cart.save();
    await cart.populate('products.product');

    res.json({ success: true, message: 'Removed from cart', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear cart (used after checkout)
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user._id });
      if(cart) {
          cart.products = [];
          await cart.save();
      }
      res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};
