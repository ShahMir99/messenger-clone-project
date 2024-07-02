"use client";

import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import { format } from "date-fns";
import { Fragment, useMemo, useState } from "react";
import { IoClose, IoTrash } from "react-icons/io5";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Avatar from "@/components/Avatar";
import ConfirmModal from "./ConfirmModal";
import AvatarGroup from "@/components/AvatarGroup";
import useActiveList from "@/app/hooks/userActiveList";

interface ProfileDrawerProps {
  data: Conversation & {
    users: User[];
  };
  isOpen: boolean;
  onClick: () => void;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  data,
  isOpen,
  onClick,
}) => {
  const otherUser = useOtherUser(data);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser[0]?.email!) !== -1;

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser[0]?.createdAt), "PP");
  }, [otherUser[0]?.createdAt]);

  const title = useMemo(() => {
    return data.name || otherUser[0]?.name;
  }, [data.name, otherUser[0]?.name]);

  const status = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }

    return isActive ? "Active" : "offline";
  }, [data]);

  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative" onClose={onClick}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-40" />
          </TransitionChild>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                <TransitionChild
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="w-screen max-w-sm">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white p-6 shadow-xl">
                      <div className="px-4 sm:px-6 ">
                        <div className="flex items-start justify-end">
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              onClick={onClick}
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            >
                              <span className="sr-only">Close Panel</span>
                              <IoClose size={23} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                          <div className="flex flex-col items-center">
                            <div className="mb-2">
                              {data.isGroup ? (
                                <AvatarGroup users={data.users} />
                              ) : (
                                <Avatar user={otherUser[0]} />
                              )}
                            </div>
                            <div>{title}</div>
                            <div className="text-sm text-gray-500">
                              {status}
                            </div>
                            <div className="flex gap-10 my-8">
                              <div className="flex flex-col gap-3 items-center hover:opacity-75 cursor-pointer">
                                <div
                                  onClick={() => setConfirmOpen(true)}
                                  className="w-10 h-10 bg-neutral-100 rounded-full flex justify-center items-center"
                                >
                                  <IoTrash size={25} />
                                </div>
                                <div className="text-sm font-light text-neutral-600">
                                  Delete
                                </div>
                              </div>
                            </div>
                            <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                              <dl className="space-y-8 sm:space-y-6">
                                {!data.isGroup && (
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                      Email
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                      {otherUser[0].email}
                                    </dd>
                                  </div>
                                )}
                                {!data.isGroup && (
                                  <>
                                    <hr />
                                    <div>
                                      <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                        Joined
                                      </dt>
                                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                        <time datetime={joinedDate}>
                                          {joinedDate}
                                        </time>
                                      </dd>
                                    </div>
                                  </>
                                )}
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ProfileDrawer;
