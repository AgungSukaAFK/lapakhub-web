interface SectionProps {
  children?: React.ReactNode;
  heading?: String;
  className?: String;
}

export default function Section({
  children,
  heading,
  className,
}: SectionProps) {
  return (
    <section
      className={`${className} w-full bg-white shadow-md py-4 px-4 flex flex-col rounded-md`}
    >
      {heading && (
        <p className="sm:text-lg md:text-xl lg:text-2xl xl:text-3xl pb-2 font-bold border-b border-b-black mb-2">
          {heading}
        </p>
      )}
      {children}
    </section>
  );
}
