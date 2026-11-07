import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Clock, CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const { addToast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/orders/myorders');
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch user orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancellingId(orderId);
    try {
      await api.put(`/api/orders/${orderId}/cancel`);
      addToast('Order cancelled successfully', 'info');
      fetchOrders();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to cancel order', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const formattedPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <CheckCircle className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'Processing':
        return (
          <span className="flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <Truck className="w-3.5 h-3.5" /> Processing / Dispatched
          </span>
        );
      case 'Cancelled':
        return (
          <span className="flex items-center gap-1 text-red-700 bg-red-50 border border-red-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <Clock className="w-3.5 h-3.5" /> Pending Confirmation
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
          <p className="text-xs text-gray-500 mt-1">
            Check the status of current and past orders, track deliveries, or cancel items.
          </p>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">No orders found</h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
              Looks like you haven't placed an order yet. Start shopping and discover great deals!
            </p>
            <Link
              to="/"
              className="px-6 py-2 bg-amber-400 hover:bg-amber-500 font-bold text-xs rounded-full border border-amber-500 text-gray-950 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap gap-6 sm:gap-12">
                    <div>
                      <div className="text-gray-500 uppercase tracking-wider text-[10px] font-bold">
                        Order Placed
                      </div>
                      <div className="font-semibold text-gray-800">{formatDate(order.createdAt)}</div>
                    </div>

                    <div>
                      <div className="text-gray-500 uppercase tracking-wider text-[10px] font-bold">
                        Total
                      </div>
                      <div className="font-bold text-gray-900">
                        {formattedPrice(order.totalPrice)}
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-500 uppercase tracking-wider text-[10px] font-bold">
                        Ship To
                      </div>
                      <div className="font-semibold text-amazon-link hover:underline cursor-pointer">
                        {order.shippingAddress.fullName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-gray-500 uppercase tracking-wider text-[10px] font-bold">
                      Order # {order._id}
                    </div>
                    <div className="mt-1">{getStatusBadge(order.orderStatus)}</div>
                  </div>
                </div>

                {/* Items & Status Tracker */}
                <div className="p-5">
                  {/* Status Progress Indicator */}
                  {order.orderStatus !== 'Cancelled' && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs font-bold text-gray-800 mb-2">
                        Delivery Status Tracker
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[11px] relative">
                        {/* Connecting Line */}
                        <div className="absolute top-3 left-1/6 right-1/6 h-0.5 bg-gray-300 z-0"></div>

                        {/* Step 1: Pending */}
                        <div className="flex flex-col items-center relative z-10">
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-1">
                            ✓
                          </div>
                          <span className="font-bold text-gray-800">Order Confirmed</span>
                        </div>

                        {/* Step 2: Processing */}
                        <div className="flex flex-col items-center relative z-10">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mb-1 ${
                              order.orderStatus === 'Processing' || order.orderStatus === 'Delivered'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            {order.orderStatus === 'Processing' || order.orderStatus === 'Delivered'
                              ? '✓'
                              : '2'}
                          </div>
                          <span
                            className={`font-bold ${
                              order.orderStatus === 'Processing' || order.orderStatus === 'Delivered'
                                ? 'text-gray-800'
                                : 'text-gray-400'
                            }`}
                          >
                            Dispatched / Out for Delivery
                          </span>
                        </div>

                        {/* Step 3: Delivered */}
                        <div className="flex flex-col items-center relative z-10">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mb-1 ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            {order.orderStatus === 'Delivered' ? '✓' : '3'}
                          </div>
                          <span
                            className={`font-bold ${
                              order.orderStatus === 'Delivered'
                                ? 'text-emerald-700'
                                : 'text-gray-400'
                            }`}
                          >
                            Delivered
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="divide-y divide-gray-100">
                    {order.orderItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-contain border p-1 rounded bg-white flex-shrink-0"
                          />
                          <div>
                            <Link
                              to={`/product/${item.product}`}
                              className="text-xs sm:text-sm font-semibold text-gray-900 hover:text-amber-700 transition line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.qty}</p>
                            <p className="text-xs font-bold text-gray-900 mt-0.5">
                              {formattedPrice(item.price)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <Link
                            to={`/product/${item.product}`}
                            className="px-4 py-1.5 bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold rounded-full text-xs transition border border-amber-500"
                          >
                            Buy it again
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-gray-500">
                      Payment: <strong className="text-gray-800">{order.paymentMethod}</strong>
                    </span>

                    {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingId === order._id}
                        className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded font-bold transition flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
