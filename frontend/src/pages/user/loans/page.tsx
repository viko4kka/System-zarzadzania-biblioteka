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

  const commonCellStyle = "border border-solid border-gray-300 xl:p-4 p-2";
  const headerCellStyle =
    "border border-solid border-gray-300 xl:p-3 p-2 font-normal";

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

      <div className="mt-6 lg:mt-0 xl:mt-12">
        <h1 className="text-main-navy-blue my-2 text-lg xl:my-5 xl:text-2xl">
          My loans
        </h1>
        <h2 className="text-main-navy-blue-hover text-sm xl:text-lg">
          You have{" "}
          {activeLoansQuery.isSuccess
            ? activeLoansQuery.data.data.length.toString() + " "
            : " -- "}{" "}
          books borrowed
        </h2>

        <div className="w-full overflow-x-auto">
          <table className="hidden w-full min-w-142 table-auto rounded-xl border border-solid border-gray-300 lg:my-2 lg:table xl:my-8">
            <thead className="bg-gray-100 font-light text-gray-600">
              <tr>
                <th className={`${headerCellStyle}`}>Book</th>
                <th className={`${headerCellStyle} w-28 xl:w-44`}>Loan date</th>

                <th className={`${headerCellStyle} w-24`}></th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {activeLoansQuery.isSuccess &&
                activeLoansQuery.data.data.length > 0 &&
                activeLoansQuery.data.data.map((item, id) => (
                  <tr key={id}>
                    <td className={`${commonCellStyle} max-w-140`}>
                      <div className="text-main-navy-blue truncate text-sm text-balance xl:text-base">
                        {item.copy.book.title}
                      </div>
                      <div className="truncate text-xs font-light text-balance text-gray-500 xl:text-sm">
                        {formatAuthors(item.copy.book.authors)}{" "}
                      </div>
                    </td>
                    <td
                      className={`${commonCellStyle} min-w-4 text-center text-sm xl:text-base`}
                    >
                      {formatDate(new Date(item.start_date))}
                    </td>
                    <td
                      className={`${commonCellStyle} text-center text-sm xl:min-w-64 xl:text-base`}
                    >
                      <Button
                        intent="secondary"
                        className="px-1 py-2 text-xs xl:p-2 xl:px-5 xl:text-base"
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

          <div className="lg:hidden">
            {activeLoansQuery.isSuccess ? (
              activeLoansQuery.data.data.map((item, id) => (
                <div
                  key={id}
                  className="my-5 flex justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-md"
                >
                  <div className="w-full">
                    <div className="text-main-navy-blue flex w-full items-center">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm wrap-break-word">
                          {item.copy.book.title}
                        </div>
                      </div>
                    </div>
                    <div className="mb-1 block w-full min-w-0 truncate text-xs text-gray-600 lg:mb-4">
                      {formatAuthors(item.copy.book.authors)}
                    </div>

                    <div className="text-main-navy-blueflex my-2 items-center lg:my-3">
                      <span className="text-main-navy-blue mr-2 text-xs">
                        Loan date:
                      </span>
                      <span className="text-xs">
                        {formatDate(new Date(item.start_date))}
                      </span>
                    </div>
                    <div className="text-main-navy-blue flex items-center text-xs">
                      <Button
                        intent="secondary"
                        className="p-1 px-4 lg:p-2 lg:px-5"
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
