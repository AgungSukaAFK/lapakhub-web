import { getAuth } from "firebase/auth";
import Section from "../components/Section";
import { getTagihan } from "../services/tagihan";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SearchInput from "../components/SearchInput";
import MyButton from "../components/MyButtons";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { getUnitById } from "../services/unitsewa";
import Modal from "../components/Modal";
import Divider from "../components/Divider";
import { getUserByUid } from "../services/users";
import { formatTanggal } from "../utils/formatTanggal";
import Dropzone from "../components/Dropzone";
import { MySwal } from "../lib/swal";
import {
  createPembayaran,
  getPembayaranByTagihanId,
} from "../services/pembayaran";
import useLoading from "../hook/useLoading";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export default function RenterTagihan() {
  const [detailData, setDetailData] = useState<any>();
  const [data, setData] = useState<any>([]);
  const [originalData, setOriginalData] = useState<any>([]);

  useEffect(() => {
    async function getDataFromDb() {
      try {
        const myid = getAuth().currentUser?.uid;
        if (!myid) {
          console.error("User not authenticated");
          return;
        }

        const tagihanData = await getTagihan("renter", myid);
        if (tagihanData) {
          setData(tagihanData);
          setOriginalData(tagihanData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getDataFromDb();
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setData(originalData);
    } else {
      const filteredData = originalData.filter((item: any) =>
        item.unitId.toLowerCase().includes(query.toLowerCase())
      );
      setData(filteredData);
    }
  };

  function refresh() {
    window.location.reload();
  }

  return (
    <Section heading={"Tagihan Unit Sewa"}>
      {detailData && (
        <ModalDetail
          setModal={setDetailData}
          data={detailData}
          refresh={refresh}
        />
      )}
      <div className="w-full flex flex-row gap-4 flex-wrap mb-4">
        <SearchInput label="Cari Unit" callback={handleSearch} />
        <MyButton
          text=""
          type="tertiary"
          className="text-center w-fit px-2 cursor-pointer"
          onClick={() => setData(originalData)}
          icon={<ArrowPathIcon className="size-5" />}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        {data.length > 0 ? (
          data.map((item: any, index: number) => (
            <Card key={index} data={item} setDetailData={setDetailData} />
          ))
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
  data: {
    renterId: string;
    ownerId: string;
    unitId: string;
    jumlah: number;
    status: string;
    tempo: number;
    periodeStart: number;
    periodeEnd: number;
  };
  setDetailData: Dispatch<SetStateAction<any>>;
}
const Card = ({ data, setDetailData }: CardProps) => {
  const [unit, setUnit] = useState<any>();

  useEffect(() => {
    if (!unit) {
      getUnitById(data.unitId).then((res) => {
        setUnit(res);
      });
    }
  }, [unit]);
  return (
    <div className="w-full max-w-80 block rounded-lg p-4 shadow-sm hover:shadow-lg border border-slate-400">
      <img
        alt=""
        src={unit?.image}
        className="h-56 w-full rounded-md object-cover"
      />
      <div className="mt-2">
        <dl>
          <div>
            <dt className="sr-only">Price</dt>
            <dd className="text-sm text-gray-500 text-center">{unit?.harga}</dd>
          </div>
          <div>
            <dt className="sr-only">Address</dt>
            <dd className="font-medium my-3 text-center">{unit?.nama}</dd>
          </div>
          <div>
            <dt className="sr-only">Status</dt>
            <dd className="font-medium my-3 text-center">{data?.status}</dd>
          </div>
        </dl>
      </div>
      <MyButton
        type="tertiary"
        className="mt-4 w-full text-center"
        text="Lihat Detail"
        onClick={() => setDetailData(data)}
      />
    </div>
  );
};

const ModalDetail = ({
  setModal,
  data,
  refresh,
}: {
  setModal: Dispatch<SetStateAction<any>>;
  data: any;
  refresh: Function;
}) => {
  const [renter, setRenter] = useState<any>();
  const [provider, setProvider] = useState<any>();
  const [unit, setUnit] = useState<any>();
  const [file, setFile] = useState<File | null>(null);
  const [pembayaran, setPembayaran] = useState<any>();

  useEffect(() => {
    if (!renter) {
      getUserByUid(data?.renterId).then((res) => {
        setRenter(res);
      });
    }

    if (!provider) {
      getUserByUid(data?.ownerId).then((res) => {
        setProvider(res);
      });
    }

    if (!unit) {
      getUnitById(data?.unitId).then((res) => {
        setUnit(res);
      });
    }

    if (!pembayaran) {
      getPembayaranByTagihanId(data?.id).then((res) => {
        setPembayaran(res);
      });
    }
  }, [data, unit]);

  const handleFileUpload = async () => {
    if (!file) {
      MySwal.fire("File bukti pembayaran harus diunggah!", "", "error");
      return;
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      useLoading(true);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengunggah file. Silakan coba lagi.");
      }

      const dataImage = await response.json();
      const imageUrl = dataImage.secure_url;

      await createPembayaran({
        image: imageUrl,
        tagihanId: data.id,
      }).then((res) => {
        return res;
      });

      await updateDoc(doc(db, "tagihan", data.id), {
        status: "SUDAH_BAYAR",
      });

      MySwal.fire(
        "Upload Berhasil!",
        "Bukti pembayaran telah diunggah, silahkan tunggu validasi dari provider.",
        "success"
      );
      refresh();
      setModal(false);
      return imageUrl;
    } catch (error) {
      console.error("Error saat mengunggah file:", error);
      MySwal.fire("Gagal mengunggah file!", "Silakan coba lagi.", "error");
      return null;
    } finally {
      useLoading(false);
    }
  };

  return (
    <Modal>
      <div className="w-[90%] max-h-[90vh] max-w-lg bg-white px-6 py-4 rounded-sm flex flex-col gap-4 overflow-auto">
        <Divider text="Detail Tagihan" />
        <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
          <dl className="-my-3 divide-y divide-gray-100 text-sm">
            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Nama unit</dt>
              <dd className="text-gray-700 sm:col-span-2">{unit?.nama}</dd>
            </div>
            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Penyewa</dt>
              <dd className="text-gray-700 sm:col-span-2">{renter?.name}</dd>
            </div>

            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Total tagihan</dt>
              <dd className="text-gray-700 sm:col-span-2">{data?.jumlah}</dd>
            </div>

            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">
                Rekening pembayaran (BRI)
              </dt>
              <dd className="text-gray-700 sm:col-span-2">
                {provider?.rekening} - {provider?.name}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Status</dt>
              <dd className="text-gray-700 sm:col-span-2">{data?.status}</dd>
            </div>

            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Periode tagihan</dt>
              <dd className="text-gray-700 sm:col-span-2">
                {formatTanggal(data?.periodeStart)} ~{" "}
                {formatTanggal(data?.periodeEnd)}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">
                Bayar sebelum (tempo)
              </dt>
              <dd className="text-gray-700 sm:col-span-2">
                {formatTanggal(data?.tempo)}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">
                Tanggal pembuatan tagihan
              </dt>
              <dd className="text-gray-700 sm:col-span-2">
                {formatTanggal(data?.createdAt)}
              </dd>
            </div>
          </dl>
        </div>

        {/* DROPZONE */}
        {pembayaran?.length > 0 ? (
          <div className="mt-4">
            <img src={pembayaran[0]?.image} alt="bukti pembayaran" />
            <button
              disabled
              className="mt-4 w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-600"
            >
              Pembayaran sudah dilakukan
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <Dropzone onFileSelected={setFile} />
            <button
              onClick={handleFileUpload}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Unggah Bukti Pembayaran & Ajukan Pembayaran
            </button>
          </div>
        )}

        <MyButton
          type="tertiary"
          text="Kembali"
          className="w-full text-center"
          onClick={() => setModal(false)}
        />
      </div>
    </Modal>
  );
};
