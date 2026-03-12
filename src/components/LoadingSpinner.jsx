import Lottie from 'lottie-react';
import spinnerAnimation from '../assets/spinner.json';

function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <Lottie animationData={spinnerAnimation} loop={true} />
    </div>
  );
}

export default LoadingSpinner;
