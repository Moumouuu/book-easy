import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import Image from "next/image";
import { IoMenu } from "react-icons/io5";
import AsideContent from "./asideContent";
import AsideTop from "./asideTop";

export default function Aside() {
  return (
    <>
      <div className="block lg:hidden ">
        <Sheet>
          <SheetTrigger asChild>
            <div className="cursor-pointer p-2">
              <IoMenu size={30} />
            </div>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>
                <AsideTop />
              </SheetTitle>
            </SheetHeader>
            <AsideContent />
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden h-screen border-r p-5 lg:block">
        <AsideTop />
        <AsideContent />
      </div>
    </>
  );
}
