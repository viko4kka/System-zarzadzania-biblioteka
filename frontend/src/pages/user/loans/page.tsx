import { useState } from "react";
import CustomPagination from "../../../ui/CustomPagination";
import { Button } from "../../../ui/Button";
import CustomModal from "../../../ui/CustomModal";

const mockupData = [
  {
    title: "Matematyka dyskretna",
    author: " Kenneth A. Ross",
    loanDate: "18-03-2026",
    returnDate: "18-09-2026",
    isCurrentlyLoaned: false,
  },
  {
    title: "Python od podstaw",
    author: " Marcin Moskała",
    loanDate: "23-12-2025",
    returnDate: "23-07-2026",
    isCurrentlyLoaned: false,
  },
  {
    title: "Programowanie Współbieżne i rozproszone",
    author: " Weiss Zbigniew",
    loanDate: "04-04-2026",
    returnDate: "04-11-2026",
    isCurrentlyLoaned: true,
  },
  {
    title: "Matematyka dyskretna",
    author: " Kenneth A. Ross",
    loanDate: "18-03-2026",
    returnDate: "18-09-2026",
    isCurrentlyLoaned: false,
  },
  {
    title: "Python od podstaw",
    author: " Marcin Moskała",
    loanDate: "23-12-2025",
    returnDate: "23-07-2026",
    isCurrentlyLoaned: true,
  },
  {
    title: "Programowanie Współbieżne i rozproszone",
    author: " Weiss Zbigniew",
    loanDate: "04-04-2026",
    returnDate: "04-11-2026",
    isCurrentlyLoaned: false,
  },
  {
    title: "Matematyka dyskretna",
    author: " Kenneth A. Ross",
    loanDate: "18-03-2026",
    returnDate: "18-09-2026",
    isCurrentlyLoaned: true,
  },
  {
    title: "Python od podstaw",
    author: " Marcin Moskała",
    loanDate: "23-12-2025",
    returnDate: "23-07-2026",
    isCurrentlyLoaned: true,
  },
  {
    title:
      "Programowanie Współbieżne i rozproszoneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    author: " Weiss Zbigniew",
    loanDate: "04-04-2026",
    returnDate: "04-11-2026",
    isCurrentlyLoaned: false,
  },
  {
    title: "Matematyka dyskretna",
    author: " Kenneth A. Ross",
    loanDate: "18-03-2026",
    returnDate: "18-09-2026",
    isCurrentlyLoaned: true,
  },
  {
    title: "Python od podstaw",
    author: " Marcin Moskała",
    loanDate: "23-12-2025",
    returnDate: "23-07-2026",
    isCurrentlyLoaned: false,
  },
  {
    title: "Programowanie Współbieżne i rozproszone",
    author: " Weiss Zbigniew",
    loanDate: "04-04-2026",
    returnDate: "04-11-2026",
    isCurrentlyLoaned: false,
  },
  {
    title: "Matematyka dyskretna",
    author: " Kenneth A. Ross",
    loanDate: "18-03-2026",
    returnDate: "18-09-2026",
    isCurrentlyLoaned: false,
  },
  {
    title: "Python od podstaw",
    author: " Marcin Moskała",
    loanDate: "23-12-2025",
    returnDate: "23-07-2026",
    isCurrentlyLoaned: false,
  },
  {
    title: "Programowanie Współbieżne i rozproszone",
    author: " Weiss Zbigniew",
    loanDate: "04-04-2026",
    returnDate: "04-11-2026",
    isCurrentlyLoaned: true,
  },
  {
    title: "Matematyka dyskretna",
    author: " Kenneth A. Ross",
    loanDate: "18-03-2026",
    returnDate: "18-09-2026",
    isCurrentlyLoaned: false,
  },
  {
    title: "Python od podstaw",
    author: " Marcin Moskała",
    loanDate: "23-12-2025",
    returnDate: "23-07-2026",
    isCurrentlyLoaned: true,
  },
  {
    title: "Programowanie Współbieżne i rozproszone",
    author: " Weiss Zbigniew",
    loanDate: "04-04-2026",
    returnDate: "04-11-2026",
    isCurrentlyLoaned: false,
  },
  {
    title: "Matematyka dyskretna",
    author: " Kenneth A. Ross",
    loanDate: "18-03-2026",
    returnDate: "18-09-2026",
    isCurrentlyLoaned: true,
  },
  {
    title: "Python od podstaw",
    author: " Marcin Moskała",
    loanDate: "23-12-2025",
    returnDate: "23-07-2026",
    isCurrentlyLoaned: true,
  },
  {
    title:
      "Programowanie Współbieżne i rozproszoneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee eee",
    author: " Weiss Zbigniew",
    loanDate: "04-04-2026",
    returnDate: "04-11-2026",
    isCurrentlyLoaned: true,
  },
  {
    title: "Matematyka dyskretna",
    author: " Kenneth A. Ross",
    loanDate: "18-03-2026",
    returnDate: "18-09-2026",
    isCurrentlyLoaned: true,
  },
  {
    title: "Python od podstaw",
    author: " Marcin Moskała",
    loanDate: "23-12-2025",
    returnDate: "23-07-2026",
    isCurrentlyLoaned: false,
  },
  {
    title: "Ostatnia na liście",
    author: " Weiss Zbigniew",
    loanDate: "04-04-2026",
    returnDate: "04-11-2026",
    isCurrentlyLoaned: false,
  },
];

