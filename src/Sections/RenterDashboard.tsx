import { useEffect, useState } from "react";
import Section from "../components/Section";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { getAuth } from "firebase/auth";

export default function RenterDashboard() {
  // Statistik yang diperlukan: total unit, tagihan untuk dibayar, pembayaran selesai
  const [totalUnit, setTotalUnit] = useState<number>(0);
  const [tagihanUntukDibayar, setTagihanUntukDibayar] = useState<number>(0);
  const [pembayaranSelesai, setPembayaranSelesai] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const renterId = getAuth().currentUser?.uid;

        // Hitung total unit yang disewa oleh renter
        const qUnit = query(
          collection(db, "unitsewa"),
          where("renterId", "==", renterId)
        );
        const unitSnapshot = await getDocs(qUnit);
        setTotalUnit(unitSnapshot.size);

        // Hitung jumlah tagihan yang harus dibayar oleh renter
        const qTagihan = query(
          collection(db, "tagihan"),
          where("renterId", "==", renterId),
          where("status", "==", "BELUM_BAYAR")
        );
        const tagihanSnapshot = await getDocs(qTagihan);
        setTagihanUntukDibayar(tagihanSnapshot.size);

        // Hitung jumlah pembayaran selesai oleh renter
        const qPembayaran = query(
          collection(db, "pembayaran"),
          where("renterId", "==", renterId),
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
    ["Tagihan Untuk Dibayar", tagihanUntukDibayar],
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
            Berikut adalah statistik sistem LapakHub untuk Renter
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
