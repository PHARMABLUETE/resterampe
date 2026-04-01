'use client';

import { useState } from 'react';
import { Product } from '../page';
import StockBadge from './StockBadge';
import ProductDetail from './ProductDetail';

export default function ProductTable({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-500 w-16">Bild</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Produkt</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Art.-Nr.</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Bestand</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Preis</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Kategorien</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(product => (
              <tr
                key={product.shopware_id}
                onClick={() => setSelected(product)}
                className="hover:bg-blue-50 cursor-pointer transition-colors"
              >
                {/* Bild */}
                <td className="px-4 py-3">
                  {product.cover_url ? (
                    <img
                      src={product.cover_url}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                      📦
                    </div>
                  )}
                </td>

                {/* Name */}
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900">{product.name}</span>
                </td>

                {/* Art.-Nr. */}
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                  {product.product_number}
                </td>

                {/* Bestand */}
                <td className="px-4 py-3">
                  <StockBadge stock={product.stock} />
                </td>

                {/* Preis */}
                <td className="px-4 py-3 text-gray-700">
                  {product.price !== null
                    ? product.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
                    : '–'}
                </td>

                {/* Kategorien */}
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {product.categories.slice(0, 2).map(cat => (
                      <span key={cat} className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                        {cat}
                      </span>
                    ))}
                    {product.categories.length > 2 && (
                      <span className="text-gray-400 text-xs">+{product.categories.length - 2}</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <ProductDetail product={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
