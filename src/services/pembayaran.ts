import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export async function getPembayaranByTagihanId(id: string) {
  try {
    if (!id) {
      throw new Error("Data input tidak valid.");
    }

    const q = query(collection(db, "pembayaran"), where("tagihanId", "==", id));

    const tagihanData = await getDocs(q).then((querySnapshot) => {
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    });
    return tagihanData;
  } catch (error) {
    console.error("Error mendapatkan tagihan:", error);
    return false;
  }
}

export async function createPembayaran({
  image,
  tagihanId,
}: {
  image: string;
  tagihanId: string;
}) {
  try {
    if (!image || !tagihanId) {
      throw new Error("Data input tidak valid.");
    }

    const pembayaranData = {
      image,
      tagihanId,
      createdAt: new Date().getTime(),
      status: "PENDING",
    };

    await addDoc(collection(db, "pembayaran"), pembayaranData);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
