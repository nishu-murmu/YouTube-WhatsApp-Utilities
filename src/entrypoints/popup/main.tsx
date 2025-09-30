import React from "react";
import ReactDOM from "react-dom/client";
import "~/assets/tailwind.css";
import ShortsLimitSettings from "@/components/ShortsLimitSettings";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ShortsLimitSettings />
  </React.StrictMode>
);
