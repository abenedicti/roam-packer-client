import Lottie from 'lottie-react';
import NotFoundAnim from '../assets/404.json';

function NotFoundPage() {
  return (
    <div className="notfound-page">
      <h1>404 - PAGE NOT FOUND</h1>

      <div className="animation-container">
        <Lottie
          animationData={NotFoundAnim}
          loop={true}
          style={{ width: 300, height: 300 }}
        />
      </div>

      <p>Oops! The page you are looking for does not exist.</p>
    </div>
  );
}

export default NotFoundPage;
