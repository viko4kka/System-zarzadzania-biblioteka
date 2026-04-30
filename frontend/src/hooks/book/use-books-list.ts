import { useQuery } from "@tanstack/react-query";
import { bookApi } from "../../api/book/book.api";
import type { BooksListParams } from "../../api/book/book.types";

export const useBooks = (params: BooksListParams) => {
    return useQuery({
        queryKey: ["books", params],
        queryFn: () => bookApi.booksList(params),

        placeholderData: (prev) => (prev)
    });
};