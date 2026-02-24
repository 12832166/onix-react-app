import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as Tabs from '@radix-ui/react-tabs';
import { Check, CreditCard, Truck, User } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useUserStore } from '@/store/user';

const contactSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
});

const addressSchema = z.object({
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().min(5),
  country: z.string().min(2),
  shippingMethod: z.enum(['standard', 'express', 'overnight']),
});

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Invalid card number'),
  cardHolder: z.string().min(2),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),
});

type ContactFormData = z.infer<typeof contactSchema>;
type AddressFormData = z.infer<typeof addressSchema>;
type PaymentFormData = z.infer<typeof paymentSchema>;

const shippingRates = {
  standard: 10,
  express: 25,
  overnight: 50,
};

const CheckoutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('contact');
  const [selectedShipping, setSelectedShipping] = useState<keyof typeof shippingRates>('standard');
  const [formData, setFormData] = useState<{
    contact?: ContactFormData;
    address?: AddressFormData;
    payment?: PaymentFormData;
  }>({});
  
  const { items, clearCart } = useCartStore();
  const { user } = useUserStore();
  const buyNowItem = location.state?.buyNowItem;
  
  const checkoutItems = buyNowItem ? [buyNowItem] : items;

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: user ? {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    } : undefined,
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: user?.address ? {
      street: user.address.street,
      city: user.address.city,
      state: user.address.state,
      zipCode: user.address.zipCode,
      country: user.address.country,
      shippingMethod: 'standard',
    } : {
      shippingMethod: 'standard',
    },
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const watchShippingMethod = addressForm.watch('shippingMethod');
  
  useEffect(() => {
    if (watchShippingMethod) {
      setSelectedShipping(watchShippingMethod);
    }
  }, [watchShippingMethod]);

  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = shippingRates[selectedShipping];
  const total = subtotal + shipping;

  const onContactSubmit = (data: ContactFormData) => {
    setFormData({ ...formData, contact: data });
    setActiveTab('address');
  };

  const onAddressSubmit = (data: AddressFormData) => {
    setFormData({ ...formData, address: data });
    setSelectedShipping(data.shippingMethod);
    setActiveTab('payment');
  };

  const onPaymentSubmit = (data: PaymentFormData) => {
    const orderData = {
      ...formData,
      payment: { 
        ...data,
        cardNumber: '****' + data.cardNumber.slice(-4)
      },
      items: checkoutItems,
      shipping: shippingRates[selectedShipping],
      total: total,
      shippingMethod: selectedShipping,
      orderDate: new Date().toISOString(),
      orderId: `ORD${Date.now()}`
    };

    console.log('Order placed:', orderData);

    if (!buyNowItem) {
      clearCart();
    }
    
    navigate('/checkout/confirmation', { 
      state: { orderData }
    });
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    paymentForm.setValue('expiryDate', value);
  };

  const handleAutofill = (paymentMethod: PaymentMethod) => {
    paymentForm.setValue('cardNumber', paymentMethod.cardNumber);
    paymentForm.setValue('cardHolder', paymentMethod.cardHolder);
    paymentForm.setValue('expiryDate', paymentMethod.expiryDate);
    paymentForm.setValue('cvv', paymentMethod.cvv);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg dark:shadow-2xl transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">{t('checkout.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="flex space-x-1 border-b border-gray-300 dark:border-gray-700 mb-6">
              <Tabs.Trigger
                value="contact"
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === 'contact'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-700 dark:text-gray-400'
                }`}
              >
                <User className="w-5 h-5" />
                {t('checkout.contact')}
                {formData.contact && <Check className="w-4 h-4 text-green-500" />}
              </Tabs.Trigger>

              <Tabs.Trigger
                value="address"
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === 'address'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-700 dark:text-gray-400'
                }`}
                disabled={!formData.contact}
              >
                <Truck className="w-5 h-5" />
                {t('checkout.shipping')}
                {formData.address && <Check className="w-4 h-4 text-green-500" />}
              </Tabs.Trigger>

              <Tabs.Trigger
                value="payment"
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === 'payment'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-700 dark:text-gray-400'
                }`}
                disabled={!formData.address}
              >
                <CreditCard className="w-5 h-5" />
                {t('checkout.payment')}
                {formData.payment && <Check className="w-4 h-4 text-green-500" />}
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="contact">
              <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('checkout.firstName')}
                    </label>
                    <input
                      type="text"
                      {...contactForm.register('firstName')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    {contactForm.formState.errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {contactForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('checkout.lastName')}
                    </label>
                    <input
                      type="text"
                      {...contactForm.register('lastName')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    {contactForm.formState.errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {contactForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('checkout.email')}
                  </label>
                  <input
                    type="email"
                    {...contactForm.register('email')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {contactForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {contactForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('checkout.phone')}
                  </label>
                  <input
                    type="tel"
                    {...contactForm.register('phone')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {contactForm.formState.errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {contactForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('checkout.continue')}
                </button>
              </form>
            </Tabs.Content>

            <Tabs.Content value="address">
              <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('checkout.street')}
                  </label>
                  <input
                    type="text"
                    {...addressForm.register('street')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {addressForm.formState.errors.street && (
                    <p className="text-red-500 text-sm mt-1">
                      {addressForm.formState.errors.street.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('checkout.city')}
                    </label>
                    <input
                      type="text"
                      {...addressForm.register('city')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    {addressForm.formState.errors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {addressForm.formState.errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('checkout.state')}
                    </label>
                    <input
                      type="text"
                      {...addressForm.register('state')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    {addressForm.formState.errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {addressForm.formState.errors.state.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('checkout.zipCode')}
                    </label>
                    <input
                      type="text"
                      {...addressForm.register('zipCode')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    {addressForm.formState.errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {addressForm.formState.errors.zipCode.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('checkout.country')}
                    </label>
                    <input
                      type="text"
                      {...addressForm.register('country')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    {addressForm.formState.errors.country && (
                      <p className="text-red-500 text-sm mt-1">
                        {addressForm.formState.errors.country.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('shipping.rates.title')}
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 transition-colors">
                      <input
                        type="radio"
                        {...addressForm.register('shippingMethod')}
                        value="standard"
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{t('shipping.rates.standard')}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          5-7 {t('shipping.rates.days')} - ${shippingRates.standard}
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 transition-colors">
                      <input
                        type="radio"
                        {...addressForm.register('shippingMethod')}
                        value="express"
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{t('shipping.rates.express')}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          2-3 {t('shipping.rates.days')} - ${shippingRates.express}
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 transition-colors">
                      <input
                        type="radio"
                        {...addressForm.register('shippingMethod')}
                        value="overnight"
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{t('shipping.rates.overnight')}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          1 {t('shipping.rates.day')} - ${shippingRates.overnight}
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('checkout.continue')}
                </button>
              </form>
            </Tabs.Content>

            <Tabs.Content value="payment">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg transition-colors duration-300">
                {user && user.paymentMethods.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-gray-300 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('checkout.savedCards')}</h3>
                    <div className="space-y-3">
                      {user.paymentMethods.map((method) => (
                        <button
                          key={method.cardNumber}
                          onClick={() => handleAutofill(method)}
                          className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <div className="text-left">
                              <p className="font-medium text-gray-900 dark:text-white">**** **** **** {method.cardNumber.slice(-4)}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{method.cardHolder}</p>
                            </div>
                          </div>
                          <span className="text-blue-600 dark:text-blue-400 text-sm">{t('checkout.useCard')}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('checkout.cardNumber')}
                    </label>
                    <input
                      type="text"
                      {...paymentForm.register('cardNumber')}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    {paymentForm.formState.errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {paymentForm.formState.errors.cardNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('checkout.cardHolder')}
                    </label>
                    <input
                      type="text"
                      {...paymentForm.register('cardHolder')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    {paymentForm.formState.errors.cardHolder && (
                      <p className="text-red-500 text-sm mt-1">
                        {paymentForm.formState.errors.cardHolder.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('checkout.expiryDate')}
                      </label>
                      <input
                        type="text"
                        {...paymentForm.register('expiryDate')}
                        placeholder="MM/YY"
                        onChange={handleExpiryDateChange}
                        maxLength={5}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                      {paymentForm.formState.errors.expiryDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {paymentForm.formState.errors.expiryDate.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('checkout.cvv')}
                      </label>
                      <input
                        type="text"
                        {...paymentForm.register('cvv')}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                      {paymentForm.formState.errors.cvv && (
                        <p className="text-red-500 text-sm mt-1">
                          {paymentForm.formState.errors.cvv.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('checkout.placeOrder')}
                  </button>
                </form>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 sticky top-4 transition-colors duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{t('cart.orderSummary')}</h2>
            
            <div className="space-y-4">
              {checkoutItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={t(`products.items.${item.id}.name`)}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{t(`products.items.${item.id}.name`)}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.quantity} x ${item.price}
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t border-gray-300 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('cart.subtotal')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('cart.shipping')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-700 pt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">{t('cart.total')}</span>
                    <span className="font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;