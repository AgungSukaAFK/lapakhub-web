import { HTMLInputTypeAttribute } from "react";

interface FloatingInputProps {
  label: string;
  name: string;
  type?: HTMLInputTypeAttribute;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
  value?: string;
  className?: string;
}

export default function FloatingInput({
  label,
  type = "text",
  name,
  onChange,
  value,
  className,
}: FloatingInputProps) {
  return (
    <label
      htmlFor={name}
      className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
    >
      <input
        type={type}
        id={name}
        className={`${className} w-full peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-2 px-4 text-body`}
        placeholder={name}
        value={value || ""}
        onChange={onChange}
      />

      <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
        {label}
      </span>
    </label>
  );
}
