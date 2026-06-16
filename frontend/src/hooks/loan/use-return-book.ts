import { useMutation } from "@tanstack/react-query";
import { loanApi } from "../../api/loan/loan.api";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useReturnBook = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (copy_id: string) => loanApi.returnBook(copy_id),

        onSuccess: (message) => {
            queryClient.invalidateQueries({ queryKey: ["activeLoans"] });
            toast.success('Book has been returned')
            console.log(message);
        },
        onError: (error) => {
            toast.error('Could not return book')
            console.error(error);
        },
    });
};