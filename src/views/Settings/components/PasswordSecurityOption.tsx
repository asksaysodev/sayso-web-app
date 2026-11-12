import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ds/Button";
import SettingsCard, { SettingsCardTile } from "./SettingsCard";
import UpdatePasswordModal from "./UpdatePasswordModal";

export default function PasswordSecurityOption() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <SettingsCard
                tile={
                    <SettingsCardTile>
                        <KeyRound size={24} aria-hidden />
                    </SettingsCardTile>
                }
                title="Password"
                description="Change the password you use to sign in."
                action={<Button onClick={() => setShowModal(true)}>Update Password</Button>}
            />

            {showModal && <UpdatePasswordModal onClose={() => setShowModal(false)} />}
        </>
    );
}
