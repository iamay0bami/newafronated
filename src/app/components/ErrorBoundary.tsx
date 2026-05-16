/**
 * ErrorBoundary
 * ─────────────────────────────────────────────────────────────────────────────
 * React error boundaries must be class components — there is no hook
 * equivalent for componentDidCatch. This catches any runtime error thrown
 * inside the component tree it wraps and renders a branded fallback instead
 * of a blank white/black page.
 *
 * Wrap the main content in Layout.tsx so the navbar and footer are always
 * protected from crashing, but page content errors are caught gracefully.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message ?? "An unexpected error occurred.",
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production you could send this to a logging service like Sentry
    console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: "" });
    // Navigate to home as a clean reset
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          color: "#fff",
          padding: "2rem",
          fontFamily: "Montserrat, Inter, sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "480px", width: "100%" }}>
          {/* Logo */}
          <img
            src="/logo-preloader.png"
            alt="Afronated"
            style={{
              height: "48px",
              width: "auto",
              margin: "0 auto 2rem",
              display: "block",
              filter: "invert(1)",
              mixBlendMode: "screen",
            }}
          />

          {/* Red accent */}
          <div
            style={{
              width: "32px",
              height: "3px",
              background: "#ef4444",
              margin: "0 auto 1.5rem",
            }}
          />

          <h1
            style={{
              fontSize: "clamp(1.5rem, 5vw, 2rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              marginBottom: "1rem",
            }}
          >
            SOMETHING WENT WRONG
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}
          >
            An unexpected error occurred. This has been noted.
            Head back to the homepage and everything should be fine.
          </p>

          <button
            onClick={this.handleReset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem 2rem",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#fff";
              (e.currentTarget as HTMLButtonElement).style.color = "#000";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#ef4444";
              (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            }}
          >
            BACK TO HOME
          </button>

          {/* Dev-only error message */}
          {import.meta.env.DEV && this.state.errorMessage && (
            <p
              style={{
                marginTop: "2rem",
                padding: "1rem",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "8px",
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                textAlign: "left",
                wordBreak: "break-word",
              }}
            >
              {this.state.errorMessage}
            </p>
          )}
        </div>
      </div>
    );
  }
}