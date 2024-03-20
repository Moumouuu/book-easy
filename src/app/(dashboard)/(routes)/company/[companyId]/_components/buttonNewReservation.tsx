"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon } from "lucide-react";

export function ButtonNewReservation() {
  const { mutate } = useSWRConfig();

  const { companyId } = useCompany();
  const [isSendEmail, setIsSendEmail] = React.useState<boolean>(true);
  const [reservation, setReservation] = React.useState({
    start_at: new Date(),
    end_at: new Date(),
    price: 0,
  });

  const [customerId, setCustomerId] = React.useState<string>("");
  const [customerEmail, setCustomerEmail] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const addReservation = async () => {
    setIsLoading(true);

    try {
      // Create a new reservation with a customer or without (it's temporary, the customer will receive an email
      // to create an account if he doesn't have one yet and the reservation should be linked)
      const response = await axios.post(
        `/api/company/${companyId}/calendar/bookings`,
        {
          ...reservation,
          customerId: customerId,
          sendEmail: isSendEmail,
        }
      );

      // send an email to the customer if the option is checked (just inform the customer about the new booking)
      if (isSendEmail) {
        await axios.post(`/api/send/${companyId}/newBook`, {
          id: response.data.id,
          price: response.data.price,
          start_at: response.data.start_at,
          end_at: response.data.end_at,
          customerEmail,
        });
      }

      if (customerEmail) {
        // send an email to the customer to create an account and link the reservation
        await axios.post(`/api/send/${companyId}/createAccount`, {
          customerEmail,
          reservationId: response.data.id,
        });
      }

      toast("Réservation créée", {
        description: "La réservation a été créée avec succès",
      });

      mutate(`/api/company/${companyId}/calendar/bookings`);
    } catch (error) {
      console.error(error);
      toast("Erreur", {
        description:
          "Une erreur est survenue lors de la création de la réservation",
      });
    } finally {
      setIsLoading(false);
      clearForm();
    }
  };

  const clearForm = () => {
    setCustomerId("");
    setCustomerEmail("");
    setReservation({
      start_at: new Date(),
      end_at: new Date(),
      price: 0,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2" />
          Ajouter une réservation
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto">
        <DialogHeader>
          <DialogTitle>Créer une réservation</DialogTitle>
          <DialogDescription>
            Créer une réservation pour un client.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="have-account">
              Déjà un compte client
            </TabsTrigger>
            <TabsTrigger value="no-account">Sans compte client</TabsTrigger>
          </TabsList>
          <TabsContent value="have-account">
            <Card>
              <CardHeader>
                <CardDescription>
                  Sélectionnez un client existant pour créer une réservation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="customer">Adresse Email du client</Label>
                  <ComboboxUser setCustomerId={setCustomerId} />
                </div>
                <FormContent
                  setIsSendEmail={setIsSendEmail}
                  setReservation={setReservation}
                />
              </CardContent>
              <CardFooter>
                <Button
                  disabled={isLoading}
                  isLoading={isLoading}
                  onClick={addReservation}
                >
                  Créer la réservation
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="no-account">
            <Card>
              <CardHeader>
                <CardDescription>
                  Créez une réservation pour un client qui n&apos;a pas de
                  compte existant. Il recevra un email pour créer un compte.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="customer">Adresse Email du client</Label>
                  <ComboboxUser setCustomerEmail={setCustomerEmail} />
                </div>
                <FormContent
                  setIsSendEmail={setIsSendEmail}
                  setReservation={setReservation}
                />
              </CardContent>
              <CardFooter>
                <Button
                  onClick={addReservation}
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Créer la réservation
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { defaultFetcherGet } from "@/lib/fetcher";
import { useCompany } from "@/store/dashboard";
import axios from "axios";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

export function ComboboxUser({
  setCustomerId,
  setCustomerEmail,
}: {
  setCustomerId?: (value: string) => void;
  setCustomerEmail?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const { companyId } = useCompany();
  const {
    data: customers,
    error,
    isLoading,
  } = useSWR(`/api/company/${companyId}/customers`, defaultFetcherGet);

  // Filtered list of customers based on input value
  const filteredCustomers = React.useMemo(() => {
    if (!value) return customers; // If input value is empty, return all customers
    return customers.filter((customer: { email: string; id: string }) =>
      customer.email.toLowerCase().includes(value.toLowerCase())
    );
  }, [customers, value]);

  if (error) return <div>Error...</div>;

  if (setCustomerEmail) {
    return (
      <Input
        type="email"
        onChange={(e) => setCustomerEmail(e.target.value)}
        placeholder="Entrez l'adresse email du client"
      />
    );
  }

  return (
    <div
      className="relative"
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <Input
        disabled={isLoading}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        placeholder={isLoading ? "Chargement..." : "Rechercher un client"}
        className="mt-2 text-white"
      />
      {open && (
        <div className="absolute top-[calc(100%+5px)] z-10 max-h-52 overflow-y-auto bg-background border border-gray-800 rounded-md ">
          {filteredCustomers.map((customer: any) => (
            <div
              key={customer.id}
              onMouseDown={(e) => {
                e.preventDefault();
                setCustomerId && setCustomerId(customer.id);
                setValue(customer.email);
                setOpen(false);
              }}
              className="p-2 hover:bg-primary cursor-pointer"
            >
              {customer.email}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function FormContent({
  setIsSendEmail,
  setReservation,
}: {
  setIsSendEmail: (value: boolean) => void;
  setReservation: (value: any) => void;
}) {
  return (
    <>
      <div className="my-2 flex flex-col">
        <Label htmlFor="start_at">Début de la réservation</Label>
        <Input
          onChange={(e) => {
            setReservation((prev: any) => ({
              ...prev,
              start_at: e.target.value,
            }));
          }}
          defaultValue={new Date().toISOString().slice(0, 16)}
          id="start_at"
          type="datetime-local"
          className="mt-2"
        />
      </div>

      <div className="my-2 flex flex-col">
        <Label htmlFor="end_at">Fin de la réservation</Label>
        <Input
          onChange={(e) => {
            setReservation((prev: any) => ({
              ...prev,
              end_at: e.target.value,
            }));
          }}
          defaultValue={new Date().toISOString().slice(0, 16)}
          id="end_at"
          type="datetime-local"
          className="mt-2 "
        />
      </div>

      <div className="my-2 flex flex-col">
        <Label htmlFor="price">Prix de la réservation / prestation</Label>
        <Input
          onChange={(e) => {
            setReservation((prev: any) => ({
              ...prev,
              price: e.target.value,
            }));
          }}
          id="price"
          type="number"
          className="mt-2 w-auto"
          defaultValue={0}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          defaultChecked
          onCheckedChange={(e) => setIsSendEmail(!!e)}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Envoyer un email d&apos;information au client
        </label>
      </div>
    </>
  );
}
