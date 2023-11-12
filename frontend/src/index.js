import React from "react";
import App from "./App";
import reactDOM from "react-dom/client";
import "./index.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "bootstrap/dist/css/bootstrap.min.css";
import { HelmetProvider } from "react-helmet-async";
import { Storeprovider } from "./Store";
const el = document.getElementById("root");

const root = reactDOM.createRoot(el);

root.render(
  <React.StrictMode>
    <Storeprovider>
      <HelmetProvider>
        <PayPalScriptProvider deferLoading={true}>
          <App></App>
        </PayPalScriptProvider>
      </HelmetProvider>
    </Storeprovider>
  </React.StrictMode>
);
