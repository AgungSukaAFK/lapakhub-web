import { getAuth } from "firebase/auth";
import Section from "../components/Section";
import { createNextTagihan, getTagihan } from "../services/tagihan";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SearchInput from "../components/SearchInput";
import MyButton from "../components/MyButtons";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { getUnitById } from "../services/unitsewa";
import Modal from "../components/Modal";
import Divider from "../components/Divider";
import { getUserByUid } from "../services/users";
import { formatTanggal } from "../utils/formatTanggal";
import { getPembayaranByTagihanId } from "../services/pembayaran";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { MySwal } from "../lib/swal";
import useLoading from "../hook/useLoading";

export default function ProviderTagihan() {
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

        const tagihanData = await getTagihan("provider", myid);
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

  return (
    <Section heading={"Tagihan Unit Sewa"}>
      {detailData && <ModalDetail setModal={setDetailData} data={detailData} />}
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
}: {
  setModal: Dispatch<SetStateAction<any>>;
  data: any;
}) => {
  const [renter, setRenter] = useState<any>();
  const [unit, setUnit] = useState<any>();
  const [pembayaran, setPembayaran] = useState<any>();

  useEffect(() => {
    if (!renter) {
      getUserByUid(data?.renterId).then((res) => {
        setRenter(res);
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
  async function validasi(isValid: boolean) {
    /*
    - Ubah status pembayaran ke LUNAS - done
    - Generate tagihan baru
    */
    if (isValid) {
      try {
        useLoading(true);
        await updateDoc(doc(db, "pembayaran", pembayaran[0]?.id), {
          status: "LUNAS",
        });

        await createNextTagihan({ tagihanId: pembayaran[0]?.tagihanId }).then(
          () => {
            setModal(null);
            MySwal.fire({
              icon: "success",
              title: "Berhasil",
              text: "Tagihan Berhasil diselesaikan.",
            }).then(() => {
              window.location.reload();
            });
          }
        );
      } catch (err) {
        console.log(err);
      } finally {
        useLoading(false);
      }
    }
  }
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

            {pembayaran && pembayaran[0]?.image && (
              <img src={pembayaran[0]?.image} alt="Bukti pembayaran" />
            )}
          </dl>
        </div>
        {pembayaran && pembayaran[0]?.status === "PENDING" && (
          <>
            <MyButton
              type="primary"
              text="Validasi"
              className="w-full py-6 text-center flex justify-center items-center"
              onClick={() => validasi(true)}
            />
            {/* <MyButton
              type="delete"
              text="Tolak Pembayaran"
              className="w-full py-6 text-center flex justify-center items-center"
              onClick={() => validasi(false)}
            /> */}
          </>
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
