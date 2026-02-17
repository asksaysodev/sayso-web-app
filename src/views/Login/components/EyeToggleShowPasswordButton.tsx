import { Dispatch, SetStateAction } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

interface Props {
    showPassword: boolean;
    setShowPassword: Dispatch<SetStateAction<boolean>>;
}

export default function EyeToggleShowPasswordButton({ showPassword, setShowPassword }: Props) {
     return (
         <button
             type="button"
             className="passwordToggleButton"
             onClick={() => setShowPassword(prev => !prev)}
             aria-label={showPassword ? 'Hide password' : 'Show password'}
         >
             {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
         </button>
     )
 }
