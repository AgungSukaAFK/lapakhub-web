interface ButtonProps {
  type: "primary" | "secondary";
  text: string;
  className?: string;
  onClick?: () => void;
}

export default function MyButton({
  type = "primary",
  onClick,
  text,
  className,
}: ButtonProps) {
  switch (type) {
    case "secondary":
      return (
        <a
          onClick={onClick}
          className={`${className} inline-block rounded border border-indigo-600 px-4 py-2 bg-indigo-600 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500`}
          href="#"
        >
          {text}
        </a>
      );
    default:
      return (
        <a
          onClick={onClick}
          className="group relative inline-block overflow-hidden border border-indigo-600 px-4 py-2 focus:outline-none focus:ring"
          href="#"
        >
          <span className="absolute inset-y-0 left-0 w-[2px] bg-indigo-600 transition-all group-hover:w-full group-active:bg-indigo-500"></span>

          <span className="relative text-sm font-medium text-indigo-600 transition-colors group-hover:text-white">
            {text}
          </span>
        </a>
      );
  }
}
