import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Preloader } from "./components/Preloader";
import { ScrollProgress } from "./components/ScrollProgress";
import { ThemeProvider, useT } from "./context/ThemeContext";

function ThemedRoot() {
  const T = useT();
  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${T.bg} ${T.text}`}>
      <RouterProvider router={router} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Preloader />
      <ScrollProgress />
      <ThemedRoot />
    </ThemeProvider>
  );
}
