const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
    <div className="h-2 bg-gray-100 rounded w-full mb-2" />
    <div className="h-2 bg-gray-100 rounded w-3/4" />
  </div>
);

export default SkeletonCard;