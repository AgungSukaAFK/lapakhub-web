import { useEffect, useState } from "react";
import Section from "../components/Section";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export default function AdminDashboard() {
  // Statistik yang diperlukan: total provider, renter, unit sewa, tagihan diterbitkan, pembayaran selesai
  const [provider, setProvider] = useState<number>(0);
  const [renter, setRenter] = useState<number>(0);
  const [unit, setUnit] = useState<number>(0);
  const [tagihan, setTagihan] = useState<number>(0);
  const [pembayaran, setPembayaran] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qProvider = query(
          collection(db, "users"),
          where("role", "==", "provider")
        );
        const providerSnapshot = await getDocs(qProvider);
        setProvider(providerSnapshot.size);

        const qRenter = query(
          collection(db, "users"),
          where("role", "==", "renter")
        );
        const renterSnapshot = await getDocs(qRenter);
        setRenter(renterSnapshot.size);

        const qUnit = collection(db, "unitsewa");
        const unitSnapshot = await getDocs(qUnit);
        setUnit(unitSnapshot.size);

        const qTagihan = collection(db, "tagihan");
        const tagihanSnapshot = await getDocs(qTagihan);
        setTagihan(tagihanSnapshot.size);

        const qPembayaran = query(
          collection(db, "pembayaran"),
          where("status", "==", "BERHASIL")
        );
        const pembayaranSnapshot = await getDocs(qPembayaran);
        setPembayaran(pembayaranSnapshot.size);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const statistics = [
    ["Provider", provider],
    ["Renter", renter],
    ["Unit Sewa", unit],
    ["Tagihan Diterbitkan", tagihan],
    ["Pembayaran Selesai", pembayaran],
  ];

  return (
    <Section heading={"Dashboard"}>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-heading font-bold text-gray-900">
            Statistik sistem LapakHub
          </h2>

          <p className="mt-4 text-gray-500 sm:text-xl">
            Berikut adalah statistik sistem LapakHub yang kami sediakan
          </p>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
          {statistics.map((item, index) => (
            <div
              key={index}
              className="flex flex-col rounded-lg bg-blue-50 px-4 py-8 text-center"
            >
              <dt className="order-last text-lg font-medium text-gray-500">
                {item[0]}
              </dt>

              <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                {item[1]}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
