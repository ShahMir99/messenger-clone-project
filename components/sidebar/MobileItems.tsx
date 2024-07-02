"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";

interface MobileItemsProp {
    Icon : any;
    href : string;
    onClick ? : () => void;
    active? : boolean
}

const MobileItems : React.FC<MobileItemsProp> = ({
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
    <Link onClick={handleClick} href={href} className={cn("group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100",
    active && "bg-gray-100 text-black")}>
        <Icon className="w-6 h-6 "/>
    </Link>
  )
}

export default MobileItems