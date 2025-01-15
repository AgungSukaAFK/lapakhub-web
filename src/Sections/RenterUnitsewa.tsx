import { ArrowPathIcon } from "@heroicons/react/24/outline";
import MyButton from "../components/MyButtons";
import Section from "../components/Section";
import SearchInput from "../components/SearchInput";
import { Dispatch, useEffect, useState } from "react";
import Modal from "../components/Modal";
import Divider from "../components/Divider";
import { MySwal } from "../lib/swal";
import useLoading from "../hook/useLoading";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { getAuth } from "firebase/auth";
import { PengajuanSewaType } from "../types/Model";

interface UnitModel {
  nama: string;
  ownerId: string;
  renterId: string;
  image: string;
  deskripsi: string;
  harga: string;
  kategori: string;
  alamat: string;
  status: string;
  dimensi: string;
}

export default function RenterUnitsewa() {
  const [detailData, setDetailData] = useState<any>();
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    async function getDataFromDb() {
      try {
        const currentUserUid = getAuth().currentUser?.uid;
        if (!currentUserUid) {
          console.error("User not authenticated");
          return;
        }

        const validStatus = ["TERSEDIA"];
        const usersSnapshot = await getDocs(
          query(collection(db, "unitsewa"), where("status", "in", validStatus))
        );

        const unitsewa = usersSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...(doc.data() as UnitModel & { createdAt: number }),
          }))
          .sort((a, b) => b.createdAt - a.createdAt);
        setData(unitsewa);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    }

    if (data.length === 0) getDataFromDb();
  }, [data]);

  return (
    <Section heading={"Manajemen Unit Sewa"}>
      {detailData && <ModalDetail setModal={setDetailData} data={detailData} />}
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
      <div className="flex flex-wrap gap-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {data &&
          data.map((item: any, index: number) => {
            return <Card key={index} {...item} setDetailData={setDetailData} />;
          })}
      </div>
    </Section>
  );
}

interface CardProps {
  harga: string;
  alamat: string;
  kategori: string;
  deskripsi: string;
  image: string;
  nama: string;
  status: string;
  dimensi: string;
  key: number;
  setDetailData: Dispatch<React.SetStateAction<any>>;
}

const Card = (props: CardProps) => {
  return (
    <div
      key={props.key}
      className="w-full max-w-80 block rounded-lg p-4 shadow-sm hover:shadow-lg border border-slate-400"
    >
      <img
        alt=""
        src={props.image}
        className="h-56 w-full rounded-md object-cover"
      />
      <div className="mt-2">
        <dl>
          <div>
            <dt className="sr-only">Price</dt>
            <dd className="text-sm text-gray-500 text-center">{props.harga}</dd>
          </div>
          <div>
            <dt className="sr-only">Address</dt>
            <dd className="font-medium my-3 text-center">{props.nama}</dd>
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
              <p className="font-medium">{props.kategori}</p>
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
              <p className="font-medium">{props.dimensi}</p>
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
              <p className="font-medium">{props.status}</p>
            </div>
          </div>
        </div>
      </div>
      <MyButton
        type="tertiary"
        className="mt-4 w-full text-center"
        text="Lihat Detail"
        onClick={() => props.setDetailData(props)}
      />
    </div>
  );
};

