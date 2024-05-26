import React from 'react'
import ReactDOM from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import routerConfig from './routes/router';
import { CookiesProvider } from 'react-cookie';

const router = createBrowserRouter(routerConfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <NextUIProvider>
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <RouterProvider router={router} />
    </CookiesProvider>
  </NextUIProvider>
  // {/* </React.StrictMode> */}
  ,
)
