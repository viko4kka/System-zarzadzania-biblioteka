import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import CustomModal from '../../../../ui/CustomModal';
import { Button } from '../../../../ui/Button';
import { useBookData } from '../../../../hooks/book/use-book-data';
import { useUpdateBook } from '../../../../hooks/book/use-update-book';
import { Plus, Trash2 } from 'lucide-react'; 

type EditBookModalProps = {
    bookId: string | null;
    isOpen: boolean;
    onClose: () => void;
};

function EditBookModal({ bookId, isOpen, onClose }: EditBookModalProps) {
    const { data: bookData, isLoading: isFetching } = useBookData(bookId ?? '');

    const handleClose = () => {
        onClose();
    };

    return (
        <CustomModal isOpened={isOpen} onClose={handleClose} header="" width="550px" bgColor="bg-color-gray-50">
            <CustomModal.Content className="w-full flex flex-col gap-4 px-6 max-h-[75vh] overflow-y-auto">
                <h2 className="text-center text-2xl font-bold uppercase text-main-navy-blue tracking-wide mt-2">
                    Edit Book Details
                </h2>

                {isFetching ? (
                    <p className="text-center text-gray-500 py-6 font-medium animate-pulse">Loading book data...</p>
                ) : bookData ? (
                    <EditBookModalForm bookId={bookId!} bookData={bookData} onClose={handleClose} />
                ) : (
                    <p className="text-center text-red-500 py-6 font-medium">Failed to load book data.</p>
                )}
            </CustomModal.Content>
        </CustomModal>
    );
}

type EditBookModalFormProps = {
    bookId: string;
    bookData: any; 
    onClose: () => void;
};

function EditBookModalForm({ bookId, bookData, onClose }: EditBookModalFormProps) {
    const queryClient = useQueryClient(); 
    const { mutate: updateBook, isPending: isUpdating } = useUpdateBook();

    const [title, setTitle] = useState(bookData.title || '');
    const [year, setYear] = useState(bookData.year?.toString() || '');
    const [publisherName, setPublisherName] = useState(bookData.publisherName || '');
    const [cover, setCover] = useState(bookData.cover || '');
    const [isbn, setIsbn] = useState(bookData.ISBN || '');
    
    const [authors, setAuthors] = useState<{ author_name: string; author_lastname: string }[]>(
        bookData.authors && bookData.authors.length > 0 
            ? bookData.authors 
            : [{ author_name: '', author_lastname: '' }]
    );
    
    const [errorMsg, setErrorMsg] = useState('');

    const handleAddAuthorField = () => {
        setAuthors([...authors, { author_name: '', author_lastname: '' }]);
    };

    const handleRemoveAuthorField = (index: number) => {
        if (authors.length > 1) {
            setAuthors(authors.filter((_, i) => i !== index));
        }
    };

    const handleAuthorChange = (index: number, field: 'author_name' | 'author_lastname', value: string) => {
        const updatedAuthors = [...authors];
        updatedAuthors[index][field] = value;
        setAuthors(updatedAuthors);
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setErrorMsg('');

        if (!title.trim() || !year.trim() || !publisherName.trim()) {
            setErrorMsg('Title, Year and Publisher Name are required.');
            return;
        }

        if (isbn && isbn.trim().length !== 13) {
            setErrorMsg('ISBN must be exactly 13 characters long.');
            return;
        }

        const validAuthors = authors.filter(a => a.author_name.trim() && a.author_lastname.trim());
        if (validAuthors.length === 0) {
            setErrorMsg('At least one author with name and lastname is required.');
            return;
        }

        updateBook(
            { 
                id: bookId,
                dto: {
                    title: title.trim(), 
                    year: Number(year),
                    publisher_name: publisherName.trim(), 
                    authors: validAuthors, 
                    cover: cover.trim() || undefined,
                    ISBN: isbn.trim() || undefined
                }
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['book', bookId] });
                    queryClient.invalidateQueries({ queryKey: ['books'] }); 
                    onClose();
                },
                onError: (err: any) => {
                    setErrorMsg(err?.response?.data?.message || 'Something went wrong while updating.');
                }
            }
        );
    };

    return (
        <>
            {errorMsg && <p className="text-sm text-red-500 font-semibold text-center bg-red-50 p-2 rounded-lg">{errorMsg}</p>}

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-main-navy-blue">Title *</label>
                <input type="text" value={title} disabled={isUpdating} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white text-gray-800 text-sm rounded-xl border p-2.5 outline-none border-gray-300 focus:border-main-blue" />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-main-navy-blue">Publisher Name *</label>
                <input type="text" value={publisherName} disabled={isUpdating} onChange={(e) => setPublisherName(e.target.value)} className="w-full bg-white text-gray-800 text-sm rounded-xl border p-2.5 outline-none border-gray-300 focus:border-main-blue" />
            </div>

            <div className="flex flex-col gap-2 border-t pt-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-main-navy-blue">Authors *</label>
                    <Button type="button" intent="primary" size="small" onClick={handleAddAuthorField} disabled={isUpdating} className="py-1 px-2 flex items-center gap-1 text-xs">
                        <Plus className="w-3 h-3" /> Add Author
                    </Button>
                </div>
                {authors.map((author, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <input type="text" value={author.author_name} disabled={isUpdating} onChange={(e) => handleAuthorChange(index, 'author_name', e.target.value)} placeholder="First Name" className="w-1/2 bg-white text-gray-800 text-sm rounded-xl border p-2 outline-none border-gray-300 focus:border-main-blue" />
                        <input type="text" value={author.author_lastname} disabled={isUpdating} onChange={(e) => handleAuthorChange(index, 'author_lastname', e.target.value)} placeholder="Last Name" className="w-1/2 bg-white text-gray-800 text-sm rounded-xl border p-2 outline-none border-gray-300 focus:border-main-blue" />
                        {authors.length > 1 && (
                            <button type="button" onClick={() => handleRemoveAuthorField(index)} className="text-red-500 hover:text-red-700 p-1">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex gap-4 border-t pt-2">
                <div className="flex flex-col gap-1 w-1/2">
                    <label className="text-sm font-semibold text-main-navy-blue">ISBN (13 digits)</label>
                    <input type="text" maxLength={13} value={isbn} disabled={isUpdating} onChange={(e) => setIsbn(e.target.value)} className="w-full bg-white text-gray-800 text-sm rounded-xl border p-2.5 outline-none border-gray-300 focus:border-main-blue" />
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                    <label className="text-sm font-semibold text-main-navy-blue">Year *</label>
                    <input type="number" value={year} min="2000" max={new Date().getFullYear()} disabled={isUpdating} onChange={(e) => setYear(e.target.value)} className="w-full bg-white text-gray-800 text-sm rounded-xl border p-2.5 outline-none border-gray-300 focus:border-main-blue" />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-main-navy-blue">Cover Image URL</label>
                <input type="text" value={cover} disabled={isUpdating} onChange={(e) => setCover(e.target.value)} className="w-full bg-white text-gray-800 text-sm rounded-xl border p-2.5 outline-none border-gray-300 focus:border-main-blue" />
            </div>

            <div className="w-full flex justify-center gap-4 pt-4 mt-2 border-t">
                <Button intent="third" size="medium" type="button" onClick={onClose} disabled={isUpdating}>Cancel</Button>
                <Button intent="secondary" size="medium" type="button" onClick={handleSubmit} disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </>
    );
}

export default EditBookModal;
