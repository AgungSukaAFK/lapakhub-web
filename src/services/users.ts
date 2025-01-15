import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export async function getUserByUid(uid: string) {
  try {
    const unitRef = doc(db, "users", uid);
    const unitSnapshot = await getDoc(unitRef);
    if (unitSnapshot.exists()) {
      return unitSnapshot.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting unit:", error);
    return null;
  }
}
