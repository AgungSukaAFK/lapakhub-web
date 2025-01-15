import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/outline";
import MyButton from "../components/MyButtons";
import Section from "../components/Section";
import SearchInput from "../components/SearchInput";
import { Dispatch, useEffect, useState } from "react";
import Modal from "../components/Modal";
import Divider from "../components/Divider";
import FloatingInput from "../components/FloatingInput";
import SelectInput from "../components/SelectInput";
import Dropzone from "../components/Dropzone";
import { MySwal } from "../lib/swal";
import useLoading from "../hook/useLoading";
import {
  addDoc,
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

export default function ProviderUnitsewa() {
  const [showModal, setShowModal] = useState<boolean>(false);
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

        const validStatus = ["TERSEDIA", "DISEWA"];
        const usersSnapshot = await getDocs(
          query(
            collection(db, "unitsewa"),
            where("ownerId", "==", currentUserUid),
            where("status", "in", validStatus)
          )
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
            text: "Data updated successfully",
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

  return (
    <Section heading={"Manajemen Unit Sewa"}>
      {showModal && <ModalRegister setModal={setShowModal} />}
      {detailData && (
        <ModalDetail
          setModal={setDetailData}
          data={detailData}
          onSave={onSave}
          onDelete={onDelete}
        />
      )}
      <div className="w-full flex flex-row gap-4 flex-wrap mb-4">
        <MyButton
          text="Tambah Unit Sewa"
          type="primary"
          className="text-center"
          icon={<PlusIcon className="size-5" />}
          onClick={() => setShowModal(true)}
        />
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

const ModalRegister = ({
  setModal,
}: {
  setModal: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<UnitModel>({
    nama: "",
    image: "",
    ownerId: "",
    renterId: "",
    deskripsi: "",
    harga: "",
    kategori: "",
    alamat: "",
    status: "TERSEDIA",
    dimensi: "",
  });
  const [alert, setAlert] = useState<string>("");

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const cloudPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

  const onSubmit = async () => {
    if (
      data.nama === "" ||
      data.deskripsi === "" ||
      data.harga === "" ||
      data.kategori === "" ||
      data.alamat === "" ||
      data.dimensi === ""
    ) {
      setAlert("Semua field harus diisi");
      return;
    }

    useLoading(true);
    if (!file) {
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "File gambar tidak boleh kosong!",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudPreset);
    formData.append("cloud_name", cloudName);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const dataimage = await response.json();
      const imageUrl = dataimage.secure_url;

      // Tambah data ke firestore
      const uid = getAuth().currentUser?.uid;
      await addDoc(collection(db, "unitsewa"), {
        ...data,
        image: imageUrl,
        ownerId: uid,
        createdAt: new Date().getTime(),
      }).then(() => {
        MySwal.fire({
          icon: "success",
          title: "Upload Berhasil!",
          text: "Unit Sewa Berhasil ditambahkan!",
        });
      });

      setModal(false);
    } catch (error) {
      console.error("Upload failed:", error);
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Upload gagal!",
      });
    } finally {
      useLoading(false);
    }
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  function updateDataWithNewValue(
    name: string,
    value: string | number | boolean
  ) {
    const prev = data;

    setData({
      ...prev,
      [name]: value,
    });
  }

  return (
    <Modal>
      <div className="w-[90%] max-w-xl max-h-[90vh] overflow-auto bg-white px-6 py-4 rounded-sm flex flex-col gap-4">
        <Divider text="Input Unit Sewa" />
        <Dropzone onFileSelected={setFile} />
        <FloatingInput
          label="Nama Unit"
          name="nama"
          onChange={(e) => updateDataWithNewValue("nama", e.target.value)}
          value={data.nama || ""}
        />
        <FloatingInput
          label="Harga Sewa (perbulan)"
          name="harga"
          onChange={(e) => updateDataWithNewValue("harga", e.target.value)}
          value={data.harga || ""}
        />
        <FloatingInput
          label="Alamat"
          name="alamat"
          onChange={(e) => updateDataWithNewValue("alamat", e.target.value)}
          value={data.alamat || ""}
        />
        <FloatingInput
          label="Deskripsi"
          name="deskripsi"
          onChange={(e) => updateDataWithNewValue("deskripsi", e.target.value)}
          value={data.deskripsi || ""}
        />
        <FloatingInput
          label="Dimensi"
          name="dimensi"
          onChange={(e) => updateDataWithNewValue("dimensi", e.target.value)}
          value={data.dimensi || ""}
        />
        <SelectInput
          header="Kategori Unit"
          placeholder="Pilih Kategori"
          options={[
            { name: "Ruko", value: "ruko" },
            { name: "Lapak", value: "lapak" },
          ]}
          onChange={(e) => updateDataWithNewValue("kategori", e.target.value)}
        />
        {alert && (
          <div
            role="alert"
            className="rounded border-s-4 border-red-500 bg-red-50 p-4"
          >
            <strong className="block font-medium text-red-800">
              {" "}
              {alert}{" "}
            </strong>
          </div>
        )}
        <MyButton
          type="secondary"
          text="Submit"
          className="mt-4 py-3 text-center"
          onClick={onSubmit}
        />
        <MyButton
          type="tertiary"
          text="Batalkan"
          className="py-3 text-center"
          onClick={() => setModal(false)}
        />
      </div>
    </Modal>
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
    [data.harga, "Harga Sewa (perbulan)"],
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
              "Harga Sewa (perbulan)",
              "Dimensi",
              "Alamat",
              "Status",
            ].includes(item[1]);

            return (
              <div
                key={index}
                className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4"
              >
                <dt className="font-medium text-gray-900">{item[1]}</dt>
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
