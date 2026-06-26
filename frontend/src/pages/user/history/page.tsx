import type { LoansAuthorDto } from "../../../api/loan/loan.types";
import { useLoans } from "../../../hooks/loan/use-loans-data";
import { usePagination } from "../../../hooks/pagination/use-pagination";
import CustomPagination from "../../../ui/CustomPagination";

function UHistory() {
    const pagination = usePagination();
    const { page, limit } = pagination;

    const loansData = useLoans({
      limit: limit,
      page: page,
    });

  
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

    const timeBetween = (date1: Date, date2: Date) => {
      const diffMs = date2.getTime() - date1.getTime();
      
      const passedDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (passedDays > 0) {
        return `${passedDays} day${passedDays === 1 ? "" : "s"}`;
      }

      const passedHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (passedHours > 0) {
        return `${passedHours} h`
      }

      const passedMinutes = Math.floor(diffMs / (1000 * 60));
      if (passedMinutes > 0) {
        return `${passedMinutes} min`
      }

      const passedSeconds = Math.floor(diffMs / 1000);
      if (passedSeconds > 0) {
        return `${passedSeconds} s`
      }
      
      return `${diffMs} ms`
    }

    const commonCellStyle = "border border-solid border-gray-300 xl:p-4 p-2";
    const headerCellStyle = "border border-solid border-gray-300 xl:p-3 p-2 font-normal";

     return (
      <div className="mt-6 lg:mt-0 xl:mt-12">
        <h1 className="text-main-navy-blue my-2 text-lg xl:my-5 xl:text-2xl">
          My History
        </h1>

        <div className="w-full overflow-x-auto">
          <table className="hidden w-full min-w-142 table-auto rounded-xl border border-solid border-gray-300 lg:my-2 lg:table xl:my-8">
            <thead className="bg-gray-100 font-light text-gray-600">
              <tr>
                <th className={`${headerCellStyle}`}>Book</th>
                <th className={`${headerCellStyle} w-26 xl:w-44`}>Loan date</th>
                <th className={`${headerCellStyle} w-26 xl:w-44`}>Return date</th>
                <th className={`${headerCellStyle} w-26 xl:w-44`}>Time since loan</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {loansData.isSuccess &&
                loansData.data.loans?.length > 0 &&
                loansData.data.loans.map((item, id) => (
                  <tr key={id}>
                    <td className={`${commonCellStyle} max-w-140`}>
                      <div className="text-main-navy-blue truncate text-sm text-balance xl:text-base">
                        {item.book.title}
                      </div>
                      <div className="truncate text-xs font-light text-balance text-gray-500 xl:text-sm">
                        {formatAuthors(item.book.authors)}
                      </div>
                    </td>
                    <td
                      className={`${commonCellStyle} text-center text-sm xl:min-w-64 xl:text-base`}
                    >
                      {formatDate(item.start_date)}
                    </td>
                    <td
                      className={`${commonCellStyle} text-center text-sm xl:min-w-64 xl:text-base`}
                    >
                     {item.return_date != null ? formatDate(item.return_date) : "Not returned"}
                    </td>
                    <td
                      className={`${commonCellStyle} text-center text-sm xl:min-w-32 xl:text-base`}
                    >
                     {item.return_date != null ? 
                      timeBetween(item.start_date, item.return_date) : 
                      timeBetween(item.start_date, new Date())}
                    </td>
                  </tr>
                 ))}
            </tbody>
          </table>

          <div className="lg:hidden">
            {loansData.isSuccess ? (
              loansData.data.loans.map((item) => (
                <div
                  key={item.id_loan}
                  className="my-5 flex justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-md"
                >
                  <div className="w-full">
                    <div className="text-main-navy-blue flex w-full items-center">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm wrap-break-word">
                          {item.book.title}
                        </div>
                      </div>
                    </div>
                    <div className="mb-1 block w-full min-w-0 truncate text-xs text-gray-600 lg:mb-4">
                      {formatAuthors(item.book.authors)}
                    </div>

                    <div className="text-main-navy-blue flex my-2 items-center lg:my-3">
                      <span className="text-main-navy-blue mr-2 text-xs">
                        Loan date:
                      </span>
                      <span className="text-xs">
                        {formatDate(item.start_date)}
                      </span>
                    </div>
                    <div className="text-main-navy-blue flex my-2 items-center lg:my-3">
                      <span className="text-main-navy-blue mr-2 text-xs">
                        Return date:
                      </span>
                      <span className="text-xs">
                        {item.return_date != null ? formatDate(item.return_date) : "Not returned"}
                      </span>
                    </div>
                    <div className="text-main-navy-blue flex my-2 items-center lg:my-3">
                      <span className="text-main-navy-blue mr-2 text-xs">
                        Time since loan:
                      </span>
                      <span className="text-xs">
                        {item.return_date != null ? 
                          timeBetween(item.start_date, item.return_date) : 
                          timeBetween(item.start_date, new Date())}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <span> No data</span>
            )}
          </div>

          {loansData.isSuccess ? (
            loansData.data.loans?.length <= 0 ? (
              <div className="my-24 w-full text-center">
                {" "}
                You don't have any loan history
              </div>
            ) : (
              <></>
            )
          ) : (
            <div className="my-24 w-full text-center"> No data</div>
          )}
        </div>
        
        <CustomPagination
          totalPages={loansData.data?.meta.totalPages}
          pagination={pagination}
        />

      </div>
  );
}

export default UHistory;