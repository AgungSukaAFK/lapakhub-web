import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import useLoading from "../hook/useLoading";
import DashboardLayout from "../layouts/DashboardLayout";
export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("pending");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if(loading){
      if(role === "pending"){
        setLoading(true)
      } else {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }

    useLoading(loading)

  }, [loading, role])

  useEffect(() => {
    const auth = getAuth();

    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Navigate to login if user is not authenticated
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
    return <DashboardLayout>Loading...</DashboardLayout>;
  } else if (role === "admin") {
    return <DashboardLayout>Role: Admin</DashboardLayout>;
  } else if (role === "provider") {
    return <DashboardLayout>Role: Provider</DashboardLayout>;
  } else if (role === "renter") {
    return <DashboardLayout>Role: Renter</DashboardLayout>;
  } else {
    return <DashboardLayout>Illegal Access</DashboardLayout>;
  }
}
