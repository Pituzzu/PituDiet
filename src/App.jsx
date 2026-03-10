import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "./index.css";
import Home from "./pages/Home"; // <--- DEVE ESSERE QUESTO
import Login from "./pages/Login"; // <--- E QUESTO
import Register from "./pages/Register"; // <--- E QUESTO
import Navbar from "./components/Navbar";
import Dieta from "./pages/Dieta";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 2. Definisci le rotte
const router = createBrowserRouter([
  {
    path: "/login", // Quando l'URL è "/login", Outlet diventa <Login />
    element: <Login />,
  },
  {
    path: "/register", // Quando l'URL è "/register", Outlet diventa <Register />
    element: <Register />,
  },
  {
    path: "/",
    element: <Navbar />, // Il guscio con la Navbar
    children: [
      {
        path: "/", // Quando l'URL è "/", Outlet diventa <Home />
        element: <Home />,
      },
      {
        path: "/dieta", // Quando l'URL è "/dieta", Outlet diventa <Dieta />
        element: <Dieta />,
      },
    ],
  },
]);

// 3. Esporta il Provider
function App() {
  return <RouterProvider router={router} />;
}

export default App;
