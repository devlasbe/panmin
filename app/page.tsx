import Count from "@/components/count";
import Header from "@/components/header";
import Translator from "@/components/translator";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col font-noto text-neutral-800">
      <Header />
      <main className="flex flex-1 flex-col gap-2 px-4 md:px-8 py-4">
        <Translator />
        <Count />
      </main>
    </div>
  );
}
