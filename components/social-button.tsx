"use client"

import { Button } from "./ui/button";
import { IconType } from "react-icons";

interface SocialButtonProps {
    Icon : IconType
    onClick : () => void;
    disabled : boolean
}

const SocialButton : React.FC<SocialButtonProps> = ({
    Icon,
    onClick,
    disabled
}) => {
  return (
    <Button
    variant="outline"
    type="button"
    className="w-full shadow-md"
    onClick={onClick}
    disabled={disabled}
    >
        <Icon className="w-7 h-7"/>
    </Button>
  )
}

export default SocialButton