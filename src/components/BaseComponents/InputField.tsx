import { ChangeEvent } from "react";
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

  const { t } = useTranslation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
        className={`p-3 rounded-2xl bg-white dark:bg-gray-700 placeholder-gray-800 dark:placeholder-white border disabled:opacity-50`}
      />
    </div>
  );
};
