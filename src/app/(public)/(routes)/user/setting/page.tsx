"use client";

import PremiumButton from "@/components/premiumButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import useIsPremium from "@/hooks/useIsPremium";
import { defaultFetcherGet } from "@/lib/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import { z } from "zod";

export default function SettingsUserPage() {
  const [loading, setLoading] = useState<boolean>(false);

  const isSubscribed = useIsPremium();
  const { data } = useSWR(`/api/auth/me`, defaultFetcherGet);
  const { mutate } = useSWRConfig();

  const formSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone_number: z.string().min(10).max(10),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // todo : i don't know why this is not working
    defaultValues: {
      firstName: data?.firstName,
      lastName: data?.lastName,
      phone_number: data?.phone_number,
    },
  });


  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      setLoading(true);
      const res = await axios.put(`/api/auth/`, { ...values, id: data.id });

      if (res.status === 200) {
        toast("L'utilisateur a été modifié avec succès", {
          description: "Les modifications ont été enregistrées",
        });

        mutate(`/api/auth/`);
      }
    } catch (error) {
      console.error(error);
      toast("Une erreur est survenue", {
        description: "Veuillez réessayer plus tard",
      });
    } finally {
      setLoading(false);
      form.reset();
    }
  }

  return (
    <div className="flex flex-col items-center m-12 ">
      <h1 className="text-2xl font-bold mb-4 ">
        Paramètres de l&apos;utilisateur
      </h1>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-[70%]"
        >
          <h2 className="text-xl font-medium my-6 underline">Général</h2>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Prénom <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormDescription>
                  Ceci est le prénom de l&apos;utilisateur.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nom <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormDescription>
                  Ceci est le nom de l&apos;utilisateur.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Numéro de téléphone <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="1" {...field} />
                </FormControl>
                <FormDescription>
                  Ceci est le numéro de téléphone de l&apos;utilisateur.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <h2 className="text-xl font-medium my-6 underline">Paiement</h2>
          <p className="text-gray-500">
            {isSubscribed.isPremium ? (
              "Vous avez payer pour notre service."
            ) : (
              <div className="flex flex-col">
                <span>Vous n&apos;avez pas payer pour notre service.</span>
                <div className="my-2">
                  <PremiumButton />
                </div>
              </div>
            )}
          </p>

          <AlertDialogDeleteAccount />

          <Button
            className="mx-2"
            isLoading={loading}
            disabled={loading}
            type="submit"
          >
            Modifier l&apos;utilisateur
          </Button>
        </form>
      </Form>
    </div>
  );
}

export function AlertDialogDeleteAccount() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const deleteAccount = async () => {
    console.log("delete account");

    try {
      setIsLoading(true);
      const res = await axios.delete(`/api/auth/`);
      if (res.status === 200) {
        toast("Votre compte a été supprimé avec succès", {
          description: "Vous allez être redirigé vers la page d'accueil",
        });
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast("Une erreur est survenue", {
        description: "Veuillez réessayer plus tard",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Supprime le compte</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Supprimer votre compte et vos données
          </AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
            irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={deleteAccount}>
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
