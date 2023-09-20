import Image from "next/image";
import BankingForm from "./components/BankingForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-200">
      <BankingForm />
    </main>
  );
}
