export const SellPanelShimmer = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
      <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mt-6" />
      <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mt-2" />
      <div className="h-10 bg-red-300 dark:bg-red-600 rounded mt-4" />
    </div>
  );
};
