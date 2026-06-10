import { useEffect, useState } from "react";
import CustomPagination from "../../../ui/CustomPagination";
import { Button } from "../../../ui/Button";
import { MdMoreVert } from "react-icons/md";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";
import { useUsersList } from "../../../hooks/user/use-users-list";
import { usePagination } from "../../../hooks/pagination/use-pagination";
import { useLoggedInUserData } from "../../../hooks/user/useLoggedInUserData";
import { useMakeAdmin } from "../../../hooks/user/use-make-admin";
import Badge from "../../../ui/Badge";
import {
  FaLock,
  FaLockOpen,
  FaUnlock,
  FaTrashAlt,
  FaSearch,
} from "react-icons/fa";
import { useBan } from "../../../hooks/user/use-ban";
import { useUnban } from "../../../hooks/user/use-unban";
import { useRemoveUser } from "../../../hooks/auth/useRemoveUser";
import CustomModal from "../../../ui/CustomModal";
import { MdSupervisorAccount } from "react-icons/md";

const UserBadge = () => (
  <Badge
    label="User"
    color="var(--color-main-blue)"
    bgColor=""
    maxWidth="10rem"
  />
);

const AdminBadge = () => (
  <Badge
    label="Administrator"
    color="var(--color-font-highlight)"
    bgColor=""
    maxWidth="10rem"
  />
);

const ActiveBadge = () => (
  <Badge
    label="Active"
    color="var(--color-green-700)"
    bgColor="var(--color-greenBg)"
    maxWidth="8rem"
  />
);

const BannedBadge = () => (
  <Badge
    label="Banned"
    color="var(--color-red-600)"
    bgColor="var(--color-red-100)"
    maxWidth="8rem"
  />
);

const DeletedBadge = () => (
  <Badge
    label="Removed"
    color="var(--color-gray-500)"
    bgColor="var(--color-gray-200)"
    maxWidth="8rem"
  />
);

