import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck, Home } from 'lucide-react';
import api from '../utils/api';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/api/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order receipt:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const formattedPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        
        {/* Success Header */}
        <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Order placed, thank you!
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Confirmation will be sent to your email address.
            </p>
            <div className="mt-2 text-xs text-gray-700">
              <span className="font-semibold text-gray-900">Order #{id}</span>
            </div>
          </div>
        </div>

        {/* Delivery Box */}
        <div className="my-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
          <Truck className="w-6 h-6 text-emerald-700 flex-shrink-0" />
          <div className="text-xs text-emerald-900">
            <div className="font-bold text-sm">Guaranteed Delivery: Tomorrow by 9 PM</div>
            <div className="mt-0.5">Your package is being prepared for dispatch with Amazon Logistics.</div>
          </div>
        </div>

        {/* Order Details Preview */}
        {order && (
          <div className="space-y-4 mb-8">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-xs">
              <h3 className="font-bold text-gray-900 mb-2">Shipping to:</h3>
              <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
              <p className="text-gray-600">
                {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </p>
              <p className="text-gray-500 mt-1">Payment Method: {order.paymentMethod}</p>
              <p className="text-gray-900 font-bold mt-2">
                Total Amount: {formattedPrice(order.totalPrice)}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Items Ordered:</h3>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden bg-white">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-contain border rounded p-1 bg-white"
                    />
                    <div className="flex-1 text-xs">
                      <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      {formattedPrice(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-200">
          <Link
            to="/orders"
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-500 font-bold rounded-full text-xs text-gray-950 border border-amber-500 transition flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>View Your Orders</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 font-semibold rounded-full text-xs text-gray-800 border border-gray-300 transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
