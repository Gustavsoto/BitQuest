export const PortfolioItemSkeleton = () => {
  // Šhimeris
  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md animate-pulse">
      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600" />

      <div className="flex flex-1 gap-4">
        <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>

      <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
    </div>
  );
};
