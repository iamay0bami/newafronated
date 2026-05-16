import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
import { ErrorBoundary } from "../components/ErrorBoundary";

export function Layout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      {/*
        ErrorBoundary wraps only the page content (Outlet), not the Navbar
        or Footer. This means if a page crashes, the nav still works and
        the user can navigate away without needing a full browser refresh.
      */}
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
      <Footer />
    </>
  );
}