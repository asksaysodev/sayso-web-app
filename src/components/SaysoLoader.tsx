import '../styles/SaysoLoader.css';

import saysoLogo from '/assets/sayso.svg';

export default function SaysoLoader() {
	return (
		<div className="sayso-loader-container">
			<div className="sayso-loader-logo-container">
				<img src={saysoLogo} alt="Sayso Logo" />
			</div>
			<div className="sayso-loader-spinner"></div>
		</div>
	);
}