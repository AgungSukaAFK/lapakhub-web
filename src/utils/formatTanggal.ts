export function formatTanggal(timestamp: number): string {
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const date = new Date(timestamp);
  const hariNama = hari[date.getDay()];
  const tanggal = date.getDate();
  const bulanNama = bulan[date.getMonth()];
  const tahun = date.getFullYear();

  return `${hariNama}, ${tanggal} ${bulanNama} ${tahun}`;
}
