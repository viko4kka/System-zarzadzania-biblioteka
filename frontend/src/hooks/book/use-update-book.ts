import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type UpdateBookPayload = {
    id: string;
    dto: {
        title: string;
        year: number;
        publisher_name: string;
        authors: { author_name: string; author_lastname: string }[];
        cover?: string;
        ISBN?: string;
    };
};

export const useUpdateBook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, dto }: UpdateBookPayload) => {
            const response = await axios.patch(`/api/book/update/${id}`, dto);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] }); 
        },
    });
};