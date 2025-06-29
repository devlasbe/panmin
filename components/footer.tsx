import Image from "next/image";
import Link from "next/link";
import constants from "@/constants";

export default function Footer() {
  return (
    <footer className="flex w-full px-4 py-8 border-t">
      <div className="flex flex-1 flex-col items-center gap-8">
        <Image
          src="/logo_with_title.png"
          alt="logo"
          width={160}
          height={160}
          style={{ width: "auto", height: "auto" }}
        />
        <div className="flex flex-col items-center gap-1">
          <span className="flex gap-1 text-sm text-center text-neutral-500">
            <Image
              className="mt-0.5"
              src={"/mail.svg"}
              alt="mail image"
              width={16}
              height={16}
              style={{ width: 16, height: 16 }}
            />
            {constants.profile.email}
          </span>
          <p className="text-sm text-center text-neutral-500">ⓒ 2025 LasBe all rights reserved</p>
        </div>
        <div className="flex gap-4 mt-2">
          {linkList.map((data) => (
            <Link key={`footer-image-${data.src}`} className="hover:opacity-50" href={data.href} target="_blank">
              <Image src={data.src} alt="blog image" width={25} height={25} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

const linkList = [
  {
    href: constants.profile.blog,
    src: "/blog.svg",
  },
  {
    href: constants.profile.github,
    src: "/github.svg",
  },
  {
    href: constants.profile.instagram,
    src: "/instagram.svg",
  },
];
