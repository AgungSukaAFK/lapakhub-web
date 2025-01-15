import { ChangeEventHandler } from "react";

interface SelectInputProps {
  header: string;
  placeholder: string;
  options: OptionType[];
  className?: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
}

interface OptionType {
  value: string;
  name: string;
}

export default function SelectInput({
  header,
  placeholder,
  options,
  className,
  onChange,
}: SelectInputProps) {
  return (
    <div>
      <label
        htmlFor="HeadlineAct"
        className="block text-sm font-medium text-gray-900"
      >
        {header}
      </label>

      <select
        name="HeadlineAct"
        id="HeadlineAct"
        onChange={onChange}
        className={`${className} mt-1.5 w-full py-2 px-4  rounded-lg border-gray-200 shadow-sm border text-gray-700 sm:text-sm`}
      >
        <option value="">{placeholder}</option>
        {options.map((item, index) => {
          return (
            <option key={index} value={item.value}>
              {item.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
