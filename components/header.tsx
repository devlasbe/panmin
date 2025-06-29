import Image from "next/image";

const Header = () => {
  return (
    <header className="flex justify-between items-center gap-4 px-4 md:px-8 py-4 border-b">
      <Image
        className="block md:hidden"
        src="/logo_with_title.png"
        alt="logo"
        width={100}
        height={160}
        style={{ width: "auto", height: "auto" }}
        priority
      />
      <Image
        className="hidden md:block"
        src="/logo_with_title.png"
        alt="logo"
        width={160}
        height={160}
        style={{ width: "auto", height: "auto" }}
        priority
      />
      <p className="hidden md:block text-sm text-neutral-500">판민정음과 함께라면 스타트업도 걱정 없어!</p>
    </header>
  );
};

export default Header;
