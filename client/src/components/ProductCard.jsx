import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="card h-100 shadow-sm">
      <img 
        src={product.image || 'https://via.placeholder.com/300x200'} 
        className="card-img-top p-3" 
        alt={product.title} 
        style={{ height: '200px', objectFit: 'contain' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate" title={product.title}>{product.title}</h5>
        <div className="mb-2">
          <span className="badge bg-secondary">{product.category}</span>
        </div>
        <h6 className="card-subtitle mb-2 text-primary fw-bold">₹{product.price}</h6>
        <p className="card-text text-muted small text-truncate">{product.description}</p>
        <div className="mt-auto">
          <Link to={`/product/${product._id}`} className="btn btn-outline-primary w-100">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
