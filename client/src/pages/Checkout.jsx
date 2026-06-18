import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        navigate('/login');
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/cart', config);
        if (data.success && data.data) {
          setCartItems(data.data.products);
          const total = data.data.products.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
          setTotalPrice(total);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, [navigate]);

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const orderData = {
        products: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: address,
        paymentMethod,
        totalAmount: totalPrice
      };

      const { data } = await axios.post('/api/orders', orderData, config);
      if (data.success) {
        setSuccessMsg('Order Placed Successfully!');
        // Clear cart
        await axios.delete('/api/cart', config);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <h2 className="mb-4 text-center">Checkout</h2>
        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h4 className="card-title border-bottom pb-2">Shipping & Payment</h4>
                <form onSubmit={placeOrderHandler}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Shipping Address</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      required 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Payment Method</label>
                    <select 
                      className="form-select" 
                      value={paymentMethod} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="PayPal">PayPal</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Cash on Delivery">Cash on Delivery</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 btn-lg mt-3" disabled={cartItems.length === 0}>
                    Place Order
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h4 className="card-title border-bottom pb-2">Order Summary</h4>
                <ul className="list-group list-group-flush mb-3">
                  {cartItems.map((item, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between lh-sm">
                      <div>
                        <h6 className="my-0 text-truncate" style={{ maxWidth: '200px' }}>{item.product.title}</h6>
                        <small className="text-muted">Qty: {item.quantity}</small>
                      </div>
                      <span className="text-muted">₹{item.product.price * item.quantity}</span>
                    </li>
                  ))}
                  <li className="list-group-item d-flex justify-content-between bg-light">
                    <div className="text-primary fw-bold">
                      <h5 className="my-0">Total (INR)</h5>
                    </div>
                    <span className="text-primary fw-bold">₹{totalPrice}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
