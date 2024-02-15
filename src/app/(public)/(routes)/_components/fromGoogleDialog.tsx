"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export function FromGoogleDialog({ isOpen }: { isOpen: boolean }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const schema = z.object({
    firstname: z
      .string()
      .min(2, "Le prénom n'est pas valide. Veuillez réessayer."),
    lastname: z.string().min(2, "Le nom n'est pas valide. Veuillez réessayer."),
    phoneNumber: z
      .string()
      .min(10, "Le numéro de téléphone n'est pas valide. Veuillez réessayer.")
      .max(10, "Le numéro de téléphone n'est pas valide. Veuillez réessayer."),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const response = await axios.post("/api/auth/google", data);
    setIsLoading(false);

    if (response.status === 200) {
      router.refresh();
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Compléter votre Profil</DialogTitle>
          <DialogDescription>
            Veillez à bien renseigner votre nom, prénon et numéro de téléphone
            pour que votre profil soit complet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="firstname">Prénom*</Label>
              <Input
                id="firstname"
                type="text"
                placeholder="John"
                {...register("firstname")}
              />
              {errors.firstname && (
                <span className="text-sm text-red-500">
                  {errors.firstname.message}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="lastname">Nom*</Label>
              <Input
                id="lastname"
                type="text"
                placeholder="Doe"
                {...register("lastname")}
              />
              {errors.lastname && (
                <span className="text-sm text-red-500">
                  {errors.lastname.message}
                </span>
              )}
            </div>

            <div className=" space-y-1">
              <Label htmlFor="phoneNumber">Numéro*</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="0102030405"
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && (
                <span className="text-sm text-red-500">
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            variant={"premium"}
            className={cn("mt-4 w-full", isLoading && "opacity-50")}
          >
            Inscription
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
