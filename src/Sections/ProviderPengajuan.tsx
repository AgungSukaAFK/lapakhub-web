import { ArrowPathIcon } from "@heroicons/react/24/outline";
import MyButton from "../components/MyButtons";
import SearchInput from "../components/SearchInput";
import Section from "../components/Section";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import Modal from "../components/Modal";
import Divider from "../components/Divider";
import SelectInput from "../components/SelectInput";
import { MySwal } from "../lib/swal";
import { createTagihan } from "../services/tagihan";
import useLoading from "../hook/useLoading";

export default function ProviderPengajuan() {
  const [data, setData] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [dataPengajuan, setDataPengajuan] = useState<any>();
  const [dataUnit, setDataUnit] = useState<any>();
  const [dataRenter, setDataRenter] = useState<any>();

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
          where("ownerId", "==", myid)
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

  function showDetailModal(dataPengajuan: any, dataUnit: any) {
    setShowModal(true);
    setDataPengajuan(dataPengajuan);
    setDataUnit(dataUnit);
    getDoc(doc(db, "users", dataPengajuan?.renterId)).then((doc) => {
      setDataRenter({ id: doc.id, ...doc.data() }); // data Renter
    });
  }

  return (
    <Section heading={"Pengajuan Unit Sewa"}>
      {showModal && (
        <ModalApproval
          setModal={setShowModal}
          dataPengajuan={dataPengajuan}
          dataRenter={dataRenter}
          dataUnit={dataUnit}
          refresh={() => setData([])}
        />
      )}
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
      <div className="flex flex-wrap gap-6 overflow-auto">
        {data.length > 0 ? (
          data.map((item, index) => {
            return (
              <Card key={index} data={item} showDetailModal={showDetailModal} />
            );
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
  showDetailModal: Function;
}
const Card = ({ data, showDetailModal }: CardProps) => {
  //   const [dataOwner, setDataOwner] = useState<any>();
  const [dataUnit, setDataUnit] = useState<any>();

  useEffect(() => {
    // async function getOwnerFromDb() {
    //   try {
    //     const q = query(
    //       collection(db, "users"),
    //       where("uid", "==", data.ownerId)
    //     );
    //     const snapshot = await getDocs(q);
    //     const newData = snapshot.docs.map((doc) => ({
    //       ...doc.data(),
    //     }));
    //     setDataOwner(newData[0]);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // }

    async function getUnitFromDb() {
      try {
        const snapshot = await getDoc(doc(db, "unitsewa", data.unitId));
        const newData = { id: snapshot.id, ...snapshot.data() };
        setDataUnit(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    // getOwnerFromDb();
    getUnitFromDb();
  }, []);

  return (
    <div className="w-full max-w-80 block rounded-lg p-4 shadow-sm hover:shadow-lg border border-slate-400">
      <img
        alt=""
        src={dataUnit?.image}
        className="h-56 w-full rounded-md object-cover"
      />
      <div className="my-2">
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
      {data?.status === "PENDING" && (
        <MyButton
          type="primary"
          text="Berikan Persetujuan"
          className="w-full flex justify-center my-4"
          onClick={() => showDetailModal(data, dataUnit)}
        />
      )}
      <StatusMessage status={data?.status} />
    </div>
  );
};

const StatusMessage = ({ status }: { status: string }) => {
  if (status === "PENDING") {
    return (
      <div className=" text-center py-1 text-sm bg-gray-600 text-white rounded-md">
        OPEN: Menunggu Konfirmasi
      </div>
    );
  } else if (status === "APPROVED") {
    return (
      <div className=" text-center py-1 text-sm bg-green-600 text-white rounded-md">
        CLOSED: Pengajuan Diterima
      </div>
    );
  } else if (status === "REJECTED") {
    return (
      <div className=" text-center py-1 text-sm bg-red-600 text-white rounded-md">
        CLOSED: Pengajuan Ditolak
      </div>
    );
  }
};

interface ModalApprovalProps {
  setModal: Dispatch<SetStateAction<boolean>>;
  refresh: Function;
  dataPengajuan: any;
  dataUnit: any;
  dataRenter: any;
}
const ModalApproval = ({
  setModal,
  dataPengajuan,
  dataUnit,
  dataRenter,
  refresh,
}: ModalApprovalProps) => {
  const [persetujuan, setPersetujuan] = useState<string>("");
  const [dataOwner, setDataOwner] = useState<any>();

  useEffect(() => {
    const getOwnerFromDb = async () => {
      if (dataPengajuan?.ownerId) {
        await getDoc(doc(db, "users", dataPengajuan.ownerId)).then((doc) => {
          const ownerData = doc.data();
          if (ownerData) {
            setDataOwner(ownerData);
          }
        });
      }
    };

    if (!dataOwner) {
      getOwnerFromDb();
    }
  }, [dataOwner]);

  async function handleSimpan() {
    try {
      useLoading(true);
      if (!persetujuan) {
        MySwal.fire("Gagal", "Persetujuan harus dipilih", "error");
        return;
      }

      if (persetujuan === "APPROVED") {
        // Setting pengajuan
        await updateDoc(doc(db, "pengajuansewa", dataPengajuan.id), {
          status: "APPROVED",
          closedAt: new Date().getTime(),
        });

        // Setting unit sewa
        await updateDoc(doc(db, "unitsewa", dataUnit?.id), {
          renterId: dataRenter?.id,
          status: "DISEWA",
        });
        // Generate Tagihan
        const tagihan = await createTagihan({
          jumlah: dataUnit?.harga,
          ownerId: dataPengajuan?.ownerId,
          renterId: dataRenter?.id,
          unitId: dataUnit?.id,
        });

        if (tagihan) {
          MySwal.fire("Berhasil", "Kontrak baru telah dibuat", "success");
          setModal(false);
          refresh();
        }
      } else if (persetujuan === "REJECTED") {
        await updateDoc(doc(db, "pengajuansewa", dataPengajuan.id), {
          status: "REJECTED",
          closedAt: new Date().getTime(),
        });

        MySwal.fire("Berhasil", "Pengajuan ditolak", "success");
        setModal(false);
        refresh();
      }
    } catch (error) {
      console.log(error);
    } finally {
      useLoading(false);
    }
  }

  return (
    <Modal>
      <div className="w-[90%] max-h-[90vh] max-w-lg bg-white px-6 py-4 rounded-sm flex flex-col gap-4 overflow-auto">
        <Divider text="Berikan Persetujuan" />
        <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
          <dl className="-my-3 divide-y divide-gray-100 text-sm">
            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Pemilik Unit</dt>
              <dd className="text-gray-700 sm:col-span-2">{dataOwner?.name}</dd>
            </div>

            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Calon Penyewa</dt>
              <dd className="text-gray-700 sm:col-span-2">
                {dataRenter?.name}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Tanggal Pengajuan</dt>
              <dd className="text-gray-700 sm:col-span-2">
                {new Date(dataPengajuan?.createdAt).toLocaleDateString("id-ID")}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Nama Unit</dt>
              <dd className="text-gray-700 sm:col-span-2">{dataUnit?.nama}</dd>
            </div>

            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Alamat Unit</dt>
              <dd className="text-gray-700 sm:col-span-2">
                {dataUnit?.alamat}
              </dd>
            </div>
          </dl>
        </div>
        <SelectInput
          header="Persetujuan"
          placeholder="Pilih Persetujuan"
          options={[
            { value: "APPROVED", name: "Setujui" },
            { value: "REJECTED", name: "Tolak" },
          ]}
          onChange={(e) => setPersetujuan(e.target.value)}
        />
        <MyButton
          type="primary"
          text="Simpan"
          onClick={handleSimpan}
          className="flex justify-center items-center"
        />
        <MyButton
          type="secondary"
          text="Kembali"
          onClick={() => setModal(false)}
          className="text-center"
        />
      </div>
    </Modal>
  );
};
