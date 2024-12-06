import Image from "next/image";

export default function Logo() {
  return (
    <div className="md:hidden">
      <Image src="/icons/logo.png" alt="CNC Logo" width={86} height={12} />
    </div>
  );
}
