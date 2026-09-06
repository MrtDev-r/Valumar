import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-brand shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Valumar Inmobiliaria"
            width={48}
            height={48}
            className="rounded-full bg-white p-1"
          />
          <span className="text-white text-xl font-bold tracking-wide">
            VALUMAR <span className="font-normal">Inmobiliaria</span>
          </span>
        </Link>

        <nav>
          <Link
            href="/"
            className="text-white hover:text-gray-200 font-medium"
          >
            Propiedades
          </Link>
        </nav>
      </div>
    </header>
  );
}