import Link from "next/link";

import { SearchBar } from "../search/search";
import Image from "next/image";
import { getServerAuthSession } from "~/server/auth";

export default async function Navbar() {
  const session = await getServerAuthSession();
  return (
    <main className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full flex-col">
        <header className="sticky top-0 flex h-16 items-center gap-4  px-4 md:px-6">
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Image
                height={50}
                width={50}
                src={"/Aqua_Render.webp"}
                alt="logo"
              />
              {/* <HomeIcon className="h-6 w-6" /> */}
            </Link>

            <Link
              href="https://sora-anime.vercel.app"
              className="text-xl text-muted-foreground transition-colors hover:text-foreground"
            >
              Blog
            </Link>
            {session ? (
              <Link
                href="/api/auth/signout"
                className="t text-xl transition-colors hover:text-foreground"
              >
                SignOut
              </Link>
            ) : (
              <Link
                href="/api/auth/signin"
                className="text-xl transition-colors hover:text-foreground"
              >
                SigIn
              </Link>
            )}
            {/* <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Orders
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Products
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Customers
          </Link>
          <Link
            href="#"
            className="text-foreground hover:text-foreground transition-colors"
          >
            Settings
          </Link> */}
          </nav>

          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
              <div className="relative">
                <SearchBar />
              </div>
            </form>
          </div>
        </header>
      </div>
    </main>
  );
}
