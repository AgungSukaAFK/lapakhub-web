import {
  ArrowPathRoundedSquareIcon,
  BanknotesIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentIcon,
  HomeIcon,
  IdentificationIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import MyButton from "../components/MyButtons";
import Breadcrumb from "../components/Breadcrumb";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { MySwal } from "../lib/swal";
import useLoading from "../hook/useLoading";
import { RoleType } from "../types/Role";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  header?: string;
  role: RoleType;
}

export default function DashboardLayout({
  children,
  header = "LapakHub: Manajemen Sewa Ruko dan Lapak",
  role,
}: DashboardLayoutProps) {
  const signOutButton = async () => {
    try {
      MySwal.fire({
        icon: "question",
        title: "Logout?",
        text: "Anda yakin ingin keluar?",
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak",
      }).then((result) => {
        if (result.isConfirmed) {
          useLoading(true);
          signOut(auth)
            .then(() => {
              useLoading(false);
              MySwal.fire({
                icon: "success",
                title: "Logout berhasil!",
                text: "Anda akan dialihkan ke halaman login",
                confirmButtonText: "OK",
              }).then(() => {
                window.location.href = "/login";
              });
            })
            .catch(() => {
              MySwal.fire({
                icon: "error",
                title: "Logout gagal!",
                text: "Silahkan coba lagi",
                confirmButtonText: "OK",
              });
            });
        }
      });
    } catch {
      MySwal.fire({
        icon: "error",
        title: "Logout gagal!",
        text: "Silahkan coba lagi",
        confirmButtonText: "OK",
      });
    }
  };

  const menuByRole = (role: RoleType) => {
    if (role === "admin") {
      return [
        {
          name: "Provider",
          path: "/dashboard/provider",
          icon: <UserGroupIcon className="size-5" />,
        },
        {
          name: "Renter",
          path: "/dashboard/renter",
          icon: <UserIcon className="size-5" />,
        },
        {
          name: "Unit Sewa",
          path: "/dashboard/unitsewa",
          icon: <BuildingStorefrontIcon className="size-5" />,
        },
        {
          name: "Akun",
          path: "/dashboard/akun",
          icon: <IdentificationIcon className="size-5" />,
        },
        {
          name: "Laporan",
          path: "/dashboard/laporan",
          icon: <ClipboardDocumentIcon className="size-5" />,
        },
      ];
    } else if (role === "provider") {
      return [
        {
          name: "Unit Sewa",
          path: "/dashboard/unitsewa",
          icon: <BuildingStorefrontIcon className="size-5" />,
        },
        {
          name: "Pengajuan Sewa",
          path: "/dashboard/pengajuan",
          icon: <ArrowPathRoundedSquareIcon className="size-5" />,
        },
        {
          name: "Tagihan Sewa",
          path: "/dashboard/tagihan",
          icon: <BanknotesIcon className="size-5" />,
        },
        {
          name: "Akun",
          path: "/dashboard/akun",
          icon: <IdentificationIcon className="size-5" />,
        },
        {
          name: "Laporan",
          path: "/dashboard/laporan",
          icon: <ClipboardDocumentIcon className="size-5" />,
        },
      ];
    } else if (role === "renter") {
      return [
        {
          name: "Unit Sewa",
          path: "/dashboard/unitsewa",
          icon: <BuildingStorefrontIcon className="size-5" />,
        },
        {
          name: "Pengajuan Sewa",
          path: "/dashboard/pengajuan",
          icon: <ArrowPathRoundedSquareIcon className="size-5" />,
        },
        {
          name: "Tagihan Sewa",
          path: "/dashboard/tagihan",
          icon: <BanknotesIcon className="size-5" />,
        },
        {
          name: "Akun",
          path: "/dashboard/akun",
          icon: <IdentificationIcon className="size-5" />,
        },
        {
          name: "Laporan",
          path: "/dashboard/laporan",
          icon: <ClipboardDocumentIcon className="size-5" />,
        },
      ];
    }
  };

  return (
    <div className="flex w-full bg-slate-100 h-screen overflow-hidden fixed top-0 left-0">
      {/* Sidebar */}
      <div className="flex border-r border-r-black h-screen drop-shadow-md w-16 flex-col justify-between border-e bg-white">
        <div>
          <div className="inline-flex size-16 items-center justify-center">
            <span className="grid size-10 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
              <img src="/logo-small.png" alt="Logo" />
            </span>
          </div>
          <div className="border-t border-gray-100">
            <div className="px-2">
              <div className="py-4">
                <a
                  href="/dashboard"
                  className="t group relative flex justify-center rounded bg-blue-50 px-2 py-1.5 text-blue-700"
                >
                  <HomeIcon className="size-5" />
                  <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                    Dashboard
                  </span>
                </a>
              </div>
              <ul className="space-y-1 border-t border-gray-100 pt-4">
                {menuByRole(role)?.map((m, i) => (
                  <li key={i}>
                    <a
                      href={m.path}
                      className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    >
                      {m.icon}
                      <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                        {m.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
          <form action="#">
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 opacity-75"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                Logout
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Header & Content */}
      <div className="flex flex-col w-full">
        <div className="bg-white text-slate-800 h-16 w-full border-b border-b-black box-border flex flex-row items-center justify-between px-4">
          <span>{header}</span>
          <span>
            <MyButton
              type="primary"
              text="Logout"
              className="h-10"
              onClick={signOutButton}
            />
          </span>
        </div>
        <div className="flex flex-col gap-4 container mx-auto mt-6 rounded-md px-4 h-full overflow-y-auto">
          <Breadcrumb />
          {children}
        </div>
      </div>
    </div>
  );
}
