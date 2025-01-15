export default function Divider({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className="relative flex justify-center">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

      <span
        className={`${className} relative z-10 bg-white px-6 font-bold text-lg`}
      >
        {text}
      </span>
    </span>
  );
}
