import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import 'bootstrap';
import 'bootstrap/js/dist/alert';
// Require Sass file so webpack can build it
import 'bootstrap/dist/css/bootstrap.css';
import { Connect } from '@stacks/connect-react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Connect
      authOptions={{
        appDetails: {
          name: 'Fast Pool Members',
          icon: window.location.origin + '/logo.png',
        },
        redirectTo: '/',
        onFinish: () => {
          window.location.reload();
        },
      }}
    >
      <App />
    </Connect>
  </React.StrictMode>
);
