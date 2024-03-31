"use client";

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
import { defaultFetcherGet } from "@/lib/fetcher";
import { useCompany } from "@/store/dashboard";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import { z } from "zod";

export default function SettingsPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const { companyId } = useCompany();
  const { data: company } = useSWR(
    `/api/company/${companyId}`,
    defaultFetcherGet
  );
  const { mutate } = useSWRConfig();

  const formSchema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    numberDaysToReturn: z.string(),
    address: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: company?.name ?? "",
      description: company?.description ?? "",
      numberDaysToReturn: company?.numberDaysToReturn ?? "1",
      address: company?.address ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      setLoading(true);
      const res = await axios.put(`/api/company/${companyId}`, values);

      if (res.status === 200) {
        toast("L'entreprise a été modifiée avec succès", {
          description: "Les modifications ont été enregistrées",
        });

        mutate(`/api/company/${companyId}`);
      }
    } catch (error) {
      console.error(error);
      toast("Une erreur est survenue", {
        description: "Impossible de modifier l'entreprise",
      });
    } finally {
      setLoading(false);
    }
  }

  console.log(company);

  return (
    <div className="flex flex-col m-4">
      <h1 className="text-2xl font-bold mb-4">
        Paramètres de l&apos;entreprise
      </h1>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-xl font-medium my-6 underline">Général</h2>
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
                  <Input placeholder="Pluviaux" {...field} />
                </FormControl>
                <FormDescription>
                  Ceci est le nom de votre entreprise.
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
                <FormLabel>
                  Description de l&apos;entreprise <span>(optionnel)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Pluviaux est une de développement web"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Ceci est la description de votre entreprise.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Adresse <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="123 rue parla" {...field} />
                </FormControl>
                <FormDescription>
                  Ceci est l&apos;adresse de votre entreprise.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <h2 className="text-xl font-medium my-6 underline">Réservation</h2>
          <FormField
            control={form.control}
            name="numberDaysToReturn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Annulation <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1" {...field} />
                </FormControl>
                <FormDescription>
                  Ceci est le nombre de jours avant la réservation pour annuler.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button isLoading={loading} disabled={loading} type="submit">
            Modifier l&apos;entreprise
          </Button>
        </form>
      </Form>
    </div>
  );
}
