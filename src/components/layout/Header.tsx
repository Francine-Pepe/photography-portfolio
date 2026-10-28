import Link from "next/link";
import { navigation } from "@/data/navigation";

function Header() {
  return (
    <header>
      <nav className="site-nav aria-label='Main site navigation'>">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export default Header;
