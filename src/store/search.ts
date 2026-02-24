import { create } from 'zustand';
import { products } from '../data/mockData';
import { Product } from '../types';

interface SearchStore {
  query: string;
  setQuery: (query: string, translator?: (key: string) => string) => void;
  results: Product[];
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  results: [],
  setQuery: (query, translator) => {
    const searchResults = query
      ? products.filter((product) => {
          const lowerQuery = query.toLowerCase();
          const matchesOriginal =
            product.name.toLowerCase().includes(lowerQuery) ||
            product.description.toLowerCase().includes(lowerQuery) ||
            product.category.toLowerCase().includes(lowerQuery);

          if (matchesOriginal || !translator) {
            return matchesOriginal;
          }

          // Check translated name and description if translator provided
          const translatedName = translator(`products.items.${product.id}.name`).toLowerCase();
          const translatedDescription = translator(`products.items.${product.id}.description`).toLowerCase();

          return (
            translatedName.includes(lowerQuery) ||
            translatedDescription.includes(lowerQuery)
          );
        })
      : [];
    set({ query, results: searchResults });
  },
}));