import { lucia, validateRequest } from "@/lib/auth";
import { IconLogout } from "@tabler/icons-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { NavbarBackButton } from "./NavbarBackButton";

export async function Navbar() {
  const { user } = await validateRequest();

  return (
    <div className="mb-4 w-full rounded-2xl border-2 bg-card px-4 py-3">
      <div className="flex justify-between">
        <div className="flex flex-1 justify-start">
          <NavbarBackButton />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <h1 className="pr-2 text-2xl font-semibold">Zeenox</h1>
        </div>

        <div className="flex flex-1 items-center justify-end">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback>{user?.username}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <form action={logout}>
                    <button className="flex items-center">
                      <IconLogout className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}

async function logout(): Promise<ActionResult> {
  "use server";
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}

interface ActionResult {
  error: string | null;
}
