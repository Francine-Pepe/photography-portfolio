import type { ReactNode } from "react";
import "@/styles/admin/dashboard.scss";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
