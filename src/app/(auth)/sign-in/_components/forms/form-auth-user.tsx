"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  // it's use when user is invited to a company -> but need to register first
  const userEmailFromInvite = searchParams.get("email");
  const userTokenFromInvite = searchParams.get("token");
  const userCompanyFromInvite = searchParams.get("company");
  const userSenderEmailFromInvite = searchParams.get("senderEmail");
  // it's use when user is invited to a company from reservation -> but need to register first
  const reservationId = searchParams.get("reservationId");

  const isUserFromInvite =
    userEmailFromInvite &&
    userTokenFromInvite &&
    userCompanyFromInvite &&
    userSenderEmailFromInvite;

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const schemaLogin = z.object({
    email: z
      .string()
      .email("L'adresse e-mail n'est pas valide. Veuillez réessayer."),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  });

  const schemaRegister = z
    .object({
      email: z
        .string()
        .email("L'adresse e-mail n'est pas valide. Veuillez réessayer."),
      password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
      confirmPassword: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
      firstname: z
        .string()
        .min(2, "Le prénom n'est pas valide. Veuillez réessayer."),
      lastname: z
        .string()
        .min(2, "Le nom n'est pas valide. Veuillez réessayer."),
      phoneNumber: z
        .string()
        .min(10, "Le numéro de téléphone doit avoir 10 chiffres")
        .max(10, "Le numéro de téléphone doit avoir 10 chiffres"),
    })
    .refine(
      (values) => {
        return values.password === values.confirmPassword;
      },
      {
        message: "Les mots de passe ne correspondent pas. Veuillez réessayer.",
        path: ["confirmPassword"],
      }
    );

  type FormValuesLogin = z.infer<typeof schemaLogin>;
  type FormValuesRegister = z.infer<typeof schemaRegister>;

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValuesLogin>({
    resolver: zodResolver(schemaLogin),
  });

  const {
    handleSubmit: handleSubmitRegister,
    register: registerRegister,
    formState: { errors: errorsRegister },
  } = useForm<FormValuesRegister>({
    resolver: zodResolver(schemaRegister),
  });

  const onSubmitLogin = async (data: FormValuesLogin) => {
    setIsLoading(true);
    try {
      // sign in user
      await signInUser(data);
      // if user is invited to a company from reservation -> link reservation to user
      if (isUserFromInvite && reservationId) {
        const user = await axios.get("/api/auth/me");
        await linkReservationToUser(user.data.id);
      }
      redirectToDestination();
    } catch (error) {
      console.error("[LOGIN_ERROR]", error);
      displayErrorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitRegister = async (data: FormValuesRegister) => {
    setIsLoading(true);
    try {
      const user = await createUserAccount(data);
      // if user is invited to a company from reservation -> link reservation to user
      if (isUserFromInvite && reservationId) {
        await linkReservationToUser(user.data.id);
      }
      await signInUser(data);

      redirectToDestination();
    } catch (error) {
      console.error("[REGISTER_ERROR]", error);
      displayErrorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createUserAccount = async (data: FormValuesRegister) => {
    const requestData = {
      ...data,
      reservationId,
      fromInvite: {
        email: userEmailFromInvite,
        token: userTokenFromInvite,
        company: userCompanyFromInvite,
        senderEmail: userSenderEmailFromInvite,
      },
    };
    return await axios.post("/api/auth", requestData);
  };

  const linkReservationToUser = async (customerId: string) => {
    const requestData = {
      reservationId,
      customerId,
    };
    await axios.post("/api/reservation/linkToUser", requestData);
  };

  type FormValues = FormValuesLogin | FormValuesRegister;

  const signInUser = async (data: FormValues) => {
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (!response?.ok) {
        console.log(response?.error);
        displayErrorMessage(response?.error);
      }
    } catch (error) {
      console.error("[LOGIN_ERROR]", error);
      displayErrorMessage(error);
    }
  };

  const redirectToDestination = () => {
    let destination = isUserFromInvite
      ? `/company/${userCompanyFromInvite}`
      : "/";
    if (reservationId) {
      destination = `/user/books`;
    }
    router.push(destination);
  };

  const displayErrorMessage = (error: any) => {
    const errorMessage =
      error.response?.data?.message || "Une erreur est survenue.";
    toast("Erreur", { description: errorMessage });
  };

  return (
    <Tabs
      defaultValue={isUserFromInvite ? "register" : "sign-in"}
      className="w-[500px] "
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sign-in">Sign-in</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="sign-in">
        <Card>
          <CardHeader>
            <div className="mb-5">
              <Image
                src="/assets/images/icon-bookEasy.png"
                alt="BookEasy"
                width={60}
                height={60}
                className="mr-2"
              />
            </div>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder à l&apos;application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <form onSubmit={handleSubmit(onSubmitLogin)}>
              <div className="space-y-1">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={isUserFromInvite ? userEmailFromInvite : ""}
                  placeholder="johndoe@gmail.com"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-sm text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="mt-3 space-y-1">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mot de passe..."
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-sm text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <Button
                disabled={isLoading}
                isLoading={isLoading}
                className={"mt-4 w-full"}
              >
                Connexion
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <div className="mb-5">
              <Image
                src="/assets/images/icon-bookEasy.png"
                alt="BookEasy"
                width={60}
                height={60}
                className="mr-2"
              />
            </div>
            <CardTitle>Inscription</CardTitle>
            <CardDescription>
              Créer un compte pour accéder à l&apos;application.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center space-y-2">
            <form
              className="w-full"
              onSubmit={handleSubmitRegister(onSubmitRegister)}
            >
              <div className="flex justify-around">
                <div className="mt-3 space-y-1">
                  <Label htmlFor="email">E-mail*</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={isUserFromInvite ? userEmailFromInvite : ""}
                    placeholder="johndoe@gmail.com"
                    {...registerRegister("email")}
                  />
                  {errorsRegister.email && (
                    <span className="text-sm text-red-500">
                      {errorsRegister.email.message}
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-1">
                  <Label htmlFor="firstname">Prénom*</Label>
                  <Input
                    id="firstname"
                    type="text"
                    placeholder="John"
                    {...registerRegister("firstname")}
                  />
                  {errorsRegister.firstname && (
                    <span className="text-sm text-red-500">
                      {errorsRegister.firstname.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex  justify-around">
                <div className="mt-3 space-y-1">
                  <Label htmlFor="lastname">Nom*</Label>
                  <Input
                    id="lastname"
                    type="text"
                    placeholder="Doe"
                    {...registerRegister("lastname")}
                  />
                  {errorsRegister.lastname && (
                    <span className="text-sm text-red-500">
                      {errorsRegister.lastname.message}
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-1">
                  <Label htmlFor="phoneNumber">Numéro</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="0102030405"
                    {...registerRegister("phoneNumber")}
                  />
                  {errorsRegister.phoneNumber && (
                    <span className="text-sm text-red-500">
                      {errorsRegister.phoneNumber.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-around">
                <div className="mt-3 space-y-1">
                  <Label htmlFor="passwordRegister">Mot de passe*</Label>
                  <Input
                    id="passwordRegister"
                    type="password"
                    placeholder="Mot de passe..."
                    {...registerRegister("password")}
                  />
                  {errorsRegister.password && (
                    <span className="text-sm text-red-500">
                      {errorsRegister.password.message}
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-1">
                  <Label htmlFor="confirmPasswordRegister">
                    Confirmer Mot de passe*
                  </Label>
                  <Input
                    id="confirmPasswordRegister"
                    type="password"
                    placeholder="Mot de passe..."
                    {...registerRegister("confirmPassword")}
                  />
                  {errorsRegister.confirmPassword && (
                    <span className="text-sm text-red-500">
                      {errorsRegister.confirmPassword.message}
                    </span>
                  )}
                </div>
              </div>

              <Button
                disabled={isLoading}
                isLoading={isLoading}
                className={"mt-4 w-full"}
              >
                {isUserFromInvite
                  ? "Finaliser votre invitation"
                  : "Inscription"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
