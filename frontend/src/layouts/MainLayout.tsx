import Header from "./Header";
import type { ReactNode } from "react";
import { slide as Menu } from "react-burger-menu";
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import { useLoggedInUserData } from "../hooks/user/useLoggedInUserData";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const [menuIsOpened, setMenuIsOpened] = useState<boolean>(false);
  const { user, isLoading, isUnauthorized } = useLoggedInUserData();

  const isAdmin: boolean = !isLoading && user?.isAdmin ? user?.isAdmin : false;
  const isLoggedIn: boolean = !isLoading && !isUnauthorized;
  const userDetails: { firstName: string; lastName: string } = {
    firstName: !isLoading && user?.name ? user?.name : "",
    lastName: !isLoading && user?.lastname ? user?.lastname : "",
  };

  return (
    <>
      <Menu
        width={"350px"}
        isOpen={menuIsOpened}
        customBurgerIcon={false}
        onStateChange={(state) => setMenuIsOpened(state.isOpen)}
        outerContainerId="outer-container"
        pageWrapId="page-wrap"
      >
        <button
          className="xs:top-4.5 text-main-navy-blue xs:text-5xl fixed top-6 left-5 cursor-pointer text-4xl lg:hidden"
          onClick={() => setMenuIsOpened((s) => !s)}
        >
          <IoCloseOutline />
        </button>
        <Sidebar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
      </Menu>
      <div
        className="flex h-screen max-h-screen min-h-screen w-screen max-w-screen overflow-y-hidden bg-gray-50"
        id="page-wrap"
      >
        <button
          className="xs:top-4.5 text-main-navy-blue xs:text-5xl fixed top-6 left-5 z-50 cursor-pointer text-4xl lg:hidden"
          onClick={() => setMenuIsOpened((s) => !s)}
        >
          <IoMenuOutline />
        </button>
        <div className="sticky top-0 left-0 hidden h-screen lg:grid">
          <Sidebar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
        </div>
        <div className="min-w-0 flex-1">
          <Header
            firstName={userDetails.firstName}
            lastName={userDetails.lastName}
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
          >
            <main className="h-full w-full flex-1 overflow-x-hidden overflow-y-auto p-4 pt-16 lg:p-16 lg:pt-24">
              <div className="">{children}</div>
            </main>
          </Header>
        </div>
      </div>
    </>
  );
}
