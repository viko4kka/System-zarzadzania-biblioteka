import { useQuery } from "@tanstack/react-query";
import { bookApi } from "../../api/book/book.api";
import type { BooksListParams } from "../../api/book/book.types";

export const useBooksList = (params: BooksListParams) => {
  return useQuery({
    queryKey: ["search", params],
    queryFn: () => bookApi.booksList(params),
    enabled: true,
    placeholderData: (prev) => prev,
  });
};
