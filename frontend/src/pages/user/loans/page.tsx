import { useState } from "react";
import CustomPagination from "../../../ui/CustomPagination";
import { Button } from "../../../ui/Button";
import CustomModal from "../../../ui/CustomModal";
import { usePagination } from "../../../hooks/pagination/use-pagination";
import { useActiveLoans } from "../../../hooks/loan/use-active-loans-data";
import { useReturnBook } from "../../../hooks/loan/use-return-book";
import type { LoansAuthorDto } from "../../../api/loan/loan.types";

function ULoans() {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{ title: string; id: string }>({
    title: "",
    id: "",
  });

  const pagination = usePagination();
  const { page, limit } = pagination;

  const activeLoansQuery = useActiveLoans({
    limit: limit,
    page: page,
  });
  const returnBook = useReturnBook();

  const formatDate = (date: Date) => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();

    return `${d}-${m}-${y}`;
  };

  const formatAuthors = (authors: LoansAuthorDto[]): string => {
    const authorsStrs =
      authors.length > 0
        ? authors.map((item) => `${item.author_name} ${item.author_lastname}`)
        : [""];

    return authorsStrs.join(", ");
  };

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
        <CustomModal.Content className="m-5 max-w-96 min-w-0 overflow-hidden text-center">
          <p className="text-main-navy-blue">
            Are you sure you want to return this book?
          </p>
          <p className="text-main-blue mt-5 line-clamp-5 font-bold wrap-break-word">
            {modalData.title}
          </p>
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
              returnBook.mutate(modalData.id);
              setIsOpened(false);
            }}
          >
            Yes
          </Button>
        </CustomModal.Footer>
      </CustomModal>

      <div className="mt-12">
        <h1 className="text-main-navy-blue my-5 text-2xl">My loans</h1>
        <h2 className="text-main-navy-blue-hover text-lg">
          You have{" "}
          {activeLoansQuery.isSuccess
            ? activeLoansQuery.data.data.length.toString() + " "
            : " -- "}{" "}
          books borrowed
        </h2>

        <div className="w-full overflow-x-auto">
          <table className="my-8 hidden w-full min-w-225 table-auto rounded-xl border border-solid border-gray-300 md:table">
            <thead className="bg-gray-100 font-light text-gray-600">
              <tr>
                <th className={`${headerCellStyle}`}>Book</th>
                <th className={`${headerCellStyle} w-44`}>Loan date</th>

                <th className={`${headerCellStyle} w-24`}></th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {activeLoansQuery.isSuccess &&
                activeLoansQuery.data.data.length > 0 &&
                activeLoansQuery.data.data.map((item, id) => (
                  <tr key={id}>
                    <td className={`${commonCellStyle} max-w-120`}>
                      <div className="text-main-navy-blue truncate text-balance">
                        {item.copy.book.title}
                      </div>
                      <div className="truncate text-sm font-light text-balance text-gray-500">
                        {formatAuthors(item.copy.book.authors)}{" "}
                      </div>
                    </td>
                    <td className={`${commonCellStyle} min-w-32 text-center`}>
                      {formatDate(new Date(item.start_date))}
                    </td>
                    <td className={`${commonCellStyle} min-w-64 text-center`}>
                      <Button
                        intent="secondary"
                        className="p-2 px-5"
                        onClick={() => {
                          setModalData({
                            title: item.copy.book.title,
                            id: item.copy_id,
                          });
                          setIsOpened(true);
                        }}
                      >
                        Return book
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="md:hidden">
            {activeLoansQuery.isSuccess ? (
              activeLoansQuery.data.data.map((item, id) => (
                <div
                  key={id}
                  className="my-5 flex justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-md"
                >
                  <div className="w-full">
                    <div className="text-main-navy-blue flex w-full items-center">
                      <div className="min-w-0 flex-1">
                        <div className="text-lg wrap-break-word">
                          {item.copy.book.title}
                        </div>
                      </div>
                    </div>
                    <div className="mb-4 block w-full min-w-0 truncate text-sm text-gray-600">
                      {formatAuthors(item.copy.book.authors)}
                    </div>

                    <div className="text-main-navy-blueflex my-3 items-center">
                      <span className="text-main-navy-blue mr-2 text-sm">
                        Loan date:
                      </span>
                      {formatDate(new Date(item.start_date))}
                    </div>
                    <div className="text-main-navy-blue flex items-center text-sm">
                      <Button
                        intent="secondary"
                        className="p-2 px-5"
                        onClick={() => {
                          setModalData({
                            title: item.copy.book.title,
                            id: item.copy_id,
                          });
                          setIsOpened(true);
                        }}
                      >
                        Return book
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <span> No data</span>
            )}
          </div>

          {activeLoansQuery.isSuccess ? (
            activeLoansQuery.data.data.length <= 0 ? (
              <div className="my-24 w-full text-center">
                {" "}
                You don't have any loans
              </div>
            ) : (
              <></>
            )
          ) : (
            <div className="my-24 w-full text-center"> No data</div>
          )}
        </div>
        <CustomPagination
          totalPages={activeLoansQuery.data?.meta.totalPages}
          pagination={pagination}
        />
      </div>
    </>
  );
}

export default ULoans;
