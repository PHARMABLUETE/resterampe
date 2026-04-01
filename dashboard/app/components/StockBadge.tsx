export default function StockBadge({ stock }: { stock: number }) {
  const color =
    stock <= 9
      ? 'bg-red-100 text-red-700 ring-red-200'
      : stock <= 19
      ? 'bg-orange-100 text-orange-700 ring-orange-200'
      : 'bg-yellow-100 text-yellow-700 ring-yellow-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold ring-1 ${color}`}>
      {stock} Stück
    </span>
  );
}
