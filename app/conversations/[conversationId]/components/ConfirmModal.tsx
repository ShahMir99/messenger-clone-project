"use client"

import useConversation from "@/app/hooks/useConversation";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle } from "@headlessui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import {FiAlertTriangle} from "react-icons/fi"

interface ConfirmModalProps {
    isOpen : boolean;
    onClose : () => void;
}

const ConfirmModal : React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose
}) => {
    
    const router = useRouter()
    const {conversationId} = useConversation()
    const [isLoading, setIsLoading] = useState(false)

    const onDelete = useCallback(() => {
        setIsLoading(true)
        axios.delete(`/api/conversations/${conversationId}`).then(() => {
            onClose();
            router.push("/conversations");
            router.refresh()
        }).catch(() => toast.error("Something went wrong.")).finally(() => setIsLoading(false))
    },[conversationId,router,onClose])

  return (
    <Modal isOpen={isOpen} Close={onClose}>
        <div className="sm:flex sm:items-start md:p-0 p-5">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <FiAlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-600">
                    Delete Conversation
                </DialogTitle>
                <div className="mt-2">
                    <p className="text-sm text-gray-500">
                        Are you sure you want to delete the conversation ? This action cannot be undone
                    </p>
                </div>
            </div>
        </div>
        <div className="mt-5 flex flex-row-reverse gap-3">
            <Button variant="destructive" disabled={isLoading} onClick={onDelete}>Delete</Button>
            <Button variant="secondary" disabled={isLoading} onClick={onClose}>Cancel</Button>
        </div>
    </Modal>
  )
}

export default ConfirmModal