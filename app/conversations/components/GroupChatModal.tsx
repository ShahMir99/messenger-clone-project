"use client";

import Modal from "@/components/Modal";
import Select from "@/components/Select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface GroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
  users,
}) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = watch("members");

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setLoading(true);
    axios
      .post("/api/conversations", { ...data, isGroup: true })
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setLoading(false));
  };

  return (
    <Modal isOpen={isOpen} Close={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="pb-12">
            <h2 className="text-lg font-semibold leading-6 text-gray-500">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your public Information
            </p>
            <div className="mt-5 flex flex-col gap-y-5">
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium leading-6 text-gray-600">
                  Name
                </label>
                <Input
                  disabled={isLoading}
                  id="name"
                  {...register("name" , {required : true})}
                />
              </div>
              <Select
                disabled={isLoading}
                label="Members"
                value={members}
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                onChange={(value) =>
                  setValue("members", value, {
                    shouldValidate: true,
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row-reverse gap-3">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 shadow-md hover:bg-blue-500/80"
          >
            Create
          </Button>
          <Button variant="secondary" disabled={isLoading} onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;