function AUsers() {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{
    id: string;
    name: string;
    lastname: string;
    role: string;
    mail: string;
  }>({
    id: "",
    name: "",
    lastname: "",
    role: "",
    mail: "",
  });

  const { user, isLoading, isUnauthorized } = useLoggedInUserData();

  const pagination = usePagination();

  const { page, limit, goToPage } = pagination;

  const [search, setSearch] = useState<string | undefined>(undefined);

  const users = useUsersList({
    limit: limit,
    page: page,
    search: search,
  });

  const ban = useBan();
  const unban = useUnban();
  const remove = useRemoveUser();
  const makeAdmin = useMakeAdmin();

  const commonCellStyle = "border border-solid border-gray-300 p-4";
  const headerCellStyle = "border border-solid border-gray-300 p-3 font-normal";

  return (
    <>
      <CustomModal
        isOpened={isOpened}
        onClose={() => {
          setIsOpened(false);
        }}
      >
        <CustomModal.Content className="text-center">
          <div className="text-main-navy-blue mx-4 my-4 mb-8 text-lg font-bold lg:mx-16">
            Are you sure you want to delete this user?
          </div>
          <div className="my-2 text-sm lg:text-base">
            User:{" "}
            <span className="text-main-blue ml-2 max-w-full truncate">{`${modalData.name} ${modalData.lastname}`}</span>
          </div>
          <div className="my-2 text-sm lg:text-base">
            Email:{" "}
            <span className="text-main-blue ml-2 max-w-full truncate">
              {modalData.mail}
            </span>
          </div>
          <div className="my-2 mb-6 text-sm lg:text-base">
            Role:{" "}
            <span className="text-main-blue ml-2 max-w-full truncate">
              {modalData.role}
            </span>
          </div>
        </CustomModal.Content>
        <CustomModal.Footer>
          <Button
            intent="third"
            className="mx-2 h-10 w-24 p-0 lg:mx-8 lg:w-32"
            onClick={() => {
              setIsOpened(false);
            }}
          >
            Cancel
          </Button>
          <Button
            intent="secondary"
            className="mx-2 h-10 w-24 p-0 lg:mx-8 lg:w-32"
            onClick={() => {
              remove.mutate({ id: modalData.id, data: null });
              setIsOpened(false);
            }}
          >
            Yes
          </Button>
        </CustomModal.Footer>
      </CustomModal>
      <div className="mt-12">
        <h1 className="text-main-navy-blue my-5 text-2xl">Users overview</h1>
        <div className="px- flex items-center rounded-xl border border-gray-300 bg-white px-2 py-0 lg:px-6 lg:py-2">
          <span className="text-lg text-gray-400">
            <FaSearch />
          </span>
          <input
            placeholder="Search users"
            className="ml-2lg:ml-8 w-full bg-white p-2 focus:outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              goToPage(1);
            }}
          />
        </div>
        <div className="w-full max-w-full min-w-0 overflow-x-auto">
          <table
            style={{ minWidth: "900px" }}
            className="my-8 w-full table-auto rounded-xl border border-solid border-gray-300"
          >
            <thead className="bg-gray-100 font-light text-gray-600">
              <tr>
                <th className={headerCellStyle}>User</th>
                <th className={headerCellStyle}>Email</th>
                <th className={headerCellStyle}>Role</th>
                <th className={headerCellStyle}>Status</th>
                <th className={headerCellStyle}></th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {users.isSuccess ? (
                users.data.users.map((item, id) => (
                  <tr key={id}>
                    <td className={`${commonCellStyle} max-w-120`}>
                      <div className="text-main-navy-blue flex items-center justify-center truncate text-center">
                        {`${item.name} ${item.lastname}`}
                        <span className="text-main-blue ml-2">
                          {user?.mail === item.mail && "(You)"}
                        </span>
                      </div>
                    </td>
                    <td className={`${commonCellStyle} min-w-32 text-center`}>
                      {item.mail}
                    </td>
                    <td className={`${commonCellStyle} w-48 text-center`}>
                      {item.is_Admin ? <AdminBadge /> : <UserBadge />}
                    </td>
                    <td className={`${commonCellStyle} w-40 text-center`}>
                      {item.is_Removed ? (
                        <DeletedBadge />
                      ) : item.is_Banned ? (
                        <BannedBadge />
                      ) : (
                        <ActiveBadge />
                      )}
                    </td>
                    <td className={`${commonCellStyle} w-12 text-center`}>
                      <Menu
                        menuButton={
                          <Button
                            className={`${user?.mail === item.mail || item.is_Removed ? "cursor-not-allowed" : "cursor-pointer"} text-xl`}
                            disabled={
                              user?.mail === item.mail || item.is_Removed
                            }
                          >
                            <MdMoreVert />
                          </Button>
                        }
                        transition
                        menuClassName={() => "bg-gray-100"}
                      >
                        {item.is_Banned ? (
                          <MenuItem
                            onClick={() => {
                              unban.mutate(item.id);
                            }}
                          >
                            <span className="text-main-navy-blue flex items-center">
                              <span className="text-main-navy-blue mr-2">
                                <FaUnlock />
                              </span>
                              Unban
                            </span>
                          </MenuItem>
                        ) : (
                          <MenuItem
                            onClick={() => {
                              ban.mutate(item.id);
                            }}
                          >
                            <span className="text-main-navy-blue flex items-center">
                              <span className="text-main-navy-blue mr-2">
                                <FaLock />
                              </span>
                              Ban
                            </span>
                          </MenuItem>
                        )}

                        {!item.is_Admin && !item.is_Banned && (
                          <MenuItem
                            onClick={() => {
                              makeAdmin.mutate(item.id);
                            }}
                          >
                            <span className="text-main-navy-blue flex items-center">
                              <span className="text-main-navy-blue mr-2">
                                <MdSupervisorAccount />
                              </span>
                              Make admin
                            </span>
                          </MenuItem>
                        )}

                        <MenuItem
                          onClick={() => {
                            setModalData({
                              id: item.id,
                              name: item.name,
                              lastname: item.lastname,
                              role: item.is_Admin ? "Administrator" : "User",
                              mail: item.mail,
                            });
                            setIsOpened(true);
                            // remove.mutate({ id: item.id, data: null });
                          }}
                        >
                          <span className="flex items-center text-red-700">
                            <span className="mr-2 text-red-700">
                              <FaTrashAlt />
                            </span>
                            Remove
                          </span>
                        </MenuItem>
                      </Menu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr> No data</tr>
              )}
            </tbody>
          </table>
        </div>
        <CustomPagination
          pagination={pagination}
          totalPages={users.data?.meta.totalPages as number}
        />
      </div>
    </>
  );
}

export default AUsers;
