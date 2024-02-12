"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import z from "zod";

import { AiFillGoogleCircle } from "react-icons/ai";

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
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Separator } from "@/components/ui/separator";

export default function UserAuthForm() {
  const [isLoading, setIsLloading] = useState(false);
  const router = useRouter();

  const schemaLogin = z.object({
    email: z
      .string()
      .email("L'adresse e-mail n'est pas valide. Veuillez réessayer."),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  });

  const schemaRegister = z.object({
    email: z
      .string()
      .email("L'adresse e-mail n'est pas valide. Veuillez réessayer."),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  });

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
    setIsLloading(true);
    try {
      await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      setIsLloading(false);
      router.push("/dashboard");
    } catch (err) {
      console.log("[LOGIN_ERROR]" + err);
    } finally {
      setIsLloading(false);
    }
  };

  const onSubmitRegister = async (data: FormValuesRegister) => {
    setIsLloading(true);
    try {
      await axios.post("/api/auth", data);
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });
        if (res?.error) {
          // user already exists
          toast.error("Cet utilisateur existe déjà.");
          console.log("[LOGIN_ERROR_AFTER_REGISTER]" + res.error);
          return;
        }
        setIsLloading(false);
        router.push("/dashboard");
      } catch (err) {
        console.log("[LOGIN_ERROR_AFTER_REGISTER]" + err);
      }
    } catch (err) {
      console.log("[REGISTER_ERROR]" + err);
    } finally {
      setIsLloading(false);
    }
  };

  return (
    <Tabs defaultValue="sign-in" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sign-in">Sign-in</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="sign-in">
        <Card>
          <CardHeader>
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
                className={cn("mt-4 w-full", isLoading && "opacity-50")}
              >
                Connexion
              </Button>
            </form>
          </CardContent>

          <Separator />

          <div className="my-5 flex w-full justify-center">
            <Button
              variant={"outline"}
              onClick={() => {
                signIn("google", { callbackUrl: "/dashboard" });
              }}
            >
              <AiFillGoogleCircle size={30} />
              <span className="ml-2">Sign-in with Google</span>
            </Button>
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Inscription</CardTitle>
            <CardDescription>
              Créer un compte pour accéder à l&apos;application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <form onSubmit={handleSubmitRegister(onSubmitRegister)}>
              <div className="space-y-1">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
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
                <Label htmlFor="passwordRegister">Mot de passe</Label>
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
              <Button
                disabled={isLoading}
                className={cn("mt-4 w-full", isLoading && "opacity-50")}
              >
                Inscription
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
