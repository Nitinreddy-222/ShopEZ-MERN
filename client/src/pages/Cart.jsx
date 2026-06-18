import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/cart', config);
      if (data.success && data.data) {
        setCartItems(data.data.products);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (productId, newQty) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/cart/${productId}`, { quantity: newQty }, config);
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromCart = async (productId) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`/api/cart/${productId}`, config);
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error(error);
    }
  };

  const checkoutHandler = () => {
    navigate('/checkout');
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (!userInfo) {
    return (
      <div className="text-center mt-5">
        <h3>Please log in to view your cart</h3>
        <Link to="/login" className="btn btn-primary mt-3">Log In</Link>
      </div>
    );
  }

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  };

  return (
    <div>
      <h2 className="mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty. <Link to="/products">Go Back</Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li key={item.product._id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                  <div className="d-flex align-items-center" style={{ width: '60%' }}>
                    <img src={item.product.image} alt={item.product.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} className="me-3" />
                    <Link to={`/product/${item.product._id}`} className="text-decoration-none text-dark fw-bold text-truncate">
                      {item.product.title}
                    </Link>
                  </div>
                  <div className="text-primary fw-bold" style={{ width: '15%' }}>
                    ₹{item.product.price}
                  </div>
                  <div style={{ width: '15%' }}>
                    <select 
                      className="form-select form-select-sm" 
                      value={item.quantity} 
                      onChange={(e) => updateQty(item.product._id, Number(e.target.value))}
                    >
                      {[...Array(item.product.stock).keys()].map(x => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ width: '10%', textAlign: 'right' }}>
                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.product._id)}>
                      <i className="bi bi-trash"></i> Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title border-bottom pb-2">Order Summary</h5>
                <p className="d-flex justify-content-between mt-3">
                  <span>Items:</span>
                  <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                </p>
                <h4 className="d-flex justify-content-between text-primary fw-bold">
                  <span>Total:</span>
                  <span>₹{calculateTotal()}</span>
                </h4>
                <button 
                  className="btn btn-primary w-100 mt-3 btn-lg" 
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
