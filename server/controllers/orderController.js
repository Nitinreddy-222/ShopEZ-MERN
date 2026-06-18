const Order = require('../models/orderModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res) => {
  try {
    const {
      products,
      shippingAddress,
      paymentMethod,
      totalAmount,
    } = req.body;

    if (products && products.length === 0) {
      res.status(400).json({ success: false, message: 'No order items' });
      return;
    } else {
      const order = new Order({
        user: req.user._id,
        products,
        shippingAddress,
        paymentMethod,
        totalAmount,
      });

      const createdOrder = await order.save();

      res.status(201).json({ success: true, message: 'Order created', data: createdOrder });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      res.json({ success: true, message: 'Order fetched', data: order });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json({ success: true, message: 'Orders fetched', data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json({ success: true, message: 'All orders fetched', data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
  
      if (order) {
        order.orderStatus = req.body.status || order.orderStatus;
        const updatedOrder = await order.save();
        res.json({ success: true, message: 'Order status updated', data: updatedOrder });
      } else {
        res.status(404).json({ success: false, message: 'Order not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};
