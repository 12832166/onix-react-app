import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const FAQPage = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">{t('faq.title')}</h1>
      
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <details key={i} className="group bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg transition-colors duration-300">
            <summary className="flex items-center justify-between cursor-pointer p-6">
              <h3 className="text-lg font-medium pr-4 text-black dark:text-white">
                {t(`faq.q${i}.question`)}
              </h3>
              <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180 text-gray-600 dark:text-gray-400" />
            </summary>
            <div className="px-6 pt-4 pb-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">{t(`faq.q${i}.answer`)}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;