"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (metric.name === "LCP") {
      console.log("[WebVitals] LCP:", metric.value);
    }
  });
  return null;
}
