import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        if (data.success) {
          setProduct(data.data);
        } else {
          setError(data.message);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login?redirect=/cart');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post('/api/cart', { productId: product._id, quantity: qty }, config);
      navigate('/cart');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="row mt-4">
      <div className="col-md-6 mb-4">
        <img 
          src={product.image} 
          alt={product.title} 
          className="img-fluid rounded shadow-sm w-100" 
          style={{ maxHeight: '500px', objectFit: 'contain', backgroundColor: '#fff' }} 
        />
      </div>
      <div className="col-md-6">
        <h2 className="fw-bold">{product.title}</h2>
        <span className="badge bg-primary mb-3">{product.category}</span>
        <h3 className="text-danger fw-bold">₹{product.price}</h3>
        <p className="mt-4">{product.description}</p>
        
        <div className="my-3">
          <span className={product.stock > 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </span>
        </div>

        {product.stock > 0 && (
          <div className="d-flex align-items-center mt-4">
            <label className="me-3 fw-bold">Quantity:</label>
            <select 
              className="form-select w-auto me-3" 
              value={qty} 
              onChange={(e) => setQty(Number(e.target.value))}
            >
              {[...Array(product.stock).keys()].map(x => (
                <option key={x + 1} value={x + 1}>{x + 1}</option>
              ))}
            </select>
            <button className="btn btn-primary btn-lg" onClick={addToCartHandler}>
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
