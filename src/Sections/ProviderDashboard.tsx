import { useEffect, useState } from "react";
import Section from "../components/Section";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { getAuth } from "firebase/auth";

export default function ProviderDashboard() {
  // Statistik yang diperlukan: total unit, unit aktif, tagihan diterbitkan, pembayaran selesai
  const [totalUnit, setTotalUnit] = useState<number>(0);
  const [unitAktif, setUnitAktif] = useState<number>(0);
  const [tagihanDiterbitkan, setTagihanDiterbitkan] = useState<number>(0);
  const [pembayaranSelesai, setPembayaranSelesai] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const providerId = getAuth().currentUser?.uid;

        // Hitung total unit yang dimiliki oleh provider
        const qTotalUnit = query(
          collection(db, "unitsewa"),
          where("owner", "==", providerId)
        );
        const totalUnitSnapshot = await getDocs(qTotalUnit);
        setTotalUnit(totalUnitSnapshot.size);

        // Hitung jumlah unit aktif (disewa) oleh provider
        const qUnitAktif = query(
          collection(db, "unitsewa"),
          where("owner", "==", providerId),
          where("status", "==", "DISEWA")
        );
        const unitAktifSnapshot = await getDocs(qUnitAktif);
        setUnitAktif(unitAktifSnapshot.size);

        // Hitung jumlah tagihan yang diterbitkan oleh provider
        const qTagihan = query(
          collection(db, "tagihan"),
          where("ownerId", "==", providerId)
        );
        const tagihanSnapshot = await getDocs(qTagihan);
        setTagihanDiterbitkan(tagihanSnapshot.size);

        // Hitung jumlah pembayaran yang selesai untuk provider
        const qPembayaran = query(
          collection(db, "pembayaran"),
          where("ownerId", "==", providerId),
          where("status", "==", "BERHASIL")
        );
        const pembayaranSnapshot = await getDocs(qPembayaran);
        setPembayaranSelesai(pembayaranSnapshot.size);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const statistics = [
    ["Total Unit", totalUnit],
    ["Unit Aktif", unitAktif],
    ["Tagihan Diterbitkan", tagihanDiterbitkan],
    ["Pembayaran Selesai", pembayaranSelesai],
  ];

  return (
    <Section heading={"Dashboard"}>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-heading font-bold text-gray-900">
            Statistik sistem LapakHub
          </h2>

          <p className="mt-4 text-gray-500 sm:text-xl">
            Berikut adalah statistik sistem LapakHub untuk Provider
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
