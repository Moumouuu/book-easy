import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import useIsAdmin from "@/hooks/useIsAdmin";
import { useCompany } from "@/store/dashboard";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
});

export function NewTeamateDialog() {
  const userIsAdmin = useIsAdmin();
  const { companyId } = useCompany();
  const [isLoadingAddTeamate, setIsLoadingAddTeamate] =
    useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userIsAdmin) return;
    setIsLoadingAddTeamate(true);
    try {
      await axios.post(`/api/send/${companyId}/inviteTeamate`, {
        email: values.email,
      });
    } catch (error) {
      console.error("An error occurred while adding a customer:", error);
      toast("Une erreur est survenue lors de l'envoie de l'email", {
        description:
          "Si le problème persiste veuillez contacter un administrateur",
      });
    } finally {
      setIsLoadingAddTeamate(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          isLoading={isLoadingAddTeamate}
          disabled={isLoadingAddTeamate || !userIsAdmin}
        >
          <Plus className="mr-2 h-5 w-5" />
          Créer un collaborateur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Inviter un collaborateur</DialogTitle>
          <DialogDescription>
            Ajoutez un nouvel utilisateur à votre équipe pour accéder à toutes
            les fonctionnalités de l&apos;application, à l&apos;exception de la
            modification des paramètres de l&apos;application ou de la
            suppression des données.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="johndoe@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Un email sera envoyé à cette adresse pour inviter le
                    collaborateur à rejoindre l&apos;équipe.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              isLoading={isLoadingAddTeamate}
              disabled={isLoadingAddTeamate || !userIsAdmin}
              type="submit"
            >
              <Plus className="mr-1 h-5 w-5" />
              Inviter
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
