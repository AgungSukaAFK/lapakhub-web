import { HomeIcon } from "@heroicons/react/24/outline";
import MyButton from "../components/MyButtons";
import Breadcrumb from "../components/Breadcrumb";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth"
import { MySwal } from "../lib/swal";
import useLoading from "../hook/useLoading";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  header?: string;
}

export default function DashboardLayout({
  children,
  header = "Dashboard",
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
        if(result.isConfirmed){
          useLoading(true)
          signOut(auth).then(() => {
            useLoading(false)
            MySwal.fire({
              icon: "success",
              title: "Logout berhasil!",
              text: "Anda akan dialihkan ke halaman login",
              confirmButtonText: "OK",
            }).then(() => {
              window.location.href = "/login"
            })
          }).catch(() => {
            MySwal.fire({
              icon: "error",
              title: "Logout gagal!",
              text: "Silahkan coba lagi",
              confirmButtonText: "OK"
          })})
        }
      })
    } catch {
      MySwal.fire({
        icon: "error",
        title: "Logout gagal!",
        text: "Silahkan coba lagi",
        confirmButtonText: "OK",
      })  
    }
  }

  return (
    <div className="flex h-screen w-full bg-slate-100">
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
                  href="#"
                  className="t group relative flex justify-center rounded bg-blue-50 px-2 py-1.5 text-blue-700"
                >
                  <HomeIcon className="size-5" />

                  <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                    Dashboard
                  </span>
                </a>
              </div>

              <ul className="space-y-1 border-t border-gray-100 pt-4">
                <li>
                  <a
                    href="#"
                    className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>

                    <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                      Teams
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
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
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>

                    <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                      Billing
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
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
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>

                    <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                      Invoices
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>

                    <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                      Account
                    </span>
                  </a>
                </li>
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

      {/* Header & Content*/}
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="bg-white text-slate-800 h-16 w-full border-b border-b-black box-border flex flex-row items-center justify-between px-4">
          <span>{header}</span>
          <span>
            <MyButton type="primary" text="Logout" className="h-10" onClick={signOutButton} />
          </span>
        </div>
        <div className="flex flex-col gap-4 container mx-auto mt-6 rounded-md">
          <Breadcrumb path={["users"]} />
          {children}
        </div>
      </div>
    </div>
  );
}
