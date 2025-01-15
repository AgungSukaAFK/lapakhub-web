import Section from "../components/Section";

export default function AdminDashboard() {
  // Statistik yg diperlukan: total provider, renter, unit sewa, tagihan diterbitkan, pembayaran selesai
  const dummyData = [
    ["Provider", 1],
    ["Renter", 10],
    ["Unit Sewa", 20],
    ["Tagihan Diterbitkan", 30],
    ["Pembayaran Selesai", 40],
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
          {dummyData.map((item, index) => {
            return (
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
            );
          })}
        </dl>
      </div>
    </Section>
  );
}
