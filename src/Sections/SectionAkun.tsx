import { useEffect, useState } from "react";
import Section from "../components/Section";
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import MyButton from "../components/MyButtons";
import Modal from "../components/Modal";
import FloatingInput from "../components/FloatingInput";
import { MySwal } from "../lib/swal";
import useLoading from "../hook/useLoading";

export default function SectionAkun() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<any>();

  console.log(user);

  useEffect(() => {
    async function fetchUser() {
      const currentUserUid = getAuth().currentUser?.uid;
      const userSnapshot = await getDoc(
        doc(collection(db, "users"), currentUserUid)
      );
      const userData = userSnapshot.data();
      setUser(userData);
      console.log(user);
      setEditedUser(userData);
    }

    if (!user) {
      fetchUser();
    }
  }, [user]);

  const handleSave = async () => {
    if (!editedUser.name || !editedUser.alamat) {
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Input tidak boleh kosong.",
      });
      return;
    }
    try {
      useLoading(true);
      const currentUserUid = getAuth().currentUser?.uid;
      const userRef = doc(collection(db, "users"), currentUserUid);
      await updateDoc(userRef, editedUser);
      console.log(editedUser);
      setUser(editedUser);
      setIsEditing(false);
      MySwal.fire({
        icon: "success",
        title: "Update Berhasil",
        text: "Informasi akun berhasil diperbarui.",
      });
    } catch (error) {
      console.error("Gagal memperbarui informasi akun:", error);
      alert("Terjadi kesalahan saat memperbarui informasi akun.");
    } finally {
      useLoading(false);
    }
  };

  return (
    <Section heading={"Informasi Akun"}>
      <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="w-full flex flex-col md:items-center md:gap-8">
          <div>
            <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
              <dl className="-my-3 divide-y divide-gray-100 text-sm">
                {[
                  ["Nama Lengkap", user?.name],
                  ["Email", user?.email],
                  ["Role", user?.role],
                  ["No. Handphone", user?.noHp],
                  ["No. Rekening (BRI)", user?.rekening],
                  ["Alamat", user?.alamat],
                  [
                    "Tanggal Registrasi",
                    user?.createdAt &&
                      new Date(user?.createdAt).toLocaleDateString("id-ID"),
                  ],
                  ["Status", user?.status],
                ].map(([label, value], index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4"
                  >
                    <dt className="font-medium text-gray-900">{label}</dt>
                    <dd className="text-gray-700 sm:col-span-2">
                      {value || "-"}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        <MyButton
          type="tertiary"
          text="Edit Informasi Akun"
          onClick={() => setIsEditing(true)}
          className="mt-4 w-60 mx-auto flex justify-center items-center"
        />

        {/* Modal for Editing */}
        {isEditing && (
          <Modal>
            <div className="bg-white p-6 rounded shadow-lg max-w-md mx-auto">
              <h2 className="text-lg font-bold mb-4">Edit Informasi Akun</h2>
              {[
                ["Nama Lengkap", "name"],
                ["Alamat", "alamat"],
                ["No. Handphone", "noHp"],
                ["No. Rekening (BRI)", "rekening"],
              ].map(([label, key], index) => (
                <div key={index} className="mb-4">
                  <FloatingInput
                    type="text"
                    label={label}
                    name={label}
                    value={editedUser[key] || ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, [key]: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
              <div className="flex gap-4">
                <MyButton
                  type="primary"
                  text="Simpan"
                  onClick={handleSave}
                  className="flex-1"
                />
                <MyButton
                  type="delete"
                  text="Batal"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 text-center"
                />
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Section>
  );
}
