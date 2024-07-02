"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";

interface DesktopItems {
    label : string;
    Icon : any;
    href : string;
    onClick ? : () => void;
    active? : boolean
}

const DesktopItems : React.FC<DesktopItems> = ({
    label,
    Icon,
    href,
    onClick,
    active
}) => {

    const handleClick = () => {
        if(onClick){
            return onClick()
        }
    }

  return (
        <li onClick={handleClick} 
        className={cn(
        "group flex gap-y-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100",
        active && 'bg-gray-100 text-black'
        )}
        >
            <Link href={href}>
                <Icon className="h-6 w-6 shrink-0" />
            <span className="sr-only">{label}</span>
            </Link>
        </li>
  )
}

export default DesktopItems