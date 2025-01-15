interface ButtonProps {
  type: "primary" | "secondary" | "tertiary" | "delete" | "disabled";
  text: string;
  className?: string;
  onClick?: () => void;
  icon?: JSX.Element;
  disabled?: boolean;
}

export default function MyButton({
  type = "primary",
  onClick,
  text,
  className,
  icon,
  disabled,
}: ButtonProps) {
  switch (type) {
    case "secondary":
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className={`${className} inline-block rounded border border-indigo-600 px-4 py-2 bg-indigo-600 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500`}
        >
          {icon} {text}
        </button>
      );
    case "tertiary":
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className={`${className} inline-block rounded border border-indigo-600 px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500`}
        >
          {icon} {text}
        </button>
      );
    case "delete":
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className={`${className} group relative inline-block overflow-hidden border border-red-600 px-4 py-2 focus:outline-none focus:ring`}
        >
          <span className="absolute inset-y-0 left-0 w-[2px] bg-red-600 transition-all group-hover:w-full group-active:bg-red-500"></span>

          <span className="relative text-sm font-medium text-red-600 transition-colors group-hover:text-white flex flex-row gap-4">
            {icon} {text}
          </span>
        </button>
      );
    case "disabled":
      return (
        <button
          disabled
          className={`${className} inline-block rounded border border-gray-600 px-12 py-3 text-sm font-medium text-white bg-gray-600 hover:text-white focus:outline-none focus:ring active:bg-gray-500`}
        >
          {icon} {text}
        </button>
      );
    default:
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className={`${className} group relative inline-block overflow-hidden border border-indigo-600 px-4 py-2 focus:outline-none focus:ring`}
        >
          <span className="absolute inset-y-0 left-0 w-[2px] bg-indigo-600 transition-all group-hover:w-full group-active:bg-indigo-500"></span>

          <span className="relative text-sm font-medium text-indigo-600 transition-colors group-hover:text-white flex flex-row gap-4">
            {icon} {text}
          </span>
        </button>
      );
  }
}
