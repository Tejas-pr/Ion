'use client';

import { useState } from "react";
import Header from "./landing/header";
import { usePathname } from "next/navigation";

export function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide nav bar on auth screens (login / signup)
  const isAuthScreen = pathname === "/login" || pathname === "/signup";

  if (isAuthScreen) {
    return <>{children}</>;
  }

  const isWorkspace = pathname.startsWith("/workspace") || pathname === "/github";

  return (
    <div className={isWorkspace ? "h-screen flex flex-col relative overflow-hidden bg-background" : "min-h-screen flex flex-col relative"}>
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <div className={isWorkspace ? "pt-16 flex-1 flex overflow-hidden w-full" : "flex-1"}>
        {children}
      </div>
    </div>
  );
}
