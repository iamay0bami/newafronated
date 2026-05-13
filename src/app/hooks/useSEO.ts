/**
 * useSEO
 *
 * Dynamically updates <title>, meta description, canonical, og:*, and
 * twitter:* tags on every route change.
 *
 * WHY THIS EXISTS:
 * The site is a React SPA. Every URL served gets the same index.html, so
 * every page shares the same static <title> and <meta description>. Search
 * engines (especially Bing/Edge) see identical metadata on /about, /careers,
 * /team etc., which:
 *   1. Prevents subpages from ranking for their own keywords.
 *   2. Causes "did you mean" confusion when the brand name is searched.
 *   3. Blocks site-links from appearing (Bing needs unique page signals).
 *
 * USAGE:
 *   Call useSEO() at the top of each page component with that page's data.
 *   The hook mutates the real DOM <head> on mount/update and cleans up on
 *   unmount, restoring the default index.html values.
 */

import { useEffect } from "react";

interface SEOProps {
  title: string;          // Full page title e.g. "About — Afronated"
  description: string;
  canonical?: string;     // Full URL e.g. "https://afronated.com/about"
  ogImage?: string;       // Defaults to the global OG image
  ogType?: string;        // Defaults to "website"
  noIndex?: boolean;      // Pass true for privacy/terms pages
}

const SITE_NAME    = "Afro-Nated";
const DEFAULT_OG   = "https://afronated.com/og-image.jpg";
const BASE_URL     = "https://afronated.com";
const DEFAULT_TITLE = "Afro-Nated — African Creative Media Collective";
const DEFAULT_DESC  =
  "Afro-Nated is a creative media collective amplifying African voices through powerful storytelling, spotlight interviews, and cultural excellence. Based in Africa.";

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG,
  ogType = "website",
  noIndex = false,
}: SEOProps) {
  useEffect(() => {
    // <title>
    document.title = title;

    // Basic meta
    setMeta("description", description);
    setMeta("title", title);
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");

    // Canonical
    const canonicalHref = canonical ?? BASE_URL + "/";
    setCanonical(canonicalHref);

    // Open Graph
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonicalHref, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:image", ogImage, "property");
    setMeta("og:site_name", SITE_NAME, "property");

    // Twitter / X
    setMeta("twitter:title", title, "name");
    setMeta("twitter:description", description, "name");
    setMeta("twitter:url", canonicalHref, "name");
    setMeta("twitter:image", ogImage, "name");

    // Cleanup: restore defaults when component unmounts (route change)
    return () => {
      document.title = DEFAULT_TITLE;
      setMeta("description", DEFAULT_DESC);
      setMeta("title", DEFAULT_TITLE);
      setMeta("robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
      setCanonical(BASE_URL + "/");
      setMeta("og:title", DEFAULT_TITLE, "property");
      setMeta("og:description", DEFAULT_DESC, "property");
      setMeta("og:url", BASE_URL + "/", "property");
      setMeta("og:type", "website", "property");
      setMeta("og:image", DEFAULT_OG, "property");
      setMeta("twitter:title", DEFAULT_TITLE, "name");
      setMeta("twitter:description", DEFAULT_DESC, "name");
      setMeta("twitter:url", BASE_URL + "/", "name");
      setMeta("twitter:image", DEFAULT_OG, "name");
    };
  }, [title, description, canonical, ogImage, ogType, noIndex]);
}