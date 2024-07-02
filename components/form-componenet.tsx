"use client";

import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import SocialButton from "./social-button";

import { FaGithub} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import axios from "axios";
import {toast} from "react-hot-toast"
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Variant = "LOGIN" | "REGISTER";

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().min(1),
  password: z.string().min(1),
});

const FormComponenet = () => {
  const session = useSession();
  const router = useRouter()

  useEffect(() => {
    if(session?.status === "authenticated"){
     router.push("/user")
    }
  },[session?.status])


  const [Variant, setVaiant] = useState<Variant>("LOGIN");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = (values: z.infer<typeof formSchema>) => {

    if (Variant === "REGISTER") {
      axios.post("/api/register" , values)
      .then(() => signIn('credentials', values))
      .catch(() => toast.error("something went wrong"))
    }


    if (Variant === "LOGIN") {
     signIn('credentials' , {
      ...values,
      redirect : false
     }).then((callback) => {
      if(callback?.error){
        toast.error("Invalid Credentials")
      }
      if(callback?.ok){
        toast.success("Logged in!")
        router.push("/user")
      }
     })

    }


  };

  const socialAction = (action : string) => {
      signIn(action , {
        redirect : false
      }).then((callback) => {
        if(callback?.error){
          toast.error("Invalid Credentials")
        }
        if(callback?.ok){
          router.push("/user")
          toast.success("Logged in!")
        }
      })
  };

  const toggleVariant = () => {
    if (Variant === "LOGIN") {
      setVaiant("REGISTER");
    }
    if (Variant === "REGISTER") {
      setVaiant("LOGIN");
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex flex-col gap-y-3">
            {Variant === "REGISTER" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name"
                        className=" placeholder:text-gray-400"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
                      className=" placeholder:text-gray-400"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="password"
                      className=" placeholder:text-gray-400"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="w-full">
              <Button
                type="submit"
                disabled={isLoading}
                className="
                mt-3
                w-full
               bg-blue-500
               shadow-md
               hover:bg-blue-500/80
               "
              >
                {Variant === "LOGIN" ? "Sign in" : "Sign up"}
              </Button>
            </div>
            <div className="mt-3">
              <div className="relative">
                <div
                  className="
                absolute 
                inset-0 
                flex 
                items-center
              "
                >
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <SocialButton Icon={FaGithub} onClick={() => socialAction('github')}  disabled={isLoading}/>
              <SocialButton Icon={FcGoogle} onClick={() => socialAction('google')}  disabled={isLoading}/>
            </div>
            <div
              className="
            flex
            items-center
            justify-center
            gap-2
            text-sm
            mt-2
            px-2
            text-gray-500
            "
            >
              <div>
                {Variant === "LOGIN"
                  ? " New to messanger?"
                  : "Already have an account?"}
              </div>
              <div
                onClick={toggleVariant}
                className="underline cursor-pointer text-blue-800/80"
              >
                {Variant === "LOGIN" ? "Create an account" : "Login"}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormComponenet;
