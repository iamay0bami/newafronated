import { createBrowserRouter } from "react-router";
import { Layout } from "./layouts/Layout";
import { Home } from "./pages/Home";
import { Submit } from "./pages/Submit";
import { Partner } from "./pages/Partner";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { Careers } from "./pages/Careers";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "submit", Component: Submit },
      { path: "partner", Component: Partner },
      { path: "careers", Component: Careers },
      { path: "privacy", Component: Privacy },
      { path: "terms", Component: Terms },
    ],
  },
]);