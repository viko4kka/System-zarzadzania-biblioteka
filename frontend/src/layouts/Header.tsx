import type { ReactNode } from "react";
import HeaderBadge from "./components/Badge";

type HeaderProps = {
  children: ReactNode;
  isAdmin: boolean;
  isLoggedIn: boolean;
  firstName: string;
  lastName: string;
};

export default function Header({
  children,
  isAdmin,
  isLoggedIn,
  firstName,
  lastName,
}: HeaderProps) {
  return (
    <>
      <div className="fixed top-5.5 right-2 flex lg:right-15">
        {isAdmin && isLoggedIn && (
          <div className="mx-0 lg:mx-4">
            <HeaderBadge
              title="Administrator"
              cursor="default"
              bgColor="--color-highlight"
              color="--color-font-highlight"
            />
          </div>
        )}
        <div className="mx-0 lg:mx-4">
          {isLoggedIn ? (
            <HeaderBadge
              title={"Welcome, " + firstName + " " + lastName}
              href={isAdmin ? "/admin/profile" : "/user/profile"}
              color="--color-main-navy-blue"
              bgColor="--color-main-light-blue"
            />
          ) : (
            <HeaderBadge
              title="Log in"
              href="/login"
              color="--color-main-navy-blue"
              bgColor="--color-main-light-blue"
            />
          )}
        </div>
      </div>
      <div className="h-full w-full">{children}</div>
    </>
  );
}
