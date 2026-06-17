import { useState } from 'react';
import CustomModal from '../../../../ui/CustomModal';
import { Button } from '../../../../ui/Button';
import { useRemoveBook } from '../../../../hooks/book/use-remove-book';

type DeleteBookModalProps = {
    bookId: string;
    bookTitle?: string;
    isOpen: boolean;
    onClose: () => void;
};

function DeleteBookModal({ bookId, bookTitle, isOpen, onClose }: DeleteBookModalProps) {
    const { mutate: removeBook, isPending } = useRemoveBook();
    const [errorMsg, setErrorMsg] = useState('');

    const handleClose = () => {
        setErrorMsg('');
        onClose();
    };

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setErrorMsg('');

        if (!bookId) return;

        removeBook(
            { id: bookId }, 
            {
                onSuccess: () => {
                    handleClose();
                },
                onError: (err: any) => {
                    setErrorMsg(err?.response?.data?.message || 'Something went wrong while deleting the book.');
                }
            }
        );
    };

    return (
        <CustomModal isOpened={isOpen} onClose={handleClose} header="" width="450px" bgColor="bg-color-gray-50">
            <CustomModal.Content className="w-full flex flex-col gap-4 px-6 pt-4">
                <h2 className="text-center text-2xl font-bold uppercase text-main-navy-blue tracking-wide">
                    Delete Book
                </h2>

                {errorMsg && (
                    <p className="text-sm text-red-500 font-semibold text-center bg-red-50 p-2 rounded-lg">
                        {errorMsg}
                    </p>
                )}

                <p className="text-center text-gray-700 text-sm md:text-base leading-relaxed my-2">
                    Are you sure you want to delete 
                    {bookTitle ? <strong className="text-main-navy-blue"> "{bookTitle}"</strong> : ' this book'}? 
                    <br />
                    <span className="text-xs text-red-500 font-medium">This action cannot be undone.</span>
                </p>
            </CustomModal.Content>

            <CustomModal.Footer className="w-full flex justify-center gap-4 pt-2 pb-6 px-6">
                <Button intent="third" size="medium" onClick={handleClose} disabled={isPending}>
                    Cancel
                </Button>
                
                <Button 
                    intent="primary" 
                    size="medium" 
                    onClick={handleDelete} 
                    disabled={isPending}
                    className="bg-red-600 hover:bg-red-700 active:bg-red-800"
                >
                    {isPending ? 'Deleting...' : 'Delete'}
                </Button>
            </CustomModal.Footer>
        </CustomModal>
    );
}

export default DeleteBookModal;