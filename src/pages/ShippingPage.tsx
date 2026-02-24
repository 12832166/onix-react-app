import React from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Clock, Globe, Shield } from 'lucide-react';

const ShippingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">{t('shipping.title')}</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg transition-colors duration-300">
          <div className="flex items-center gap-4 mb-4">
            <Truck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-black dark:text-white">{t('shipping.delivery.title')}</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{t('shipping.delivery.content')}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg transition-colors duration-300">
          <div className="flex items-center gap-4 mb-4">
            <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-black dark:text-white">{t('shipping.timing.title')}</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{t('shipping.timing.content')}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg transition-colors duration-300">
          <div className="flex items-center gap-4 mb-4">
            <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-black dark:text-white">{t('shipping.international.title')}</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{t('shipping.international.content')}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg transition-colors duration-300">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-black dark:text-white">{t('shipping.insurance.title')}</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{t('shipping.insurance.content')}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">{t('shipping.rates.title')}</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-700">
              <th className="text-left py-2 text-black dark:text-white">{t('shipping.rates.method')}</th>
              <th className="text-left py-2 text-black dark:text-white">{t('shipping.rates.time')}</th>
              <th className="text-left py-2 text-black dark:text-white">{t('shipping.rates.cost')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
            <tr>
              <td className="py-2 text-gray-600 dark:text-gray-400">{t('shipping.rates.standard')}</td>
              <td className="py-2 text-gray-600 dark:text-gray-400">5-7 {t('shipping.rates.days')}</td>
              <td className="py-2 text-gray-600 dark:text-gray-400">$10</td>
            </tr>
            <tr>
              <td className="py-2 text-gray-600 dark:text-gray-400">{t('shipping.rates.express')}</td>
              <td className="py-2 text-gray-600 dark:text-gray-400">2-3 {t('shipping.rates.days')}</td>
              <td className="py-2 text-gray-600 dark:text-gray-400">$25</td>
            </tr>
            <tr>
              <td className="py-2 text-gray-600 dark:text-gray-400">{t('shipping.rates.overnight')}</td>
              <td className="py-2 text-gray-600 dark:text-gray-400">1 {t('shipping.rates.day')}</td>
              <td className="py-2 text-gray-600 dark:text-gray-400">$50</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShippingPage;