import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Package } from 'lucide-react';

const ConfirmationPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { orderData } = location.state || {};

  if (!orderData) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t('confirmation.invalid')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{t('confirmation.invalidMessage')}</p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('confirmation.backToHome')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t('confirmation.success')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('confirmation.successMessage')}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 mb-8 transition-colors duration-300">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{t('confirmation.orderDetails')}</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{t('confirmation.contact')}</h3>
              <p className="text-gray-700 dark:text-gray-300">{orderData.contact.firstName} {orderData.contact.lastName}</p>
              <p className="text-gray-700 dark:text-gray-300">{orderData.contact.email}</p>
              <p className="text-gray-700 dark:text-gray-300">{orderData.contact.phone}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{t('confirmation.shipping')}</h3>
              <p className="text-gray-700 dark:text-gray-300">{orderData.address.street}</p>
              <p className="text-gray-700 dark:text-gray-300">{orderData.address.city}, {orderData.address.state} {orderData.address.zipCode}</p>
              <p className="text-gray-700 dark:text-gray-300">{orderData.address.country}</p>
              <p className="mt-2 text-blue-600 dark:text-blue-400">
                {t(`shipping.rates.${orderData.shippingMethod}`)}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-300 dark:border-gray-700 pt-6">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">{t('confirmation.items')}</h3>
            <div className="space-y-4">
              {orderData.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{t(`products.items.${item.id}.name`)}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.quantity} x ${item.price}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-300 dark:border-gray-700 pt-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('cart.subtotal')}</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${(orderData.total - orderData.shipping).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('cart.shipping')}</span>
              <span className="font-semibold text-gray-900 dark:text-white">${orderData.shipping.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-700 pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900 dark:text-white">{t('confirmation.total')}</span>
                <span className="text-gray-900 dark:text-white">${orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          {t('confirmation.backToHome')}
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;