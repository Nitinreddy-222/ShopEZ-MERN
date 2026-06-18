import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const heroImage = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        if (data.success) {
          // just taking the first 4 for featured
          setFeatured(data.data.slice(0, 4));
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-banner text-center p-5 bg-primary text-white rounded shadow-sm mb-5">
        <div className="row align-items-center">
          <div className="col-md-6 text-start">
            <h1 className="display-4 fw-bold">Welcome to ShopEZ</h1>
            <p className="lead">The best electronics at unbeatable prices.</p>
            <Link to="/products" className="btn btn-light btn-lg text-primary fw-bold mt-3">Shop Now</Link>
          </div>
          <div className="col-md-6 mt-4 mt-md-0">
            {/* Fallback to online image if local asset is missing */}
            <img 
              src={heroImage} 
              alt="Hero" 
              className="img-fluid rounded shadow" 
            />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <h2 className="mb-4 text-center">Shop by Category</h2>
      <div className="row text-center mb-5">
        {['Smartphones', 'Laptops', 'Smart Watches', 'Headphones'].map(cat => (
          <div key={cat} className="col-md-3 col-6 mb-3">
            <div className="card py-4 bg-light">
              <h5 className="card-title text-primary m-0">{cat}</h5>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Products */}
      <h2 className="mb-4 text-center">Featured Electronics</h2>
      {loading ? (
        <div className="text-center"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="row g-4 mb-5">
          {featured.map(product => (
            <div key={product._id} className="col-12 col-md-6 col-lg-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
