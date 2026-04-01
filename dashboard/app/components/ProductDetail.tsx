import { Product } from '../page';

export default function ProductDetail({ product, onClose }: { product: Product; onClose: () => void }) {
  const grouped = product.properties.reduce((acc, p) => {
    if (!acc[p.group]) acc[p.group] = [];
    acc[p.group].push(p.value);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-gray-100">
          {product.cover_url ? (
            <img
              src={product.cover_url}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center text-gray-300 text-3xl">
              📦
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 leading-tight">{product.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{product.product_number}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-medium text-gray-700">
                {product.stock} Stück
              </span>
              {product.price !== null && (
                <span className="text-sm text-gray-500">
                  {product.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Kategorien */}
        {product.categories.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Kategorien</p>
            <div className="flex flex-wrap gap-1.5">
              {product.categories.map(cat => (
                <span key={cat} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Eigenschaften */}
        {Object.keys(grouped).length > 0 ? (
          <div className="px-6 py-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Eigenschaften</p>
            <div className="space-y-3">
              {Object.entries(grouped).map(([group, values]) => (
                <div key={group}>
                  <p className="text-xs text-gray-500 mb-1">{group}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {values.map(val => (
                      <span key={val} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">
                        {val}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-6 py-4 text-sm text-gray-400">
            Keine Eigenschaften vorhanden.
          </div>
        )}
      </div>
    </div>
  );
}
