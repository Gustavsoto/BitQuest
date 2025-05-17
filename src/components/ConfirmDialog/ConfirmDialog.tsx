import { useEffect, useState } from "react";
import { IConfirmDialogProps } from "../../interfaces/interfaces.props";

export default function ConfirmDialog(props: IConfirmDialogProps) {
  const { message, onAccept, onDeny, coinName, action, payout } = props;
  const [show, setShow] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  const handleClose = (confirmed: boolean) => {
    setShow(false);
    setTimeout(() => {
      return confirmed ? onAccept() : onDeny();
    }, 200);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-200">
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl transform transition-all duration-200 max-w-md w-full ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <p className="text-lg text-center font-medium text-gray-800 dark:text-gray-100 leading-relaxed mb-6">
          {message}
        </p>

        {(coinName || action || payout) && (
          <div
            className={`flex justify-between items-center rounded-lg p-4 mb-6 border ${
              action === "buy"
                ? "bg-green-200 dark:bg-green-800 border-green-500 text-gray-800 dark:text-gray-100"
                : "bg-red-200 dark:bg-red-700 border-red-500 text-gray-800 dark:text-gray-100"
            }`}
          >
            {coinName && <p className="font-semibold truncate">{coinName}</p>}
            <div className="flex items-center gap-2 text-right">
              {action && <p className="capitalize font-semibold">{action}</p>}
              {payout && <p className="font-semibold">@ {payout}</p>}
            </div>
          </div>
        )}
        <div className="flex justify-between mt-2">
          <button
            onClick={() => handleClose(true)}
            className="px-5 py-2.5 w-45 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition duration-150"
          >
            Yes
          </button>
          <button
            onClick={() => handleClose(false)}
            className="px-5 py-2.5 w-45 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition duration-150"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
