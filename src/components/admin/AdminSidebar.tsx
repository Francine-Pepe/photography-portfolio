import Link from "next/link";

import { ADMIN_NAVIGATION } from "@/data/admin/navigation";
import { ADMIN_LABELS } from "@/data/admin/labels";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <span>{ADMIN_LABELS.navigation.brand}</span>
        <small>{ADMIN_LABELS.navigation.subtitle}</small>
      </div>

      <nav>
        {ADMIN_NAVIGATION.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
