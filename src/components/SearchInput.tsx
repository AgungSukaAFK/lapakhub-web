import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

interface SearchInputProps {
  label?: string;
  callback: (e: string) => void;
}

export default function SearchInput({
  label = "Cari ...",
  callback,
}: SearchInputProps) {
  const [input, setInput] = useState<string>("");
  const listenerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        document.activeElement === listenerRef.current &&
        listenerRef.current
      ) {
        callback(listenerRef.current.value);
      }
    };

    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [listenerRef]);
  return (
    <div className="relative">
      <label htmlFor="Search" className="sr-only">
        {" "}
        Search{" "}
      </label>

      <input
        type="text"
        id="Search"
        placeholder={label}
        onChange={(e) => setInput(e.target.value)}
        ref={listenerRef}
        className="w-full rounded-md py-2.5 pe-10 shadow-sm sm:text-sm px-6 border border-black"
      />

      <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
        <button type="button" className="text-gray-600 hover:text-gray-700">
          <span className="sr-only">Search</span>
          <MagnifyingGlassIcon
            className="size-5"
            onClick={() => callback(input)}
          />
        </button>
      </span>
    </div>
  );
}
