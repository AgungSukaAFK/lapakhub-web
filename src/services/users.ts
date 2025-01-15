import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { getAuth } from "firebase/auth";

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

export async function getCurrentUserData() {
  try {
    const id = getAuth().currentUser?.uid;
    if (!id) {
      return false;
    }
    const unitRef = doc(db, "users", id);
    const unitSnapshot = await getDoc(unitRef);
    if (unitSnapshot.exists()) {
      return unitSnapshot.data();
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
