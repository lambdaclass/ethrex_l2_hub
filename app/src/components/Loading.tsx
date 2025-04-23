import { useState } from "react";

export default function Loading() {
  const [ellipsis, setEllipsis] = useState<string>(".");
  setInterval(() => setEllipsis(".".repeat((ellipsis.length + 1) % 4)), 500);

  return <div className="mt-3">Loading{ellipsis}</div>;
}
