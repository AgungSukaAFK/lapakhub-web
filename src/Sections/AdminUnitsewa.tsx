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
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { getAuth } from "firebase/auth";

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

export default function AdminUnitsewa() {
  const [detailData, setDetailData] = useState<any>();
  const [data, setData] = useState<any>([]);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [searchDisplay, setSearchDisplay] = useState<boolean>(false);
  const [displayedData, setDisplayedData] = useState<any>([]);

  useEffect(() => {
    setDisplayedData(searchDisplay ? filteredData : data);
  }, [data]);

  useEffect(() => {
    async function getDataFromDb() {
      try {
        const currentUserUid = getAuth().currentUser?.uid;
        if (!currentUserUid) {
          console.error("User not authenticated");
          return;
        }

        const unitSnapshot = await getDocs(query(collection(db, "unitsewa")));

        const unitsewa = unitSnapshot.docs
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

    if (data.length === 0 && !searchDisplay) {
      getDataFromDb();
    }
  }, [data]);

  async function onSave(updatedData: any) {
    try {
      useLoading(true);
      let updatedDataCopy = { ...updatedData };
      const id = updatedData.id;
      delete updatedDataCopy.id;
      delete updatedDataCopy.setDetailData;
      updateDoc(doc(db, "unitsewa", id), updatedDataCopy)
        .then(() => {
          MySwal.fire({
            icon: "success",
            title: "Success",
            text: "Data berhsail diupdate",
            confirmButtonText: "OK",
          });
          setDetailData(null);
          setData([]);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log("Something error", error);
    } finally {
      useLoading(false);
    }
  }

  async function onDelete(updatedData: any) {
    try {
      useLoading(true);
      let updatedDataCopy = { ...updatedData };
      const id = updatedData.id;
      delete updatedDataCopy.id;
      delete updatedDataCopy.setDetailData;
      updatedDataCopy.status = "NONAKTIF";
      updateDoc(doc(db, "unitsewa", id), updatedDataCopy)
        .then(() => {
          MySwal.fire({
            icon: "success",
            title: "Success",
            text: "Data berhasil dihapus!",
            confirmButtonText: "OK",
          });
          setDetailData(null);
          setData([]);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log("Something error", error);
    } finally {
      useLoading(false);
    }
  }

  function search(query: string) {
    // buat copyan data
    // filter data coyan
    // show filtered data
    if (!query.trim()) {
      // Jika query kosong, reset tampilan data tanpa menghapus data asli
      setSearchDisplay(false);
      setFilteredData(data); // Tampilkan semua data
      return;
    }

    setSearchDisplay(true);

    const filteredData = data.filter((item: any) => {
      return (
        item.kategori.toLowerCase().includes(query.toLowerCase()) ||
        item.alamat.toLowerCase().includes(query.toLowerCase()) ||
        (item.name && item.name.toLowerCase().includes(query.toLowerCase()))
      );
    });

    setFilteredData(filteredData); // Set data hasil pencarian
  }

  function refresh() {
    setData([]);
    setSearchDisplay(false);
  }

  return (
    <Section heading={"Manajemen Unit Sewa"}>
      {detailData && (
        <ModalDetail
          setModal={setDetailData}
          data={detailData}
          onSave={onSave}
          onDelete={onDelete}
        />
      )}
      <div className="w-full flex flex-row gap-4 flex-wrap mb-4">
        <SearchInput label="Cari Unit" callback={search} />
        <MyButton
          text=""
          type="tertiary"
          className="text-center w-fit px-2 cursor-pointer"
          onClick={refresh}
          icon={<ArrowPathIcon className="size-5" />}
        />
      </div>
      <div className="flex flex-wrap gap-6">
        {data &&
          displayedData.map((item: any, index: number) => {
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
  onSave,
  onDelete,
}: {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
  onSave: (updatedData: any) => Promise<void>;
  onDelete: (dataToDelete: any) => Promise<void>;
}) => {
  const [arrayFromData, setArrayFromData] = useState<any>([
    [data.image, "Gambar"],
    [data.nama, "Nama"],
    [data.ownerId, "Pemilik Unit"],
    [data.renterId, "Penyewa Unit"],
    [data.harga, "Harga"],
    [data.dimensi, "Dimensi"],
    [data.alamat, "Alamat"],
    [new Date(data.createdAt).toLocaleDateString("id-ID"), "Tanggal dibuat"],
    [data.status, "Status"],
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(data);

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

  const handleInputChange = (key: string, value: string) => {
    setEditedData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await onSave(editedData);
      setModal(false);
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };

  const handleDelete = async () => {
    try {
      MySwal.fire({
        title: "Apakah anda yakin?",
        text: "Anda tidak akan dapat mengembalikan ini!",
        icon: "warning",
        showCancelButton: true,
      }).then(async (s) => {
        if (s.isConfirmed) {
          await onDelete(editedData);
        }
      });
      setModal(false);
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };

  return (
    <Modal>
      <div className="w-[90%] max-h-[90vh] max-w-xl bg-white px-6 py-4 rounded-sm flex flex-col gap-4 overflow-auto">
        <Divider text="Detail Provider" className="mb-4" />
        <dl className="-my-3 divide-y divide-gray-100 text-sm mb-4">
          {arrayFromData.map((item: any, index: number) => {
            if (item[1] === "Gambar") {
              return (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-1 sm:gap-4"
                >
                  <img
                    src={editedData.image}
                    alt={item[1]}
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                </div>
              );
            }

            const isEditable = [
              "Nama",
              "Harga",
              "Dimensi",
              "Alamat",
              "Status",
            ].includes(item[1]);

            return (
              <div
                key={index}
                className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4"
              >
                <dt className="font-medium text-gray-900">
                  {item[1] === "Harga" ? "Harga Sewa (perbulan)" : item[1]}
                </dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {isEditing && isEditable ? (
                    <input
                      type="text"
                      value={editedData[item[1].toLowerCase()] || ""}
                      onChange={(e) =>
                        handleInputChange(item[1].toLowerCase(), e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-1"
                    />
                  ) : (
                    item[0] || "-"
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
        {isEditing ? (
          <>
            <MyButton
              type="primary"
              text="Simpan"
              onClick={handleSave}
              className="text-center py-5 flex items-center justify-center"
            />
            <MyButton
              type="delete"
              text="Hapus Unit"
              onClick={handleDelete}
              className="text-center py-5 flex items-center justify-center"
            />
          </>
        ) : (
          <MyButton
            type="secondary"
            text="Edit"
            onClick={() => setIsEditing(true)}
            className="text-center"
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
