import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-primary-300">
      <h1 className="font-mitr">Mitr Font Heading</h1>
      <p className="font-rubik">Rubik Font Paragraph</p>
      <div className="font-bai-jamjuree">Bai Jamjuree Text</div>
    </main>
  );
}
