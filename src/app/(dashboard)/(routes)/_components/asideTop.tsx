import { appTitle } from "@/utils";
import Image from "next/image";

export default function AsideTop() {
  return (
    <div className="flex items-center">
      <Image
        src="/assets/images/icon-bookEasy.png"
        alt="BookEasy"
        width={60}
        height={60}
        className="mr-2"
      />
      <h1 className="bg-gradient-to-r from-blue-200 to-blue-600 bg-clip-text text-2xl font-semibold text-transparent">
        {appTitle}
      </h1>
    </div>
  );
}
