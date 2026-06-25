import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loanApi } from "../../api/loan/loan.api";
import toast from "react-hot-toast";

export const useLoanBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: string) => loanApi.loanBook(bookId),

    onSuccess: (bookId) => {
      toast.success(`You borrowed book successfully!`);
      queryClient.invalidateQueries({ queryKey: ["book data", bookId] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["activeLoans"] });
    },
    onError: () => {
      toast.error(`Borrowing was failed!`);
    },
  });
};
