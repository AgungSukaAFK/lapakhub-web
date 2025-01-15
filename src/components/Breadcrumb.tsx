import { HomeIcon } from "@heroicons/react/24/outline";

interface BreadcrumbProps {
  basePath?: string;
}

export default function Breadcrumb({
  basePath = "Dashboard",
}: BreadcrumbProps) {
  // Ambil path dari URL aktif
  const pathArray = window.location.pathname
    .split("/")
    .filter((segment) => segment); // Hapus segmen kosong

  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol className="flex overflow-hidden rounded-lg border border-gray-200 text-gray-600">
        {/* Home / Base Path */}
        <li className="flex items-center">
          <a
            href="/dashboard"
            className="flex h-10 items-center gap-1.5 bg-gray-100 px-4 transition hover:text-gray-900"
          >
            <HomeIcon className="size-5 text-slate-800 hover:text-gray-900" />
            <span className="ms-1.5 font-medium text-slate-800 hover:text-gray-900 text-body">
              {basePath}
            </span>
          </a>
        </li>

        {/* Dynamic Path */}
        {pathArray.map((segment, index) => {
          const isLast = index === pathArray.length - 1; // Elemen terakhir
          const href = "/" + pathArray.slice(0, index + 1).join("/"); // Buat URL setiap segment

          if (segment === "dashboard") {
            return null;
          }
          return (
            <li key={index} className="relative flex items-center">
              <span className="absolute inset-y-0 -start-px h-10 w-4 bg-gray-100 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)] rtl:rotate-180"></span>
              <a
                href={isLast ? undefined : href} // Nonaktifkan tautan untuk elemen terakhir
                className={`flex h-10 text-slate-800 items-center ${
                  isLast ? "font-bold" : "font-medium"
                } bg-white pe-4 ps-8 transition ${
                  isLast ? "text-gray-900" : "hover:text-gray-900 text-body"
                }`}
                aria-current={isLast ? "page" : undefined}
              >
                {segment.charAt(0).toUpperCase() + segment.slice(1)}{" "}
                {/* Format Capitalize */}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
