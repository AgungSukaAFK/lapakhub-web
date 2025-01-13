import { HomeIcon } from "@heroicons/react/24/outline";

interface BreadcrumbProps {
  path?: string[];
}

export default function Breadcrumb({ path }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol className="flex overflow-hidden rounded-lg border border-gray-200 text-gray-600 ">
        <li className="flex items-center">
          <a
            href="#"
            className="flex h-10 items-center gap-1.5 bg-gray-100 px-4 transition hover:text-gray-900"
          >
            <HomeIcon className="size-5 text-slate-800 hover:text-gray-900" />

            <span className="ms-1.5 font-medium text-slate-800 hover:text-gray-900 text-body">
              
              Dashboard
            </span>
          </a>
        </li>

        {path?.map((p, i) => {
          return (
            <li key={i} className="relative flex items-center">
              <span className="absolute inset-y-0 -start-px h-10 w-4 bg-gray-100 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)] rtl:rotate-180"></span>
              <a
                href="#"
                className="flex h-10 text-slate-800 items-center bg-white pe-4 ps-8 font-medium transition hover:text-gray-900 text-body"
              >
                {p}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
