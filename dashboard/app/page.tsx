'use client';

import { useEffect, useState } from 'react';
import ProductTable from './components/ProductTable';

export type Product = {
  shopware_id: string;
  product_number: string;
  name: string;
  stock: number;
  price: number | null;
  categories: string[];
  properties: { group: string; value: string }[];
  cover_url: string | null;
  last_synced: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  async function loadProducts() {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
    if (data.length > 0) {
      setLastSynced(data[0].last_synced);
    }
    setLoading(false);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await fetch('/api/refresh', { method: 'POST' });
    // Kurz warten damit n8n Zeit zum Sync hat
    await new Promise(r => setTimeout(r, 8000));
    await loadProducts();
    setRefreshing(false);
  }

  useEffect(() => { loadProducts(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.product_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resterampe</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Produkte mit Restbestand 1–49 Stück
            </p>
          </div>
          <div className="flex items-center gap-4">
            {lastSynced && (
              <span className="text-xs text-gray-400">
                Zuletzt: {new Date(lastSynced).toLocaleString('de-DE')}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {refreshing ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Aktualisiere…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Aktualisieren
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Suchleiste + Zähler */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Nach Name oder Artikelnummer suchen…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {!loading && (
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {filtered.length} von {products.length} Produkten
          </span>
        )}
      </div>

      {/* Inhalt */}
      <main className="max-w-7xl mx-auto px-6 pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <svg className="animate-spin h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Lade Produkte…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            Keine Produkte gefunden.
          </div>
        ) : (
          <ProductTable products={filtered} />
        )}
      </main>
    </div>
  );
}
