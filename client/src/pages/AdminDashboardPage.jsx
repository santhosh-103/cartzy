import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Upload,
  Search,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  X,
  ExternalLink,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'users'
  const { addToast } = useToast();

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('All');

  // Product Modal State (Add / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    discount: '',
    countInStock: 10,
    badge: '',
    description: '',
    featuresText: '',
    image: '',
    isPrime: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, userRes] = await Promise.all([
        api.get('/api/products?limit=100'),
        api.get('/api/orders'),
        api.get('/api/users'),
      ]);
      setProducts(prodRes.data.products || []);
      setOrders(orderRes.data || []);
      setUsers(userRes.data || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      addToast(err.response?.data?.message || 'Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formattedPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // Image Upload handler (Multer)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const { data } = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProductForm((prev) => ({ ...prev, image: data.imageUrl }));
      addToast('Image uploaded successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Open modal for Create
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      brand: 'Cartzy Essentials',
      category: 'Electronics',
      price: '',
      originalPrice: '',
      discount: '',
      countInStock: 20,
      badge: '',
      description: '',
      featuresText: '',
      image: '',
      isPrime: true,
    });
    setIsProductModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditProduct = (prod) => {
    setEditingProductId(prod._id);
    setProductForm({
      name: prod.name,
      brand: prod.brand || '',
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || '',
      discount: prod.discount || '',
      countInStock: prod.countInStock,
      badge: prod.badge || '',
      description: prod.description,
      featuresText: prod.features?.join('\n') || '',
      image: prod.image,
      isPrime: prod.isPrime !== undefined ? prod.isPrime : true,
    });
    setIsProductModalOpen(true);
  };

  // Submit Product Form
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (!productForm.name || !productForm.price || !productForm.image || !productForm.description) {
      addToast('Please fill in product name, price, description and image', 'error');
      return;
    }

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice || productForm.price),
      discount: Number(productForm.discount || 0),
      countInStock: Number(productForm.countInStock),
      features: productForm.featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
    };

    try {
      if (editingProductId) {
        await api.put(`/api/products/${editingProductId}`, payload);
        addToast('Product updated successfully!', 'success');
      } else {
        await api.post('/api/products', payload);
        addToast('New product added to inventory!', 'success');
      }
      setIsProductModalOpen(false);
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Error saving product', 'error');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/api/products/${id}`);
      addToast('Product deleted from catalog', 'info');
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Error deleting product', 'error');
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      addToast(`Order status updated to ${newStatus}`, 'success');
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update order status', 'error');
    }
  };

  // Metrics calculations
  const totalRevenue = orders.reduce((sum, o) => (o.isPaid ? sum + o.totalPrice : sum), 0);
  const deliveredOrdersCount = orders.filter((o) => o.orderStatus === 'Delivered').length;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders =
    orderFilter === 'All'
      ? orders
      : orders.filter((o) => o.orderStatus.toLowerCase() === orderFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-[1500px] mx-auto">
        
        {/* Admin Header */}
        <div className="bg-[#131921] text-white p-6 rounded-xl shadow-md mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight">
                Cart<span className="text-orange-400">zy</span> <span className="text-sm font-semibold text-slate-300">Seller Central</span>
              </span>
              <span className="bg-orange-500/20 text-orange-300 border border-orange-400/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Store management, live inventory tracking, orders fulfillment, and customer directory.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold text-xs rounded-lg shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Revenue
              </p>
              <h3 className="text-2xl font-bold text-gray-950 mt-1">
                {formattedPrice(totalRevenue)}
              </h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Based on paid orders
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Orders
              </p>
              <h3 className="text-2xl font-bold text-gray-950 mt-1">{orders.length}</h3>
              <p className="text-[11px] text-blue-600 font-semibold mt-1">
                {deliveredOrdersCount} delivered successfully
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Products in Catalog
              </p>
              <h3 className="text-2xl font-bold text-gray-950 mt-1">{products.length}</h3>
              <p className="text-[11px] text-amber-600 font-semibold mt-1">Active for customers</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Registered Users
              </p>
              <h3 className="text-2xl font-bold text-gray-950 mt-1">{users.length}</h3>
              <p className="text-[11px] text-purple-600 font-semibold mt-1">Customers & Admins</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 flex items-center gap-6 px-6 bg-gray-50/50">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'border-amber-500 text-amber-800'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products Management ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'border-amber-500 text-amber-800'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders Management ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'border-amber-500 text-amber-800'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Users Directory ({users.length})</span>
            </button>
          </div>

          {/* TAB 1: Products */}
          {activeTab === 'products' && (
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products by title or category..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="w-full sm:w-auto px-4 py-2 bg-amber-400 hover:bg-amber-500 font-bold text-xs text-gray-950 rounded-lg border border-amber-500 transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 uppercase font-bold text-[10px] border-b border-gray-200">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Badge</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50/80 transition">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 object-contain border rounded p-1 bg-white flex-shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-gray-900 line-clamp-1 max-w-xs">
                                {p.name}
                              </p>
                              <p className="text-[11px] text-gray-500">{p.brand || 'Cartzy'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-gray-700 font-medium">{p.category}</td>
                        <td className="p-3 font-bold text-gray-950">
                          {formattedPrice(p.price)}
                          {p.originalPrice > p.price && (
                            <span className="block text-[10px] text-gray-400 line-through">
                              {formattedPrice(p.originalPrice)}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span
                            className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                              p.countInStock > 10
                                ? 'bg-emerald-50 text-emerald-700'
                                : p.countInStock > 0
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {p.countInStock > 0 ? `${p.countInStock} in stock` : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-3">
                          {p.badge ? (
                            <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-300">
                              {p.badge}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Edit product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id, p.name)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Orders */}
          {activeTab === 'orders' && (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 text-xs font-semibold">
                {['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-full transition ${
                      orderFilter === st
                        ? 'bg-amber-500 text-gray-950 font-bold shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 uppercase font-bold text-[10px] border-b border-gray-200">
                    <tr>
                      <th className="p-3">Order ID & Date</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-gray-50/80 transition">
                        <td className="p-3">
                          <p className="font-bold text-gray-900">#{ord._id.slice(-8)}</p>
                          <p className="text-[11px] text-gray-500">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-gray-900">{ord.shippingAddress.fullName}</p>
                          <p className="text-[11px] text-gray-500">{ord.shippingAddress.city}, {ord.shippingAddress.state}</p>
                          <p className="text-[11px] text-gray-500">Ph: {ord.shippingAddress.phone}</p>
                        </td>
                        <td className="p-3">
                          <span className="font-medium text-gray-800">
                            {ord.orderItems.length} {ord.orderItems.length === 1 ? 'item' : 'items'}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-gray-950">
                          {formattedPrice(ord.totalPrice)}
                        </td>
                        <td className="p-3">
                          <span className="text-gray-700">{ord.paymentMethod}</span>
                          <span
                            className={`block text-[10px] font-bold ${
                              ord.isPaid ? 'text-emerald-600' : 'text-amber-600'
                            }`}
                          >
                            {ord.isPaid ? 'Paid' : 'Unpaid (COD)'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.orderStatus === 'Processing'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.orderStatus === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                            className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Users */}
          {activeTab === 'users' && (
            <div className="p-6">
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 uppercase font-bold text-[10px] border-b border-gray-200">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50/80 transition">
                        <td className="p-3 font-semibold text-gray-900">{u.name}</td>
                        <td className="p-3 text-gray-700">{u.email}</td>
                        <td className="p-3 text-gray-500">{u.phone || 'N/A'}</td>
                        <td className="p-3">
                          {u.isAdmin ? (
                            <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px] border border-amber-300">
                              Admin
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                              Customer
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-gray-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#131921] text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingProductId ? 'Edit Product' : 'Add New Product to Cartzy'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleProductSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-xs focus:ring-1 focus:ring-amber-500"
                    placeholder="e.g. Apple iPad Air 11-inch (M2)"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-xs focus:ring-1 focus:ring-amber-500"
                    placeholder="e.g. Apple, Samsung, Sony"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-xs focus:ring-1 focus:ring-amber-500 bg-white"
                  >
                    <option value="Mobiles & Tablets">Mobiles & Tablets</option>
                    <option value="Laptops & Computers">Laptops & Computers</option>
                    <option value="Audio & Headphones">Audio & Headphones</option>
                    <option value="Wearables & Smartwatches">Wearables & Smartwatches</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Fashion & Footwear">Fashion & Footwear</option>
                    <option value="Books">Books</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-xs focus:ring-1 focus:ring-amber-500"
                    placeholder="e.g. 59999"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Original Price (M.R.P.)</label>
                  <input
                    type="number"
                    min={0}
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-xs focus:ring-1 focus:ring-amber-500"
                    placeholder="e.g. 69999"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.countInStock}
                    onChange={(e) => setProductForm({ ...productForm, countInStock: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Badge (Optional)</label>
                  <select
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-xs bg-white"
                  >
                    <option value="">No Badge</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Deal of the Day">Deal of the Day</option>
                    <option value="Amazon's Choice">Amazon's Choice</option>
                    <option value="Limited Time Deal">Limited Time Deal</option>
                  </select>
                </div>
              </div>

              {/* Image Upload & URL input */}
              <div className="border border-gray-200 p-4 rounded-lg bg-gray-50 space-y-3">
                <label className="block font-bold text-gray-800">Product Image *</label>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-24 h-24 border rounded-lg bg-white p-2 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {productForm.image ? (
                      <img
                        src={productForm.image}
                        alt="preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400 text-center">No Image</span>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div>
                      <span className="text-[11px] font-semibold text-gray-600 block mb-1">
                        Option A: Upload Image File (Multer)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-xs text-gray-600 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
                      />
                      {uploadingImage && (
                        <span className="text-xs text-amber-600 font-semibold ml-2">Uploading...</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-gray-600 block mb-1">
                        Option B: Or Enter Image URL
                      </span>
                      <input
                        type="text"
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded text-xs bg-white focus:ring-1 focus:ring-amber-500"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Description *</label>
                <textarea
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-xs focus:ring-1 focus:ring-amber-500"
                  placeholder="Detailed product specifications and overview..."
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Bullet Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={productForm.featuresText}
                  onChange={(e) => setProductForm({ ...productForm, featuresText: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-xs focus:ring-1 focus:ring-amber-500"
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border rounded-md font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-400 hover:bg-amber-500 font-bold rounded-md text-gray-950 border border-amber-500 shadow-sm"
                >
                  {editingProductId ? 'Update Product' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
