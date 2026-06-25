import NavLink from "./NavLink";
import { BiLogOut } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import CustomModal from "../../ui/CustomModal";
import { BiBookBookmark, BiFolder, BiHistory, BiUser } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { JSX } from "react";
import LogInRequirementModal from "./LogInRequirementModal";
import { useLogout } from "../../hooks/auth/useLogOut";
import { Button } from "../../ui/Button";

type SidebarProps = {
  isAdmin: boolean;
  isLoggedIn: boolean;
};

type NavLinkType = {
  label: string;
  path: string;
  Icon: () => JSX.Element;
};

const guestNavLinks: NavLinkType[] = [
  {
    path: "/catalog",
    Icon: () => <BiFolder />,
    label: "Catalog",
  },
  {
    path: "/user/loans",
    Icon: () => <BiBookBookmark />,
    label: "Loans",
  },
  {
    path: "/user/history",
    Icon: () => <BiHistory />,
    label: "History",
  },
  {
    path: "/user/profile",
    Icon: () => <FiSettings />,
    label: "My profile",
  },
];

const userNavLinks: NavLinkType[] = [
  {
    path: "/catalog",
    Icon: () => <BiFolder />,
    label: "Catalog",
  },
  {
    path: "/user/loans",
    Icon: () => <BiBookBookmark />,
    label: "Loans",
  },
  {
    path: "/user/history",
    Icon: () => <BiHistory />,
    label: "History",
  },
  {
    path: "/user/profile",
    Icon: () => <FiSettings />,
    label: "My profile",
  },
];

const adminNavLinks: NavLinkType[] = [
  {
    path: "/catalog",
    Icon: () => <BiFolder />,
    label: "Catalog",
  },
  {
    path: "/admin/loans",
    Icon: () => <BiBookBookmark />,
    label: "Loans",
  },
  {
    path: "/admin/history",
    Icon: () => <BiHistory />,
    label: "History",
  },
  {
    path: "/admin/users",
    Icon: () => <BiUser />,
    label: "Users",
  },
  {
    path: "/admin/profile",
    Icon: () => <FiSettings />,
    label: "My profile",
  },
];

export default function Sidebar({ isAdmin, isLoggedIn }: SidebarProps) {
  const { logout } = useLogout();

  const [logoutModalOpened, setLogoutModalOpened] = useState<boolean>(false);
  const [loginModalOpened, setLoginModalOpened] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  //const userOrAdminNavLinks =isAdmin ? adminNavLinks : userNavLinks
  const choosenNavLinks = isLoggedIn
    ? isAdmin
      ? adminNavLinks
      : userNavLinks
    : guestNavLinks;

  return (
    <>
      <CustomModal
        isOpened={logoutModalOpened}
        onClose={() => {
          setLogoutModalOpened(false);
        }}
      >
        <CustomModal.Content className="text-main-navy-blue flex h-28 items-center justify-center text-center text-2xl">
          Are you sure you want to log out?
        </CustomModal.Content>
        <CustomModal.Footer className="flex w-full justify-center text-xl">
          <Button
            intent="third"
            onClick={() => {
              setLogoutModalOpened(false);
            }}
            className="mr-2 h-10 w-24 lg:mr-6 lg:w-32"
          >
            No
          </Button>
          <Button
            intent="secondary"
            onClick={logout}
            className="ml-2 h-10 w-24 lg:ml-6 lg:w-32"
          >
            Yes
          </Button>
        </CustomModal.Footer>
      </CustomModal>

      <LogInRequirementModal
        onClose={() => {
          setLoginModalOpened(false);
        }}
        isOpened={loginModalOpened}
      />
      <div className="z-10 flex h-full w-[320px] min-w-xs flex-col justify-between border-r border-gray-200 bg-white shadow-sm">
        <div>
          <div className="mt-12 mb-16 flex w-full place-content-center">
            <img className="w-40" src="/logo.png" />
          </div>
          {choosenNavLinks.map((navLink, idx) => {
            return (
              <NavLink
                key={"navLink" + idx}
                path={navLink.path}
                label={navLink.label}
                Icon={navLink.Icon}
                active={location.pathname === navLink.path}
                onClick={(e) => {
                  e.preventDefault();
                  const splittedPath = navLink.path.split("/");
                  if (isLoggedIn) {
                    navigate(navLink.path);
                  } else if (
                    splittedPath[1] === "admin" ||
                    splittedPath[1] === "user"
                  ) {
                    setLoginModalOpened(true);
                  } else {
                    navigate(navLink.path);
                  }
                }}
              />
            );
          })}
        </div>

        {isLoggedIn && (
          <Link
            to=""
            onClick={() => {
              setLogoutModalOpened(true);
            }}
            className="m-3 mx-4 mb-12 flex h-12 items-center rounded-lg px-8 transition-all duration-300 hover:bg-red-100 hover:text-red-600"
          >
            <span className="mr-4 text-2xl">
              {" "}
              <BiLogOut />
            </span>
            Log out
          </Link>
        )}
      </div>
    </>
  );
}
