import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  
  // Product Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get('/api/users', config),
          axios.get('/api/products'),
          axios.get('/api/orders', config)
        ]);
        
        setStats({
  users: usersRes.data.data.length,
  products: productsRes.data.data.length,
  orders: ordersRes.data.data.length
});

setOrders(ordersRes.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [navigate]);

  const addProductHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('/api/products', {
        title, price, image, category, description, stock
      }, config);
      alert('Product Added Successfully');
      // Reset form
      setTitle(''); setPrice(''); setImage(''); setCategory(''); setDescription(''); setStock('');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="row">
      <div className="col-md-3 mb-4">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white fw-bold">
            Admin Panel
          </div>
          <ul className="list-group list-group-flush">
            <li 
              className={`list-group-item list-group-item-action cursor-pointer ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
              style={{ cursor: 'pointer' }}
            >
              Overview
            </li>
            <li 
              className={`list-group-item list-group-item-action cursor-pointer ${activeTab === 'add-product' ? 'active' : ''}`}
              onClick={() => setActiveTab('add-product')}
              style={{ cursor: 'pointer' }}
            >
              Add Product
            </li>
          </ul>
          <li
  className={`list-group-item list-group-item-action ${
    activeTab === 'orders' ? 'active' : ''
  }`}
  onClick={() => setActiveTab('orders')}
  style={{ cursor: 'pointer' }}
>
  View Orders
</li>
        </div>
      </div>
      
      <div className="col-md-9">
        <div className="card shadow-sm p-4">
          {activeTab === 'overview' && (
            <div>
              <h3 className="mb-4">Dashboard Overview</h3>
              <div className="row text-center">
                <div className="col-md-4 mb-3">
                  <div className="p-4 bg-light rounded shadow-sm border-start border-primary border-4">
                    <h1 className="text-primary fw-bold">{stats.products}</h1>
                    <h5 className="text-muted">Total Products</h5>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="p-4 bg-light rounded shadow-sm border-start border-success border-4">
                    <h1 className="text-success fw-bold">{stats.orders}</h1>
                    <h5 className="text-muted">Total Orders</h5>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="p-4 bg-light rounded shadow-sm border-start border-info border-4">
                    <h1 className="text-info fw-bold">{stats.users}</h1>
                    <h5 className="text-muted">Total Users</h5>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'add-product' && (
            <div>
              <h3 className="mb-4">Add New Product</h3>
              <form onSubmit={addProductHandler}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Price</label>
                    <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Category</label>
                    <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Stock</label>
                    <input type="number" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} required />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Image URL</label>
                    <input type="text" className="form-control" value={image} onChange={(e) => setImage(e.target.value)} required />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Add Product</button>
              </form>
            </div>
          )}
          {activeTab === 'orders' && (
  <div>
    <h3 className="mb-4">Orders</h3>

    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Total Amount</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order) => (
          <tr key={order._id}>
            <td>{order._id.slice(-6)}</td>
            <td>{order.user?.name || 'Unknown'}</td>
            <td>₹{order.totalAmount}</td>
            <td>{order.orderStatus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