function ULoans() {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{ title: string; id: number }>({
    title: "",
    id: 0,
  });

  const limitPerPage = 10;
  const [pageData, setPageData] = useState(mockupData.slice(0, limitPerPage));
  const totalNumberOfItems = mockupData.length;

  const [totalBooksBorrowed, setTotalBooksBorrowed] = useState<number>(56);

  const onPageChange = async (newPage: number) => {
    //TODO zapytanie ze względu na newPage
    const newData = mockupData.slice(
      (newPage - 1) * limitPerPage,
      newPage * limitPerPage,
    );
    setPageData(newData);

    //TODO ustawienie w jakiś sposób liczby wypożyczonych ksiażek
    setTotalBooksBorrowed(49);

    //TODO zwrocenie aktualej całkowitej ilości elementow
    return totalNumberOfItems;
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
          <p>Are you sure you want to return this book?</p>
          <p className="text-main-navy-blue mt-5 line-clamp-3 font-bold wrap-break-word">
            "{modalData.title}"
          </p>
        </CustomModal.Content>

        <CustomModal.Footer>
          <Button
            className="mx-5 min-w-32 p-2 px-5"
            intent="third"
            onClick={() => {
              setIsOpened(false);
            }}
          >
            No
          </Button>
          <Button
            className="mx-5 min-w-32 p-2 px-5"
            intent="secondary"
            onClick={() => {
              //TODO żadanie zwrotu
              setIsOpened(false);
            }}
          >
            Return
          </Button>
        </CustomModal.Footer>
      </CustomModal>

      <div className="mt-12">
        <h1 className="text-main-navy-blue my-5 text-2xl">My loans</h1>
        <h2 className="text-main-navy-blue-hover text-lg">
          You have {totalBooksBorrowed} books borrowed
        </h2>

        <div className="w-full overflow-x-auto">
          <table className="my-8 w-full min-w-225 table-auto rounded-xl border border-solid border-gray-300">
            <thead className="bg-gray-100 font-light text-gray-600">
              <tr>
                <th className={headerCellStyle}>Book</th>
                <th className={headerCellStyle}>Loan date</th>
                <th className={headerCellStyle}>Return date</th>
                <th className={headerCellStyle}>Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {pageData ? (
                pageData.map((item, id) => (
                  <tr key={id}>
                    <td className={`${commonCellStyle} max-w-120`}>
                      <div className="text-main-navy-blue truncate text-balance">
                        {item.title}
                      </div>
                      <span className="truncate text-sm font-light text-balance text-gray-500">
                        {item.author}
                      </span>
                    </td>
                    <td className={`${commonCellStyle} min-w-32 text-center`}>
                      {item.loanDate}
                    </td>
                    <td className={`${commonCellStyle} min-w-32 text-center`}>
                      {item.returnDate}
                    </td>
                    <td className={`${commonCellStyle} min-w-64 text-center`}>
                      {item.isCurrentlyLoaned ? (
                        <Button
                          intent="secondary"
                          className="p-2 px-5"
                          onClick={() => {
                            setModalData({ title: item.title, id });
                            setIsOpened(true);
                          }}
                        >
                          Return book
                        </Button>
                      ) : (
                        <span>The book was returned</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <span> no data</span>
              )}
            </tbody>
          </table>
        </div>
        <CustomPagination
          itemsPerPage={limitPerPage}
          initalTotalNumberOfItems={totalNumberOfItems}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
}

export default ULoans;
