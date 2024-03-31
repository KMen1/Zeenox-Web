import { SignedIn, UserButton } from "@clerk/nextjs";
import { NavbarBackButton } from "./NavbarBackButton";

export async function Navbar() {
  return (
    <div className="w-full rounded-2xl border-2 bg-card px-4 py-3">
      <div className="flex justify-between">
        <div className="flex flex-1 justify-start">
          <NavbarBackButton />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <h1 className="pr-2 text-2xl font-semibold">Zeenox</h1>
        </div>
        <div className="flex flex-1 justify-end">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
