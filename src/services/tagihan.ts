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

export interface TagihanModel {
  renterId: string;
  ownerId: string;
  unitId: string;
  jumlah: string;
  status: string;
  tempo: number;
  periodeStart: number;
  periodeEnd: number;
  createdAt: number;
  closedAt?: number;
}

interface CreateTagihanProps {
  renterId: string;
  ownerId: string;
  unitId: string;
  jumlah: string;
}

export async function createTagihan({
  renterId,
  ownerId,
  unitId,
  jumlah,
}: CreateTagihanProps) {
  try {
    if (!renterId || !ownerId || !unitId || !jumlah) {
      throw new Error("Data input tidak valid.");
    }

    const tagihanRef = collection(db, "tagihan");
    const sekarang = new Date();
    const tempo = add30Days(sekarang).getTime();

    const tagihanData: TagihanModel = {
      renterId,
      ownerId,
      unitId,
      jumlah,
      status: "BELUM_BAYAR",
      tempo,
      periodeStart: sekarang.getTime(),
      periodeEnd: tempo,
      createdAt: sekarang.getTime(),
      closedAt: 0,
    };

    await addDoc(tagihanRef, tagihanData);
    return true;
  } catch (error) {
    console.error("Error membuat tagihan:", error);
    return false;
  }
}

export async function createNextTagihan({ tagihanId }: { tagihanId: string }) {
  try {
    if (!tagihanId) {
      throw new Error("Data input tidak valid.");
    }

    const tagihanSebelumnyaDoc = await getDoc(doc(db, "tagihan", tagihanId));
    if (!tagihanSebelumnyaDoc.exists()) {
      throw new Error("Tagihan sebelumnya tidak ditemukan.");
    }

    // Validasi kalau kntrakna masih
    const unit = await getDoc(
      doc(db, "unitsewa", tagihanSebelumnyaDoc.data().unitId)
    );
    if (!unit.exists()) {
      throw new Error("Unit tidak ditemukan.");
    } else {
      const unitData = unit.data();
      if (unitData.status !== "DISEWA") {
        return null;
      }
    }

    const tagihanSebelumnya = tagihanSebelumnyaDoc.data();

    if (!tagihanSebelumnya || !tagihanSebelumnya.tempo) {
      throw new Error("Data tagihan sebelumnya tidak lengkap.");
    }

    const tempoSebelumnya = new Date(tagihanSebelumnya.tempo);
    const tempoBaru = add30Days(tempoSebelumnya);

    const sekarang = new Date();

    // Membuat data tagihan baru
    const tagihanData: TagihanModel = {
      renterId: tagihanSebelumnya.renterId,
      ownerId: tagihanSebelumnya.ownerId,
      unitId: tagihanSebelumnya.unitId,
      jumlah: tagihanSebelumnya.jumlah,
      status: "BELUM_BAYAR",
      tempo: tempoBaru.getTime(),
      periodeStart: tempoSebelumnya.getTime(),
      periodeEnd: tempoBaru.getTime(),
      createdAt: sekarang.getTime(),
      closedAt: 0,
    };

    // Menyimpan data tagihan baru ke Firestore
    const tagihanRef = collection(db, "tagihan");
    await addDoc(tagihanRef, tagihanData);

    return true;
  } catch (error) {
    console.error("Error membuat tagihan:", error);
    return false;
  }
}

function add30Days(date: Date): Date {
  const newDate = new Date(date.getTime());
  newDate.setDate(newDate.getDate() + 30);
  return newDate;
}

export async function getTagihan(role: string, id: string) {
  try {
    if (!role || !id) {
      throw new Error("Data input tidak valid.");
    }

    let q;
    if (role === "renter") {
      q = query(collection(db, "tagihan"), where("renterId", "==", id));
    } else {
      q = query(collection(db, "tagihan"), where("ownerId", "==", id));
    }
    const tagihanData = await getDocs(q).then((querySnapshot) => {
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as TagihanModel & { createdAt: number }),
      }));
    });
    return tagihanData;
  } catch (error) {
    console.error("Error membuat tagihan:", error);
    return false;
  }
}

export async function getTagihanByUnitId(id: string) {
  try {
    if (!id) {
      throw new Error("Data input tidak valid.");
    }

    const q = query(collection(db, "tagihan"), where("unitId", "==", id));

    const tagihanData = await getDocs(q).then((querySnapshot) => {
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as TagihanModel & { createdAt: number }),
      }));
    });
    return tagihanData;
  } catch (error) {
    console.error("Error mendapatkan tagihan:", error);
    return false;
  }
}
