import { useQuery } from "@tanstack/react-query";
import { bookApi } from "../../api/book/book.api";

export const useBookData = (id: string) => {
    return useQuery({
        queryKey: ["book", id],
        queryFn: () => bookApi.bookData(id),
        enabled: !!id,
    });
};