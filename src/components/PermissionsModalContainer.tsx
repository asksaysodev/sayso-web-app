import { useCoachWindowStore } from '../store/coachWindowStore';
import SaysoModal from './SaysoModal';

/**
 * Permissions modal for microphone and screen recording access
 * Controlled by coachWindowStore - shown when user tries to open coach window without permissions
 */
export default function PermissionsModalContainer() {
    const showPermissionsModal = useCoachWindowStore(state => state.showPermissionsModal);
    const needsSystemSettings = useCoachWindowStore(state => state.needsSystemSettings);
    const requestPermissions = useCoachWindowStore(state => state.requestPermissions);
    const closePermissionsModal = useCoachWindowStore(state => state.closePermissionsModal);
    const openCoachWindow = useCoachWindowStore(state => state.openCoachWindow);

    if (!showPermissionsModal) return null;

    async function handleAllow() {
        if (needsSystemSettings) {
            closePermissionsModal();
            return;
        }

        const granted = await requestPermissions();
        
        if (granted) {
            await openCoachWindow();
        }
    }

    function handleDeny() {
        closePermissionsModal();
    }

    const modalContent = needsSystemSettings
        ? {
            title: "Permissions Required",
            text: "Please enable Microphone and Screen & System Audio Recording permissions in System Settings > Privacy & Security, then try again.",
            primaryText: "OK"
        }
        : {
            title: "We need some permissions to work",
            text: "Sayso needs access to your microphone and screen and system audio recording to provide insights during your calls. We only use these when you launch a session.",
            primaryText: "Allow"
        };

    return (
        <SaysoModal
            title={modalContent.title}
            text={modalContent.text}
            isDelete={false}
            onDeny={handleDeny}
            onConfirm={handleAllow}
            primaryText={modalContent.primaryText}
            secondaryText="Cancel"
        />
    );
}
