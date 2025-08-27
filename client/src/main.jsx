import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './route/index';
import { Provider } from 'react-redux';
import { store } from './store/store';
import GlobalProvider from './provider/GlobalProvider'; // ✅ Import here

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <GlobalProvider>  {/* ✅ Now context will be available */}
        <RouterProvider router={router} />
      </GlobalProvider>
    </Provider>
  </StrictMode>
);
// Without GlobalProvider, every page/component would have to:

// Write its own API call for cart/orders/addresses.

// Recalculate totals separately.

// Repeat the same logic many times.

// With GlobalProvider, you:
// Write once, use everywhere.
//  Any component (like navbar, checkout page, product detail) can simply call: