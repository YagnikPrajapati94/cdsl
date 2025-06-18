"use client"
import "./globals.css";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'; // ✅ CSS
import { useEffect } from "react";

import { ToastContainer } from 'react-toastify';



export default function RootLayout({ children }) {
  useEffect(() => {
    import("../../node_modules//bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return (
    <html lang="en">
      <ToastContainer />
      <body className="bg-light"

      >
        {children}
      </body>
    </html>
  );
}
