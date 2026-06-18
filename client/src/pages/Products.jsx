import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        if (data.success) {
          setProducts(data.data);
          setFilteredProducts(data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (category) {
      result = result.filter(p => p.category === category);
    }

    if (sortOrder === 'low-to-high') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-to-low') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [searchTerm, category, sortOrder, products]);

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div>
      <h2 className="mb-4">All Electronics</h2>

      <div className="row mb-4 bg-white p-3 rounded shadow-sm mx-0">
        <div className="col-md-4 mb-2 mb-md-0">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2 mb-md-0">
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="">Sort by Price</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="row g-4">
          {filteredProducts.length === 0 ? (
            <div className="col-12 text-center my-5">
              <h4>No products found</h4>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product._id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
