"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FieldValue,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "../Modal";
import { Input } from "../ui/input";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import { HiPhoto } from "react-icons/hi2";
import { Button } from "../ui/button";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });

  const image = watch("image");
  const handleUpdate = (result: any) => {
    console.log(result);
    setValue("image", result?.info?.secure_url, {
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post(`/api/settings`, data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong."))
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} Close={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="border-b border-gray-900/10 pb-6">
            <h2 className="text-lg font-semibold leading-6 text-gray-500">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your public Information
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium leading-6 text-gray-600">
                  Name
                </label>
                <Input
                  disabled={isLoading}
                  id="name"
                  required
                  {...register("name")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-600">
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <div className="relative h-14 w-14">
                    <Image
                      fill
                      className="rounded-full flex-shrink-0 overflow-hidden object-cover bg-center"
                      alt="avatar"
                      src={
                        image || currentUser?.image || "/images/placeholder.jpg"
                      }
                    />
                  </div>
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpdate}
                    uploadPreset="Messanger_clone_shahmir"
                  >
                    <Button disabled={isLoading} variant="ghost" type="button">
                      Change
                    </Button>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row-reverse gap-3">
            <Button type="submit" variant="destructive" disabled={isLoading} >Submit</Button>
            <Button variant="secondary" disabled={isLoading} onClick={onClose}>Cancel</Button>
        </div>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
