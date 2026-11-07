import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CheckoutPage = () => {
  const { cartItems, itemsPrice, shippingPrice, totalPrice, totalSavings, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Shipping Address Form
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || 'Maharashtra',
    postalCode: user?.address?.postalCode || '',
    country: 'India',
  });

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  // Simulated Card Info
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '4532 •••• •••• 8821',
    nameOnCard: user?.name || '',
    expiry: '12/28',
    cvv: '•••',
  });

  // Simulated UPI ID
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const formattedPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.postalCode) {
      addToast('Please fill in all required address fields', 'error');
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'UPI / QR Code' && !upiId.trim()) {
      addToast('Please enter your UPI ID (e.g. yourname@okhdfcbank)', 'error');
      return;
    }
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty,
        })),
        shippingAddress: address,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice: 0,
        totalPrice,
      };

      const { data } = await api.post('/api/orders', orderPayload);
      clearCart();
      addToast('Order placed successfully!', 'success');
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to place order';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3 sm:px-6">
      <div className="max-w-[1300px] mx-auto">
        
        {/* Checkout Header */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-gray-950">
              amazon<span className="text-amber-500 text-xs">.in</span>
            </span>
            <span className="text-gray-400">|</span>
            <h1 className="text-base sm:text-lg font-bold text-gray-800">Checkout</h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>100% Secure Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Multi-Step Accordion (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Step 1: Delivery Address */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div
                className={`p-4 flex items-center justify-between border-b ${
                  step === 1 ? 'bg-amber-50/50 border-amber-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step > 1 ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-gray-950'
                    }`}
                  >
                    {step > 1 ? '✓' : '1'}
                  </span>
                  <h2 className="font-bold text-gray-900 text-sm sm:text-base">
                    Delivery Address
                  </h2>
                </div>
                {step > 1 && (
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-amber-700 hover:underline font-semibold"
                  >
                    Change
                  </button>
                )}
              </div>

              {step === 1 ? (
                <form onSubmit={handleAddressSubmit} className="p-5 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Full Name (First and Last name) *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                        placeholder="10-digit mobile number without +91"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Flat, House no., Building, Company, Apartment, Street *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      placeholder="Street address, apartment or suite"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Town / City *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                        placeholder="e.g. Mumbai"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        State *
                      </label>
                      <select
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      >
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Kerala">Kerala</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        6 digits PIN code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                        placeholder="e.g. 400001"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-amber-400 hover:bg-amber-500 font-bold rounded-full border border-amber-500 text-gray-950 transition"
                    >
                      Use this address
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 text-xs text-gray-700">
                  <p className="font-bold text-gray-900">{address.fullName}</p>
                  <p>{address.street}, {address.city}, {address.state} - {address.postalCode}</p>
                  <p className="text-gray-500 mt-1">Phone: {address.phone}</p>
                </div>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div
                className={`p-4 flex items-center justify-between border-b ${
                  step === 2 ? 'bg-amber-50/50 border-amber-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step > 2 ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-gray-950'
                    }`}
                  >
                    {step > 2 ? '✓' : '2'}
                  </span>
                  <h2 className="font-bold text-gray-900 text-sm sm:text-base">
                    Payment Method
                  </h2>
                </div>
                {step > 2 && (
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs text-amber-700 hover:underline font-semibold"
                  >
                    Change
                  </button>
                )}
              </div>

              {step === 2 ? (
                <form onSubmit={handlePaymentSubmit} className="p-5 space-y-4 text-xs">
                  <div className="space-y-3">
                    
                    {/* Cash on Delivery */}
                    <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-amber-400 cursor-pointer bg-white">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 text-amber-500 focus:ring-amber-500"
                      />
                      <div>
                        <div className="font-bold text-gray-900">Cash on Delivery / Pay on Delivery</div>
                        <div className="text-gray-500 mt-0.5">Pay digitally or with cash upon delivery.</div>
                      </div>
                    </label>

                    {/* Credit or Debit Card */}
                    <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-amber-400 cursor-pointer bg-white">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Credit/Debit Card"
                        checked={paymentMethod === 'Credit/Debit Card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 text-amber-500 focus:ring-amber-500"
                      />
                      <div className="w-full">
                        <div className="font-bold text-gray-900 flex items-center justify-between">
                          <span>Credit or debit card</span>
                          <span className="text-gray-400 font-normal">Visa, Mastercard, RuPay</span>
                        </div>
                        {paymentMethod === 'Credit/Debit Card' && (
                          <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200 grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                              <label className="block text-[11px] font-bold text-gray-600 mb-1">Card Number</label>
                              <input
                                type="text"
                                value={cardInfo.cardNumber}
                                onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                                className="w-full px-2.5 py-1.5 border rounded text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-600 mb-1">Expiry Date</label>
                              <input
                                type="text"
                                value={cardInfo.expiry}
                                onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                                className="w-full px-2.5 py-1.5 border rounded text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-600 mb-1">CVV</label>
                              <input
                                type="password"
                                maxLength={4}
                                value={cardInfo.cvv}
                                onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                                className="w-full px-2.5 py-1.5 border rounded text-xs"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </label>

                    {/* UPI / QR Code */}
                    <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-amber-400 cursor-pointer bg-white">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="UPI / QR Code"
                        checked={paymentMethod === 'UPI / QR Code'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 text-amber-500 focus:ring-amber-500"
                      />
                      <div className="w-full">
                        <div className="font-bold text-gray-900">Other UPI Apps (Google Pay, PhonePe, Paytm)</div>
                        {paymentMethod === 'UPI / QR Code' && (
                          <div className="mt-2">
                            <input
                              type="text"
                              placeholder="Enter your UPI ID (e.g. mobile@upi)"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
                            />
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Net Banking */}
                    <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-amber-400 cursor-pointer bg-white">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Net Banking"
                        checked={paymentMethod === 'Net Banking'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 text-amber-500 focus:ring-amber-500"
                      />
                      <div>
                        <div className="font-bold text-gray-900">Net Banking</div>
                        <div className="text-gray-500 mt-0.5">All major Indian banks supported.</div>
                      </div>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-amber-400 hover:bg-amber-500 font-bold rounded-full border border-amber-500 text-gray-950 transition"
                    >
                      Use this payment method
                    </button>
                  </div>
                </form>
              ) : step > 2 ? (
                <div className="p-4 text-xs text-gray-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900">{paymentMethod}</span>
                    {paymentMethod === 'Credit/Debit Card' && (
                      <span className="text-gray-500 ml-2">({cardInfo.cardNumber})</span>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Step 3: Review Items & Delivery */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div
                className={`p-4 flex items-center justify-between border-b ${
                  step === 3 ? 'bg-amber-50/50 border-amber-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step === 3 ? 'bg-amber-500 text-gray-950' : 'bg-gray-300 text-gray-700'
                    }`}
                  >
                    3
                  </span>
                  <h2 className="font-bold text-gray-900 text-sm sm:text-base">
                    Review items and delivery
                  </h2>
                </div>
              </div>

              {step === 3 && (
                <div className="p-5 space-y-4">
                  <div className="border border-emerald-200 bg-emerald-50 p-3 rounded text-xs text-emerald-800 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>
                      Guaranteed delivery: <strong>Tomorrow by 9 PM</strong> with Free Prime delivery.
                    </span>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div key={item.product} className="py-3 flex gap-4 items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-contain border p-1 rounded bg-white flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-xs text-gray-900 line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Quantity: <strong>{item.qty}</strong>
                          </p>
                          <p className="text-xs font-bold text-gray-950 mt-1">
                            {formattedPrice(item.price * item.qty)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={submitting}
                      className="w-full sm:w-auto px-8 py-3 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-950 font-bold rounded-full border border-[#fcd200] shadow transition flex items-center justify-center gap-2 text-sm"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent"></div>
                          <span>Placing your order...</span>
                        </>
                      ) : (
                        <span>Place your order and pay</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4 sticky top-24">
              {step === 3 && (
                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="w-full py-2.5 px-4 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-950 font-bold rounded-full border border-[#fcd200] shadow text-xs transition"
                >
                  {submitting ? 'Placing Order...' : 'Place your order and pay'}
                </button>
              )}

              <p className="text-[11px] text-gray-500 text-center">
                By placing your order, you agree to Amazon's{' '}
                <a href="#" className="text-amazon-link hover:underline">privacy notice</a> and{' '}
                <a href="#" className="text-amazon-link hover:underline">conditions of use</a>.
              </p>

              <div className="border-t border-gray-200 pt-3">
                <h3 className="font-bold text-sm text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex justify-between">
                    <span>Items ({cartItems.reduce((a, b) => a + b.qty, 0)}):</span>
                    <span>{formattedPrice(itemsPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>{shippingPrice === 0 ? 'FREE' : formattedPrice(shippingPrice)}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Total Savings:</span>
                      <span>-{formattedPrice(totalSavings)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-base text-red-700">
                    <span>Order Total:</span>
                    <span>{formattedPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded text-[11px] text-gray-500 border border-gray-200 space-y-1">
                <div className="font-bold text-gray-700">How are delivery costs calculated?</div>
                <div>Amazon Prime members get free Standard delivery on eligible items.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
