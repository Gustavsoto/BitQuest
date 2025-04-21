import { ChangeEvent, useState } from "react";
import { IInputFieldProps } from "../../interfaces/interfaces.props";
import { useTranslation } from "react-i18next";

export const InputField = (props: IInputFieldProps) => {
  const {
    value,
    placeholder,
    onChange,
    type = "text",
    label,
    disabled = false,
    numberMode,
    maxValue,
  } = props;

  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (type === "number") {
      if (val === "") {
        setError(null);
        onChange(e);
        return;
      }

      const parsed = Number(val);

      if (isNaN(parsed)) {
        setError("Invalid number");
        return;
      }

      if (parsed < 0) {
        setError("Value cannot be less than 0");
        return;
      }

      if (numberMode === "int" && !Number.isInteger(parsed)) {
        setError("Only whole numbers allowed");
        return;
      }

      if (maxValue !== undefined && parsed > maxValue) {
        setError(`Value cannot exceed ${maxValue}`);
        return;
      }

      setError(null);
    }

    onChange(e);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t(label)}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={t(placeholder)}
        disabled={disabled}
        step={type === "number" && numberMode === "float" ? "any" : "1"}
        max={maxValue}
        className={`p-3 rounded-2xl bg-white dark:bg-gray-700 placeholder-gray-800 dark:placeholder-white border ${
          error
            ? "border-red-500 dark:border-red-400"
            : "border-gray-200 dark:border-gray-700"
        }`}
      />
      {error && (
        <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
      )}
    </div>
  );
};
