import SaysoButton from "./SaysoButton";
import { LAUNCH_COACH_URL } from "@/constants";

export default function LaunchCoachButton() {
    return (
        <SaysoButton
            fullWidth
            variant="blue"
            label="Launch Coach"
            onClick={() => { window.location.href = LAUNCH_COACH_URL; }}
        />
    )
}