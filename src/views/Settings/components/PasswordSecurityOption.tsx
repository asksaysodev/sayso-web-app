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
                detail="Change the password you use to sign in."
                // Empty on purpose: the copy sits in the subtitle, and the description's flex keeps the footer at the bottom.
                description={null}
                action={
                    <Button variant="secondary" size="sm" aria-label="Change password" onClick={() => setShowModal(true)}>
                        Change
                    </Button>
                }
            />

            {showModal && <UpdatePasswordModal onClose={() => setShowModal(false)} />}
        </>
    );
}
