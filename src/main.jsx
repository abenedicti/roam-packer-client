import ReactDOM from 'react-dom/client';
import App from '../src/App.jsx';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { AuthWrapper } from '../src/context/Auth.context.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthWrapper>
      <App />
    </AuthWrapper>
  </BrowserRouter>,
);
