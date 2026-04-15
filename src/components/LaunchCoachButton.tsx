import SaysoButton from "./SaysoButton";

export default function LaunchCoachButton() {
    return (
        <SaysoButton
            fullWidth
            variant="blue"
            label="Launch Coach"
            onClick={() => { window.location.href = 'sayso://launch-coach'; }}
        />
    )
}