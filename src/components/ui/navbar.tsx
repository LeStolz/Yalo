import { Card } from "~/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { LogIn, LogOut, User2 } from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import favicon from "public/favicon.ico";

export function Navbar() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <Card className="sticky top-0 z-50 flex w-full rounded-none border-x-0 border-t-0 px-4 py-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={favicon.src} />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <Link href="/">Yalo</Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu className="ml-auto">
        <NavigationMenuList className="flex w-full items-center gap-4">
          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="hover:cursor-pointer hover:brightness-125"
                asChild
              >
                <Avatar>
                  <AvatarImage src={user?.image || ""} />
                  <AvatarFallback>
                    <User2 />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="mt-3" align="end">
                {user != null ? (
                  <>
                    <DropdownMenuItem>
                      <Link
                        href={`/users/${user.id}`}
                        className="flex items-center gap-2"
                      >
                        <User2 className="h-4 w-4" />
                        <span>{user?.email}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="flex items-center gap-2 text-destructive focus:bg-destructive focus:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem
                      onClick={() => signIn()}
                      className="flex items-center gap-2"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Log in</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </Card>
  );
}
