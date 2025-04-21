export interface TutorialItemProps {
  title: string;
  description: string;
  stepsDone: number;
  totalSteps: number;
  content: string;
  onClick: () => void; // Define the onClick function type (it's a function with no arguments and no return value)
}

export const TutorialItem = ({
  title,
  description,
  stepsDone,
  totalSteps,
  onClick,
}: TutorialItemProps) => {
  // Safely calculate progress, making sure it doesn't go beyond 100% or below 0%
  const progress =
    totalSteps > 0 ? Math.min((stepsDone / totalSteps) * 100, 100) : 0;

  return (
    <div
      onClick={onClick} // Makes it clickable
      className="bg-gray-200 dark:bg-gray-700 rounded-2xl shadow-lg p-4 flex gap-4 items-center hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
    >
      <div className="w-16 h-16 bg-gray-800 dark:bg-gray-100 rounded-xl flex items-center justify-center text-gray-100 dark:text-gray-800 font-bold text-sm">
        Img {/* Placeholder for your image */}
      </div>
      <div className="flex-1">
        <h3 className="text-gray-800 dark:text-gray-100 text-lg font-semibold">
          {title}
        </h3>
        <p className="dark:text-gray-200 text-gray-600 text-sm mb-2">
          {description}
        </p>
        <div className="w-full h-3 relative">
          <div className="absolute w-full h-full bg-gray-300 rounded-full" />
          <div
            className="absolute h-full bg-green-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
