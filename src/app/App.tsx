import { RouterProvider } from "react-router";
import { MotionConfig } from "motion/react";
import { router } from "./routes";
import { ScrollProgress } from "./components/ScrollProgress";
import { ThemeProvider, useT } from "./context/ThemeContext";

function ThemedRoot() {
  const T = useT();
  return (
    <div className={`min-h-screen transition-colors duration-300 ${T.bg} ${T.text}`}>
      <RouterProvider router={router} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <ScrollProgress />
        <ThemedRoot />
      </MotionConfig>
    </ThemeProvider>
  );
}
