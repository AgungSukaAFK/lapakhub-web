import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import useLoading from "../hook/useLoading";
import DashboardLayout from "../layouts/DashboardLayout";
import SectionAkun from "../Sections/SectionAkun";

export default function Akun() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("pending");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) {
      if (role === "pending") {
        setLoading(true);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    useLoading(loading);
  }, [loading, role]);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setRole("unknown");
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(docRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.role || "unknown");
          } else {
            setRole("unknown");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole("unknown");
        }
      }
    };

    fetchUserRole();
  }, [user]);

  // Conditional rendering based on role
  if (role === "pending") {
    return <div></div>;
  } else if (role === "admin" || role === "provider" || role === "renter") {
    return (
      <DashboardLayout role={role}>
        <SectionAkun />
      </DashboardLayout>
    );
  } else {
    return <div>Illegal Access</div>;
  }
}
