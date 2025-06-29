import Header from "@/components/header";
import Translator from "@/components/translator";

export default function Home() {
  return (
    <div className="w-full h-dvh flex flex-col font-noto text-neutral-800">
      <Header />
      <main className="flex flex-1 px-4 md:px-8 py-4">
        <Translator />
      </main>
    </div>
  );
}
