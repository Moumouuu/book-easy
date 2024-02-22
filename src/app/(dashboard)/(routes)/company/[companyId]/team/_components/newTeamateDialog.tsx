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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useIsAdmin from "@/hooks/useIsAdmin";
import { useCompany } from "@/store/dashboard";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Info, Plus } from "lucide-react";
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

  // todo test email & bouton modif role teamate & improve security for invite email (new table with secureToken for example)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userIsAdmin) return;
    setIsLoadingAddTeamate(true);
    try {
      await axios.post(`/api/send/${companyId}/inviteTeamate`, {
        email: values.email,
      });
      toast("Un email a été envoyé à l'adresse indiquée", {
        description:
          "Le collaborateur pourra rejoindre l'équipe en cliquant sur le lien envoyé par email",
      });
    } catch (error) {
      console.error("An error occurred while adding a customer:", error);
      toast("Une erreur est survenue lors de l'envoie de l'email", {
        description:
          "Si le problème persiste veuillez contacter un administrateur",
      });
    } finally {
      setIsLoadingAddTeamate(false);
      form.reset();
    }
  }

  if (!userIsAdmin) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          isLoading={isLoadingAddTeamate}
          disabled={isLoadingAddTeamate || !userIsAdmin}
        >
          <Plus className="mr-2 h-5 w-5" />
          Inviter un collaborateur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Inviter un collaborateur
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="ml-2 h-5 w-5" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-[350px]">
                    Ajoutez un nouvel utilisateur à votre équipe pour accéder à
                    toutes les fonctionnalités de l&apos;application, à
                    l&apos;exception de la modification des paramètres de
                    l&apos;application ou de la suppression des données.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTitle>
          <DialogDescription></DialogDescription>
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
