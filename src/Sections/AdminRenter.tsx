import React, { Dispatch, useEffect, useState } from "react";
import Modal from "../components/Modal";
import MyButton from "../components/MyButtons";
import Section from "../components/Section";
import Divider from "../components/Divider";
import FloatingInput from "../components/FloatingInput";
import { auth, db } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import useLoading from "../hook/useLoading";

export default function AdminRenter() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [detailInfo, setDetailInfo] = useState<any>();
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    async function getUsersFromDb() {
      const usersSnapshot = await getDocs(
        query(collection(db, "users"), where("role", "==", "renter"))
      );
      const usersList = usersSnapshot.docs
        .map((doc) => doc.data())
        .sort((a, b) => b.createdAt - a.createdAt);
      setData(usersList);
    }

    if (data.length === 0) {
      getUsersFromDb();
    }
  }, [data]);

  return (
    <Section heading={"Renter Management"}>
      {showModal && <ModalRegister setModal={setShowModal} />}
      {detailInfo && <ModalDetail setModal={setDetailInfo} data={detailInfo} />}
      <div className="overflow-x-auto flex flex-col gap-6">
        <table className="mt-4 w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap text-start px-4 py-2 font-medium text-gray-900">
                No
              </th>
              <th className="whitespace-nowrap text-start px-4 py-2 font-medium text-gray-900">
                Tanggal Registrasi
              </th>
              <th className="whitespace-nowrap text-start px-4 py-2 font-medium text-gray-900">
                Nama Lengkap
              </th>
              <th className="whitespace-nowrap text-start px-4 py-2 font-medium text-gray-900">
                Unit Sewa
              </th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {data ? (
              data.map((item: any, index: number) => {
                return (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {new Date(item.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {item.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      12
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <button
                        className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                        onClick={() => setDetailInfo(item)}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <div>no data</div>
            )}
          </tbody>
        </table>
        <div className="flex gap-4">
          <MyButton
            type="secondary"
            text="Registrasi Renter Baru"
            onClick={() => setShowModal(true)}
          />
        </div>
      </div>
    </Section>
  );
}

const ModalRegister = ({
  setModal,
}: {
  setModal: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [nama, setNama] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [alert, setAlert] = useState<string>("");

  function onSubmit() {
    if (!nama || !email || !password) {
      setAlert("Semua field harus diisi");
      return;
    } else {
      SignUp(email, password, nama);
    }
  }

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  async function SignUp(email: string, password: string, nama: string) {
    try {
      useLoading(true);
      const q = query(collection(db, "users"), where("email", "==", email));
      const userWithSameEmail = await getDocs(q);

      if (userWithSameEmail.size > 0) {
        setAlert("Email sudah terdaftar, gunakan yang lain");
        return;
      }

      const userCreated = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCreated) {
        const docRef = doc(db, "users", userCreated.user.uid);
        await setDoc(docRef, {
          alamat: "",
          email: email,
          name: nama,
          noHp: "",
          role: "renter",
          status: "aktif",
          createdAt: new Date().getTime(),
        });

        setNama("");
        setEmail("");
        setPassword("");
        setAlert("Registrasi renter Berhasil");
      }
    } catch {
      setAlert("Something went wrong");
    } finally {
      useLoading(false);
    }
  }

  return (
    <Modal>
      <div className="w-[90%] max-w-xl bg-white px-6 py-4 rounded-sm flex flex-col gap-4">
        <Divider text="Registrasi Renter" />
        <FloatingInput
          label="Nama lengkap"
          name="nama"
          onChange={(e) => setNama(e.target.value)}
          value={nama}
        />
        <FloatingInput
          label="Email"
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <FloatingInput
          label="Password"
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
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
}: {
  setModal: Dispatch<React.SetStateAction<boolean>>;
  data: any;
}) => {
  const arrayFromData = [
    [data.name, "Nama"],
    [data.email, "Email"],
    [data.noHp, "No. HP"],
    [data.alamat, "Alamat"],
    [new Date(data.createdAt).toLocaleDateString("id-ID"), "Tanggal dibuat"],
    [data.role, "Role"],
  ];
  return (
    <Modal>
      <div className="w-[90%] max-w-xl bg-white px-6 py-4 rounded-sm flex flex-col gap-4">
        <Divider text="Detail Provider" className="mb-4" />
        <dl className="-my-3 divide-y divide-gray-100 text-sm mb-4">
          {arrayFromData.map((item, index) => {
            return (
              <div
                key={index}
                className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4"
              >
                <dt className="font-medium text-gray-900">{item[1]}</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {item[0] ? item[0] : "-"}
                </dd>
              </div>
            );
          })}
        </dl>
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
