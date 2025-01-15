import { ArrowPathIcon } from "@heroicons/react/24/outline";
import MyButton from "../components/MyButtons";
import SearchInput from "../components/SearchInput";
import Section from "../components/Section";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { getAuth } from "firebase/auth";
import { MySwal } from "../lib/swal";
import useLoading from "../hook/useLoading";

export default function RenterPengajuan() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function getDataFromDb() {
      try {
        const myid = getAuth().currentUser?.uid;
        if (!myid) {
          console.error("User not authenticated");
          return;
        }

        const q = query(
          collection(db, "pengajuansewa"),
          where("renterId", "==", myid)
        );

        const snapshot = await getDocs(q);

        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    if (data.length === 0) {
      getDataFromDb();
    }
  }, [data]);

  return (
    <Section heading={"Pengajuan Unit Sewa"}>
      <div className="w-full flex flex-row gap-4 flex-wrap mb-4">
        <SearchInput label="Cari Unit" callback={(e) => console.log(e)} />
        <MyButton
          text=""
          type="tertiary"
          className="text-center w-fit px-2 cursor-pointer"
          onClick={() => setData([])}
          icon={<ArrowPathIcon className="size-5" />}
        />
      </div>
      <div className="flex flex-wrap gap-6">
        {data.length > 0 ? (
          data.map((item, index) => {
            return <Card key={index} data={item} />;
          })
        ) : (
          <div className="w-full text-center text-body text-gray-600 italic">
            Tidak ada pengajuan
          </div>
        )}
      </div>
    </Section>
  );
}

interface CardProps {
  data: any;
}
const Card = ({ data }: CardProps) => {
  const [dataUnit, setDataUnit] = useState<any>();

  useEffect(() => {
    async function getUnitFromDb() {
      try {
        const snapshot = await getDoc(doc(db, "unitsewa", data.unitId));
        const newData = snapshot.data();
        setDataUnit(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getUnitFromDb();
  }, []);

  async function stopKontrak() {
    try {
      useLoading(true);

      // Tampilkan konfirmasi
      const res = await MySwal.fire({
        title: "Konfirmasi",
        text: "Apakah anda yakin ingin membatalkan kontrak ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, batalkan",
        cancelButtonText: "Batal",
      });

      if (!res.isConfirmed) {
        return;
      }

      // Query untuk mendapatkan semua dokumen pengajuan yang sesuai
      const qPengajuanSewa = query(
        collection(db, "pengajuansewa"),
        where("unitId", "==", data.unitId)
      );
      const querySnapshot = await getDocs(qPengajuanSewa);

      // Update status pengajuan ke "PUTUS KONTRAK"
      const updatePromises = querySnapshot.docs.map((docSnapshot) =>
        updateDoc(docSnapshot.ref, { status: "PUTUS KONTRAK" })
      );
      await Promise.all(updatePromises);

      // Update data unit sewa
      const unitRef = doc(db, "unitsewa", data.unitId);
      await updateDoc(unitRef, {
        status: "TERSEDIA",
        renterId: "", // Pastikan menggunakan field yang benar di database
      });

      // Tampilkan pesan sukses
      MySwal.fire("Berhasil!", "Kontrak telah dibatalkan.", "success");
    } catch (err) {
      console.error("Error membatalkan kontrak:", err);
      MySwal.fire(
        "Gagal!",
        "Terjadi kesalahan saat membatalkan kontrak.",
        "error"
      );
    } finally {
      useLoading(false);
    }
  }

  return (
    <div className="w-full max-w-80 block rounded-lg p-4 shadow-sm hover:shadow-lg border border-slate-400">
      <img
        alt=""
        src={dataUnit?.image}
        className="h-56 w-full rounded-md object-cover"
      />
      <div className="mt-2">
        <dl>
          <div>
            <dt className="sr-only">Price</dt>
            <dd className="text-sm text-gray-500 text-center">
              {dataUnit?.harga}
            </dd>
          </div>
          <div>
            <dt className="sr-only">Address</dt>
            <dd className="font-medium my-3 text-center">{dataUnit?.nama}</dd>
          </div>
        </dl>

        <div className="flex items-center justify-center gap-8 text-xs">
          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <svg
              className="size-4 text-indigo-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              />
            </svg>

            <div className="mt-1.5 sm:mt-0">
              <p className="text-gray-500">Jenis</p>
              <p className="font-medium">{dataUnit?.kategori}</p>
            </div>
          </div>

          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <svg
              className="size-4 text-indigo-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>

            <div className="mt-1.5 sm:mt-0">
              <p className="text-gray-500">Dimensi</p>
              <p className="font-medium">{dataUnit?.dimensi}</p>
            </div>
          </div>

          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <svg
              className="size-4 text-indigo-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
            <div className="mt-1.5 sm:mt-0">
              <p className="text-gray-500">Status</p>
              <p className="font-medium">{dataUnit?.status}</p>
            </div>
          </div>
        </div>
      </div>
      <StatusMessage status={data?.status} stopKontrak={stopKontrak} />
    </div>
  );
};

const StatusMessage = ({
  status,
  stopKontrak,
}: {
  status: string;
  stopKontrak: Function;
}) => {
  if (status === "PENDING") {
    return (
      <div className="mt-4 text-center py-3 bg-gray-600 text-white rounded-md">
        Menunggu Konfirmasi
      </div>
    );
  } else if (status === "APPROVED") {
    return (
      <>
        <div className="mt-4 text-center py-3 bg-green-600 text-white rounded-md">
          Pengajuan Diterima
        </div>
        <MyButton
          type="delete"
          text="Putus Kontrak Sewa"
          className="w-full flex justify-center my-4"
          onClick={() => stopKontrak()}
        />
      </>
    );
  } else if (status === "REJECTED") {
    return (
      <div className="mt-4 text-center py-3 bg-red-600 text-white rounded-md">
        Pengajuan Ditolak
      </div>
    );
  } else if (status === "PUTUS KONTRAK") {
    return (
      <div className="mt-4 text-center py-3 bg-gray-500 text-white rounded-md">
        Kontrak Sewa Berakhir
      </div>
    );
  }
};
