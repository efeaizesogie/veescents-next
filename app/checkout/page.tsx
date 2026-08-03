'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useStore } from '@/context/StoreContext';
import { CreditCard, Landmark, CheckCircle, ShieldCheck, ArrowRight, ShoppingBag, MessageSquare, Truck, HelpCircle } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';

export const dynamic = 'force-dynamic';

const DEFAULT_PAYSTACK_KEY = 'pk_test_d3a04e578c773950d807667eff44feef886897bc';
const CEO_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_CEO_WHATSAPP_NUMBER || '2348028479738';
const EXCHANGE_RATE = 1;

const NIGERIAN_STATES = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo', 'Anambra', 
  'Kano', 'Kaduna', 'Edo', 'Delta', 'Ogun', 
  'Enugu', 'Akwa Ibom', 'Abia', 'Ondo', 'Osun',
  'Kwara', 'Plateau', 'Imo', 'Cross River', 'Other'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useUser();
  const { cart, cartTotal, clearCart } = useStore();
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setStateValue] = useState('Lagos');
  const [saveAddress, setSaveAddress] = useState(true);

  // Delivery options state
  const [deliveryMethod, setDeliveryMethod] = useState<'door_delivery' | 'discuss_delivery'>('door_delivery');
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'bank_transfer' | 'whatsapp'>('paystack');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Success order tracking state
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const scriptRef = useRef<HTMLScriptElement | null>(null);

  // Computed shipping fee
  const shippingCost = deliveryMethod === 'door_delivery' ? 2500 : 0;
  const finalAmount = cartTotal + shippingCost;

  // 1. Script Loading for Paystack Inline
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if ((window as any).PaystackPop) {
      setPaystackLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setPaystackLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Paystack SDK');
      setErrorMessage('Could not load online payment gateway. Direct Bank Transfer and WhatsApp payments are still available.');
    };
    
    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }
    };
  }, []);

  // 2. Pre-fill address profiles (MongoDB or LocalStorage cache)
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.primaryEmailAddress?.emailAddress || '');
      
      // Fetch saved address from DB
      fetch('/api/user/address')
        .then(r => {
          if (r.ok) return r.json();
          throw new Error('Not found');
        })
        .then(data => {
          if (data) {
            if (data.fullName) setFullName(data.fullName);
            if (data.phone) setPhone(data.phone);
            if (data.address) setAddress(data.address);
            if (data.city) setCity(data.city);
            if (data.state) setStateValue(data.state);
          }
        })
        .catch(() => {
          // Fallback to localStorage if authenticated but database retrieval failed/missing
          loadFromLocalCache();
        });
    } else {
      loadFromLocalCache();
    }

    function loadFromLocalCache() {
      try {
        const saved = localStorage.getItem('veescents_saved_address');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.fullName) setFullName(parsed.fullName);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.address) setAddress(parsed.address);
          if (parsed.city) setCity(parsed.city);
          if (parsed.state) setStateValue(parsed.state);
        }
      } catch (e) {
        console.error('Failed to read localStorage address cache:', e);
      }
    }
  }, [user]);

  // 3. Save shipping details handler helper
  const handleSaveShippingAddress = async () => {
    if (!saveAddress) return;
    
    // Save to localStorage regardless of auth
    try {
      localStorage.setItem('veescents_saved_address', JSON.stringify({
        fullName, phone, address, city, state
      }));
    } catch (e) {
      console.error(e);
    }

    // Save to DB if authenticated
    if (user) {
      try {
        await fetch('/api/user/address', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, phone, address, city, state })
        });
      } catch (err) {
        console.error('Failed to save address to database profile:', err);
      }
    }
  };

  // 4. Paystack Core Checkout Execution
  const handlePaystackPayment = () => {
    if (!(window as any).PaystackPop) {
      setErrorMessage('Payment portal is still initializing. Please wait a second and retry.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || DEFAULT_PAYSTACK_KEY;
    const txRef = 'VEE-' + Math.floor(Math.random() * 1000000000 + 1);

    const handler = (window as any).PaystackPop.setup({
      key: paystackKey,
      email: email,
      amount: finalAmount * 100, // Paystack eats kobo
      currency: 'NGN',
      ref: txRef,
      callback: async (response: any) => {
        try {
          await handleSaveShippingAddress();
          const apiResponse = await fetch('/api/user/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              fullName,
              phone,
              address,
              city,
              state,
              items: cart.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
              })),
              totalAmount: finalAmount,
              shippingCost: shippingCost,
              paymentMethod: `Paystack (${deliveryMethod === 'door_delivery' ? 'Door Delivery' : 'Collect/Discuss'})`,
              paymentStatus: 'Paid',
              reference: response.reference || txRef
            })
          });

          if (!apiResponse.ok) throw new Error('Order registry failed.');
          const parsedOrder = await apiResponse.json();
          clearCart();
          setOrderSuccess(parsedOrder);
        } catch (err: any) {
          console.error(err);
          setErrorMessage('Payment completed, but order registration slipped. Contact support with code: ' + (response.reference || txRef));
        } finally {
          setIsSubmitting(false);
        }
      },
      onClose: () => {
        setIsSubmitting(false);
      }
    });

    handler.openIframe();
  };

  // 5. Offline Bank Transfer Core Checkout Execution
  const handleOfflineTransfer = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const txRef = 'VEE-BT-' + Math.floor(Math.random() * 1000000000 + 1);

    try {
      await handleSaveShippingAddress();
      const apiResponse = await fetch('/api/user/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName,
          phone,
          address,
          city,
          state,
          items: cart.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          totalAmount: finalAmount,
          shippingCost: shippingCost,
          paymentMethod: `Bank Transfer (${deliveryMethod === 'door_delivery' ? 'Door Delivery' : 'Collect/Discuss'})`,
          paymentStatus: 'Pending',
          reference: txRef
        })
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.message || 'Standard server rejection occurred.');
      }

      const parsedOrder = await apiResponse.json();
      clearCart();
      setOrderSuccess(parsedOrder);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred while creating your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. WhatsApp Routing Direct Checkout Execution
  const handleWhatsAppCheckout = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const txRef = 'VEE-WA-' + Math.floor(Math.random() * 1000000000 + 1);

    try {
      await handleSaveShippingAddress();
      // Place Order in DB first
      const apiResponse = await fetch('/api/user/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName,
          phone,
          address,
          city,
          state,
          items: cart.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          totalAmount: finalAmount,
          shippingCost: shippingCost,
          paymentMethod: `WhatsApp Checkout (${deliveryMethod === 'door_delivery' ? 'Door Delivery' : 'Collect/Discuss'})`,
          paymentStatus: 'Pending WhatsApp Verification',
          reference: txRef
        })
      });

      if (!apiResponse.ok) {
        throw new Error('Could not submit WhatsApp purchase logging draft.');
      }

      const parsedOrder = await apiResponse.json();

      // Format WhatsApp Message
      const itemizedString = cart.map(item => `- ${item.quantity}x ${item.name} (${item.brand}) @ ₦${item.price.toLocaleString()} each`).join('\n');
      const deliveryText = deliveryMethod === 'door_delivery' 
        ? `Door Delivery (₦${shippingCost.toLocaleString()})`
        : 'Discuss Delivery with CEO';

      const msg = `Hello Veescents CEO, I would like to make direct payment for my order.

*Order Ref:* ${txRef}
*Customer Name:* ${fullName}
*Phone:* ${phone}
*Email:* ${email}

*Delivery Method:* ${deliveryText}
*Address:* ${address}, ${city}, ${state} State.

*Selected Products:*
${itemizedString}

*Total Amount:* ₦${finalAmount.toLocaleString()}

Please confirm payment and delivery logistics context. Thank you!`;

      // Clear Cart state
      clearCart();
      setOrderSuccess(parsedOrder);

      // Open WhatsApp link
      const encodedMsg = encodeURIComponent(msg);
      const url = `https://wa.me/${CEO_WHATSAPP_NUMBER}?text=${encodedMsg}`;
      window.open(url, '_blank');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error occurred while saving WhatsApp order draft.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !address || !city || !state) {
      setErrorMessage('Please complete all shipping address detail inputs.');
      return;
    }

    if (paymentMethod === 'paystack') {
      handlePaystackPayment();
    } else if (paymentMethod === 'bank_transfer') {
      handleOfflineTransfer();
    } else {
      handleWhatsAppCheckout();
    }
  };

  // Render Successful Order Confirmation state
  if (orderSuccess) {
    return (
      <div className="page-shell bg-cream-50 min-h-screen py-16 animate-fade-in">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-white border border-[#efece2] shadow-sm p-8 rounded-sm text-center">
            <CheckCircle size={56} className="mx-auto text-accent-gold mb-5" />
            <h1 className="font-serif text-3xl font-normal text-accent-dark mb-2">Order Logged!</h1>
            <p className="text-gray-500 text-sm mb-6">
              Thank you for choosing Veescents. Your shipping instructions and checkout details have been compiled.
            </p>

            <div className="bg-cream-50 p-5 rounded-sm border border-[#efece2] text-left mb-8 space-y-3">
              <p className="text-xs text-accent-dark/80 font-bold uppercase tracking-wider border-b border-gray-200 pb-2">Order Profile Details</p>
              <div className="grid grid-cols-2 text-sm gap-2">
                <span className="text-gray-400">Order Reference:</span>
                <span className="font-mono text-accent-dark font-medium text-right">{orderSuccess.reference}</span>
                <span className="text-gray-400">Total Sum:</span>
                <span className="font-bold text-accent-dark text-right">₦{(orderSuccess.totalAmount).toLocaleString()}</span>
                <span className="text-gray-400">Recipient Name:</span>
                <span className="text-accent-dark text-right">{orderSuccess.fullName}</span>
                <span className="text-gray-400">Delivery Style:</span>
                <span className="text-accent-dark text-right">
                  {orderSuccess.shippingCost > 0 ? `Door Delivery (₦${orderSuccess.shippingCost.toLocaleString()})` : 'Discuss delivery fee with CEO'}
                </span>
                <span className="text-gray-400">Payment Status:</span>
                <span className={`font-semibold text-right ${orderSuccess.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                  {orderSuccess.paymentStatus === 'Paid' ? 'Paid Online' : orderSuccess.paymentStatus}
                </span>
              </div>
            </div>

            {orderSuccess.paymentMethod.startsWith('WhatsApp') && (
              <div className="bg-[#f5fbff] border-l-4 border-[#075e54] p-5 text-left mb-8 space-y-3 shadow-xs">
                <p className="text-xs font-bold text-[#075e54] uppercase tracking-widest flex items-center gap-1.5">
                  <MessageSquare size={14} /> WhatsApp Chat Redirection
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We opened WhatsApp in a new tab to send your product and delivery choices directly to the CEO. If the chat window did not open automatically, please click the button below:
                </p>
                <button
                  onClick={() => {
                    const itemizedString = orderSuccess.items.map((item: any) => `- ${item.quantity}x ${item.name} @ ₦${item.price.toLocaleString()} each`).join('\n');
                    const deliveryText = orderSuccess.shippingCost > 0 
                      ? 'Door Delivery'
                      : 'Discuss Delivery';
                    const msg = `Hello Veescents CEO, I would like to make direct payment for my order.\n\n*Order Ref:* ${orderSuccess.reference}\n*Customer Name:* ${orderSuccess.fullName}\n*Phone:* ${orderSuccess.phone}\n*Email:* ${orderSuccess.email}\n*Delivery Method:* ${deliveryText}\n*Address:* ${orderSuccess.address}, ${orderSuccess.city}, ${orderSuccess.state} State.\n\n*Products:*\n${itemizedString}\n\n*Total Amount:* ₦${orderSuccess.totalAmount.toLocaleString()}\n\nThank you!`;
                    window.open(`https://wa.me/${CEO_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-2"
                >
                  <MessageSquare size={14} /> Reopen WhatsApp Discussion
                </button>
              </div>
            )}

            {orderSuccess.paymentMethod.startsWith('Bank Transfer') && (
              <div className="bg-[#fffdf5] border-l-4 border-accent-gold p-5 text-left mb-8 space-y-3 shadow-xs">
                <p className="text-xs font-bold text-accent-gold-dark uppercase tracking-widest">Bank Transfer Instructions</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Please deposit the total sum of <strong>₦{orderSuccess.totalAmount.toLocaleString()}</strong> to the details shown below, using your <b>Order Reference</b> as description:
                </p>
                <div className="text-xs space-y-1 block bg-white p-3 border border-[#efece2]">
                  <p>Bank Name: <strong>GTBank (Guaranty Trust Bank)</strong></p>
                  <p>Account Number: <strong>0123456789</strong></p>
                  <p>Account Name: <strong>Veescents Luxury Store Ltd.</strong></p>
                </div>
                <p className="text-[11px] text-gray-400 italic">
                  *Your order will remain pending until deposit payment is verified by our finance team.
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Link href="/store" className="bg-accent-dark text-white px-7 py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent-gold transition-colors">
                Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell bg-cream-50 min-h-screen">
      <div className="container mx-auto px-6">
        <SectionTitle title="Checkout" subtitle="Choose your delivery and pay securely via local channels." />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Shipping Form & Payment Controls */}
          <div className="lg:col-span-7 bg-white p-6 shadow-sm border border-gray-100 rounded-sm">
            <h2 className="font-serif text-xl text-accent-dark mb-6 border-b border-gray-100 pb-3">Delivery Information</h2>

            {errorMessage && (
              <div className="bg-red-50 text-red-700 text-xs px-4 py-3 mb-6 border-l-2 border-red-500 rounded-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-accent-dark/80 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-gray-200 focus:border-accent-gold outline-none p-3 text-sm rounded-sm"
                    placeholder="E.g. Aizesogie Efe"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-accent-dark/80 uppercase tracking-widest mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-200 focus:border-accent-gold outline-none p-3 text-sm rounded-sm"
                    placeholder="E.g. 08123456789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-accent-dark/80 uppercase tracking-widest mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 focus:border-accent-gold outline-none p-3 text-sm rounded-sm"
                  placeholder="E.g. efe@example.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-accent-dark/80 uppercase tracking-widest mb-1.5">Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-200 focus:border-accent-gold outline-none p-3 text-sm rounded-sm"
                  placeholder="Street name, estate, apartment number"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-accent-dark/80 uppercase tracking-widest mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-200 focus:border-accent-gold outline-none p-3 text-sm rounded-sm"
                    placeholder="E.g. Lekki"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-accent-dark/80 uppercase tracking-widest mb-1.5">State</label>
                  <select
                    value={state}
                    onChange={(e) => setStateValue(e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-accent-gold outline-none p-3 text-sm rounded-sm cursor-pointer"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SAVE ADDRESS CHECKBOX */}
              <label className="flex items-center gap-2 cursor-pointer mt-1 group">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  className="rounded-sm accent-accent-gold cursor-pointer"
                />
                <span className="text-xs text-accent-dark/80 group-hover:text-accent-gold transition-colors font-medium">
                  Save this shipping address for future checkouts
                </span>
              </label>

              {/* DELIVERY SELECT OPTIONS */}
              <div className="pt-4">
                <h3 className="font-serif text-lg text-accent-dark mb-3 border-b border-gray-100 pb-2">Delivery Selection</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    onClick={() => setDeliveryMethod('door_delivery')}
                    className={`border p-4 rounded-sm cursor-pointer flex items-center gap-3 transition-colors ${deliveryMethod === 'door_delivery' ? 'bg-[#fffdf5] border-accent-gold text-accent-dark' : 'border-gray-200 hover:border-accent-gold-light'}`}
                  >
                    <Truck size={18} className={deliveryMethod === 'door_delivery' ? 'text-accent-gold' : 'text-gray-400'} />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">Door Delivery</p>
                      <p className="text-[10px] text-gray-500">Standard logistics shipping (₦2,500)</p>
                    </div>
                  </div>
                  <div
                    onClick={() => setDeliveryMethod('discuss_delivery')}
                    className={`border p-4 rounded-sm cursor-pointer flex items-center gap-3 transition-colors ${deliveryMethod === 'discuss_delivery' ? 'bg-[#fffdf5] border-accent-gold text-accent-dark' : 'border-gray-200 hover:border-accent-gold-light'}`}
                  >
                    <HelpCircle size={18} className={deliveryMethod === 'discuss_delivery' ? 'text-accent-gold' : 'text-gray-400'} />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">Discuss Shipping with CEO</p>
                      <p className="text-[10px] text-gray-500">Free placement, logistics arranged manually</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT OPTIONS */}
              <div className="pt-4">
                <h3 className="font-serif text-lg text-accent-dark mb-3 border-b border-gray-100 pb-2">Payment Option</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div
                    onClick={() => setPaymentMethod('paystack')}
                    className={`border p-4 rounded-sm cursor-pointer flex flex-col justify-between h-24 transition-colors ${paymentMethod === 'paystack' ? 'bg-cream-50 border-accent-gold text-accent-dark' : 'border-gray-200 hover:border-accent-gold-light'}`}
                  >
                    <CreditCard size={18} className={paymentMethod === 'paystack' ? 'text-accent-gold' : 'text-gray-400'} />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider">Pay Online</p>
                      <p className="text-[9px] text-gray-500 leading-tight">Paystack Gateway (Cards/Banks/USSD)</p>
                    </div>
                  </div>
                  <div
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`border p-4 rounded-sm cursor-pointer flex flex-col justify-between h-24 transition-colors ${paymentMethod === 'bank_transfer' ? 'bg-cream-50 border-accent-gold text-accent-dark' : 'border-gray-200 hover:border-accent-gold-light'}`}
                  >
                    <Landmark size={18} className={paymentMethod === 'bank_transfer' ? 'text-accent-gold' : 'text-gray-400'} />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider">Direct Bank</p>
                      <p className="text-[9px] text-gray-500 leading-tight">Manual checkout bank deposit</p>
                    </div>
                  </div>
                  <div
                    onClick={() => setPaymentMethod('whatsapp')}
                    className={`border p-4 rounded-sm cursor-pointer flex flex-col justify-between h-24 transition-colors ${paymentMethod === 'whatsapp' ? 'bg-cream-50 border-accent-gold text-accent-dark' : 'border-gray-200 hover:border-accent-gold-light'}`}
                  >
                    <MessageSquare size={18} className={paymentMethod === 'whatsapp' ? 'text-accent-gold animate-pulse' : 'text-gray-400'} />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider">Chat with CEO</p>
                      <p className="text-[9px] text-gray-500 leading-tight">Authorize & pay via direct WhatsApp</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT SUBMIT BLOCK */}
              <div className="pt-4">
                {paymentMethod === 'paystack' && (
                  <button
                    type="submit"
                    disabled={isSubmitting || !paystackLoaded}
                    className="w-full bg-[#11a9ca] text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#0092b3] transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={16} /> {isSubmitting ? 'Processing Payment...' : `Pay online ₦${finalAmount.toLocaleString()}`}
                  </button>
                )}

                {paymentMethod === 'bank_transfer' && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent-dark text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-accent-gold transition-colors shadow-sm"
                  >
                    {isSubmitting ? 'Recording Order...' : 'Place Order via Bank Transfer'}
                  </button>
                )}

                {paymentMethod === 'whatsapp' && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#25D366] text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#128C7E] transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} /> {isSubmitting ? 'Formatting Order...' : 'Checkout & Chat with CEO'}
                  </button>
                )}

                <div className="flex justify-center items-center gap-2 mt-4 text-[10px] text-gray-400">
                  <ShieldCheck size={12} className="text-accent-gold" />
                  <span>Secure checkout processing powered by Veescents.</span>
                </div>
              </div>
            </form>
          </div>

          {/* Right sidebar - Order items preview */}
          <div className="lg:col-span-5 bg-white p-6 shadow-sm border border-gray-100 rounded-sm">
            <h2 className="font-serif text-xl text-accent-dark mb-6 border-b border-gray-100 pb-3">Order Summary</h2>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 justify-between items-center text-sm">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-14 bg-gray-50 flex-shrink-0 relative border border-gray-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm text-accent-dark line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-accent-dark">₦{(item.price * item.quantity * EXCHANGE_RATE).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-accent-dark">₦{(cartTotal * EXCHANGE_RATE).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-medium text-accent-dark">₦{shippingCost.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-serif text-base font-bold text-accent-dark">
                <span>Total Due</span>
                <span className="text-lg">₦{finalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
