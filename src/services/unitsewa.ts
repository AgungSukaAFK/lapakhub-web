import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export async function getUnitById(id: string) {
  try {
    const unitRef = doc(db, "unitsewa", id);
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