const ModalDetail = ({
  setModal,
  data,
}: {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
}) => {
  const [arrayFromData, setArrayFromData] = useState<any>([
    [data.image, "Gambar"],
    [data.nama, "Nama"],
    [data.ownerId, "Pemilik Unit"],
    [data.renterId, "Penyewa Unit"],
    [data.harga, "Harga Sewa (perbulan)"],
    [data.dimensi, "Dimensi"],
    [data.deskripsi, "Deskripsi"],
    [data.alamat, "Alamat"],
    [new Date(data.createdAt).toLocaleDateString("id-ID"), "Tanggal dibuat"],
    [data.status, "Status"],
  ]);

  const [bisaDisewa, setBisaDisewa] = useState(false);
  useEffect(() => {
    const renterId = getAuth().currentUser?.uid;

    if (!renterId) {
      window.location.href = "/login";
      return;
    }

    const pengajuanCheck = async () => {
      try {
        const q = query(
          collection(db, "pengajuansewa"),
          where("unitId", "==", data.id),
          where("renterId", "==", renterId),
          where("ownerId", "==", data.ownerId)
        );

        const pengajuanSnapshot = await getDocs(q);

        // Cek jika ada dokumen dengan status selain "PUTUS KONTRAK"
        const validPengajuan = pengajuanSnapshot.docs.some(
          (doc) =>
            doc.data().status !== "PUTUS KONTRAK" &&
            doc.data().status !== "REJECTED"
        );

        if (validPengajuan) {
          setBisaDisewa(false); // Jika ada pengajuan aktif, tidak bisa disewa
        } else {
          setBisaDisewa(true); // Jika tidak ada atau semua pengajuan "PUTUS KONTRAK", bisa disewa
        }
      } catch (error) {
        console.error("Error checking pengajuan:", error);
        setBisaDisewa(false); // Default tidak bisa disewa jika terjadi error
      }
    };

    pengajuanCheck();
  }, [data]);

  useEffect(() => {
    if (arrayFromData.length > 0) {
      const idIndex = arrayFromData.findIndex(
        (item: any) => item[1] === "Pemilik Unit"
      );
      const id = arrayFromData[idIndex][0];

      getUser(id).then((user) => {
        if (!user) {
          return false;
        }
        let copy = [...arrayFromData];
        copy[idIndex] = [user?.name, "Pemilik Unit"];
        setArrayFromData(copy);
      });
    }

    async function getUser(id: string) {
      const userSnapshot = await getDoc(doc(db, "users", id));
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        return userData;
      }
      return false;
    }
  }, [arrayFromData]);

  function ajukanSewa() {
    MySwal.fire({
      icon: "question",
      title: "Konfirmasi",
      text: "Yakin mengajukan sewa untuk unit ini?",
      showConfirmButton: true,
      confirmButtonText: "Ya, ajukan",
      cancelButtonText: "Tidak",
      showCancelButton: true,
    }).then(async (confirmation) => {
      if (confirmation.isConfirmed) {
        try {
          useLoading(true);
          let renterId = getAuth().currentUser?.uid;
          if (!renterId) {
            window.location.href = "/login";
            return;
          }
          let pengajuanSewa: PengajuanSewaType = {
            ownerId: data.ownerId,
            unitId: data.id,
            renterId: renterId,
            status: "PENDING",
            createdAt: new Date().getTime(),
            closedAt: 0,
          };
          await addDoc(collection(db, "pengajuansewa"), pengajuanSewa);
          MySwal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Sewa unit ini sedang diproses",
            showConfirmButton: true,
            confirmButtonText: "Oke",
          });
        } catch {
          MySwal.fire("Error", "Gagal mengajukan sewa", "error");
        } finally {
          useLoading(false);
          setModal(false);
        }
      }
    });
    console.log(data);
    console.log("Hellloo");
  }

  return (
    <Modal>
      <div className="w-[90%] max-h-[90vh] max-w-xl bg-white px-6 py-4 rounded-sm flex flex-col gap-4 overflow-auto">
        <Divider text="Detail Unit Sewa" className="mb-4" />
        <dl className="-my-3 divide-y divide-gray-100 text-sm mb-4">
          {arrayFromData.map((item: any, index: number) => {
            if (item[1] === "Gambar") {
              return (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-1 sm:gap-4"
                >
                  <img
                    src={item[0]}
                    alt={item[1]}
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                </div>
              );
            }

            return (
              <div
                key={index}
                className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4"
              >
                <dt className="font-medium text-gray-900">{item[1]}</dt>
                <dd className="text-gray-700 sm:col-span-2">{item[0]}</dd>
              </div>
            );
          })}
        </dl>

        {bisaDisewa ? (
          <MyButton
            type="primary"
            text="Ajukan Sewa"
            onClick={ajukanSewa}
            className=" py-5 flex items-center justify-center"
          />
        ) : (
          <MyButton
            type="disabled"
            text="Sudah melakukan pengajuan"
            onClick={ajukanSewa}
            className=" py-5 flex items-center justify-center"
          />
        )}

        <MyButton
          type="tertiary"
          text="Kembali"
          onClick={() => setModal(false)}
          className="mb-4 text-center"
        />
      </div>
    </Modal>
  );
};
