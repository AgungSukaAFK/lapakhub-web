import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Section from "../components/Section";
import MyButton from "../components/MyButtons";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Harap masukkan email Anda.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Email reset password telah dikirim. Periksa kotak masuk Anda."
      );
    } catch (error: any) {
      setMessage(
        error.code === "auth/user-not-found"
          ? "Email tidak ditemukan. Harap periksa kembali."
          : "Terjadi kesalahan. Coba lagi nanti."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section heading="Lupa Password">
      <div className="w-full max-w-md mx-auto p-4 bg-white shadow rounded-md">
        <p className="text-sm text-gray-600 mb-4">
          Masukkan email yang terdaftar untuk menerima tautan reset password.
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
        />
        <MyButton
          type="primary"
          text={isSubmitting ? "Mengirim..." : "Kirim Tautan Reset"}
          onClick={handleResetPassword}
          disabled={isSubmitting}
          className="w-full py-3 flex items-center justify-center"
        />
        <MyButton
          type="tertiary"
          text={"Kembali ke halaman Login"}
          onClick={() => (window.location.href = "/login")}
          disabled={isSubmitting}
          className="w-full py-3 mt-4 flex items-center justify-center"
        />
        {message && (
          <p
            className={`mt-4 text-sm ${
              message.includes("kesalahan") ||
              message.includes("tidak ditemukan")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </Section>
  );
}
