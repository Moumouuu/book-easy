"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { defaultFetcherGet } from "@/lib/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";
import { ButtonHovered } from "./buttonHovered";

export default function GetStartedButton() {
  const { data: user } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const handleRoute = () => {
    if (!user) router.push("/sign-in");
    toggleOpen();
  };

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <ButtonHovered onClick={handleRoute}>Commencer</ButtonHovered>
      <DialogCreateCompany open={open} toggleOpen={toggleOpen} />
    </>
  );
}

export function DialogCreateCompany({
  open,
  toggleOpen,
}: {
  open: boolean;
  toggleOpen: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  // fetch user to check if user used the free trial
  const {
    data: me,
    isLoading: loadingMe,
    error: errorMe,
  } = useSWR("/api/auth/me", defaultFetcherGet);
  const {
    data: isSubscribe,
    isLoading: loadingSubscribe,
    error: errorSubscribe,
  } = useSWR("/api/premium", defaultFetcherGet);


  const isAuthorized = isSubscribe || (me && me._count.companies === 0);

  const formSchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const res = await axios.post("/api/company", {
        name: values.name,
        description: values.description,
      });
      if (res.status === 201) {
        router.push(`/company/${res.data.id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      toggleOpen();
      setLoading(false);
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une entreprise</DialogTitle>
          <DialogDescription>
            Créez une entreprise pour commencer à utiliser l&apos;application.
            Vous pourrez inviter des collègues plus tard.
          </DialogDescription>
        </DialogHeader>
        {!isAuthorized && (
          <DialogDescription className="text-red-500">
            Vous devez avoir un abonnement premium pour créer plus d&apos;une
            entreprise.
          </DialogDescription>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nom de l&apos;entreprise{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input required placeholder="BookEazy" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ceci est votre nom d&apos;affichage public.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description </FormLabel>
                  <FormControl>
                    <Input placeholder="Soin du visage à domicile" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ceci est votre description d&apos;entreprise.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full items-center justify-end">
              <Button
                className=" mx-1 "
                variant={"outline"}
                type="button"
                onClick={toggleOpen}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                className=" mx-1 "
                type="submit"
                isLoading={loading}
                disabled={loading || !isAuthorized}
              >
                Créer mon entreprise
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
