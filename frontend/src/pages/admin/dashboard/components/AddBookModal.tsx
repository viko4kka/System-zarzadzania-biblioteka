import { useState } from 'react';
import CustomModal from '../../../../ui/CustomModal';
import { Button } from '../../../../ui/Button';
import { useAddBook } from '../../../../hooks/book/use-add-book';
import { Plus, Trash2 } from 'lucide-react'; 

type AddBookModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

function AddBookModal({ isOpen, onClose }: AddBookModalProps) {
    const { mutate, isPending } = useAddBook();

    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [publisherName, setPublisherName] = useState('');
    const [cover, setCover] = useState('');
    const [isbn, setIsbn] = useState('');
    
    const [authors, setAuthors] = useState<{ author_name: string; author_lastname: string }[]>([
        { author_name: '', author_lastname: '' }
    ]);

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

    const handleClose = () => {
        setTitle('');
        setYear('');
        setPublisherName('');
        setCover('');
        setIsbn('');
        setAuthors([{ author_name: '', author_lastname: '' }]);
        setErrorMsg('');
        onClose();
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

        mutate(
            { 
                title, 
                year: Number(year),
                publisher_name: publisherName,
                authors: validAuthors,
                cover: cover.trim() || undefined,
                ISBN: isbn.trim() || undefined
            },
            {
                onSuccess: () => {
                    handleClose();
                },
                onError: (err: any) => {
                    setErrorMsg(err?.response?.data?.message || 'Something went wrong.');
                }
            }
        );
    };

    return (
        <CustomModal isOpened={isOpen} onClose={handleClose} header="" width="550px" bgColor="bg-color-gray-50">
            <CustomModal.Content className="w-full flex flex-col gap-4 px-6 max-h-[75vh] overflow-y-auto">
                <h2 className="text-center text-2xl font-bold uppercase text-main-navy-blue tracking-wide mt-2">
                    Add book to catalog
                </h2>

                {errorMsg && <p className="text-sm text-red-500 font-semibold text-center bg-red-50 p-2 rounded-lg">{errorMsg}</p>}

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-main-navy-blue">Title *</label>
                    <input type="text" value={title} disabled={isPending} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Java: Podstawy" className="w-full bg-white text-gray-800 text-sm rounded-xl border p-2.5 outline-none border-gray-300 focus:border-main-blue" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-main-navy-blue">Publisher Name *</label>
                    <input type="text" value={publisherName} disabled={isPending} onChange={(e) => setPublisherName(e.target.value)} placeholder="e.g. PWN" className="w-full bg-white text-gray-800 text-sm rounded-xl border p-2.5 outline-none border-gray-300 focus:border-main-blue" />
                </div>

                <div className="flex flex-col gap-2 border-t pt-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-main-navy-blue">Authors *</label>
                        <Button type="button" intent="primary" size="small" onClick={handleAddAuthorField} disabled={isPending} className="py-1 px-2 flex items-center gap-1 text-xs">
                            <Plus className="w-3 h-3" /> Add Author
                        </Button>
                    </div>
                    {authors.map((author, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <input type="text" value={author.author_name} disabled={isPending} onChange={(e) => handleAuthorChange(index, 'author_name', e.target.value)} placeholder="First Name" className="w-1/2 bg-white text-gray-800 text-sm rounded-xl border p-2 outline-none border-gray-300 focus:border-main-blue" />
                            <input type="text" value={author.author_lastname} disabled={isPending} onChange={(e) => handleAuthorChange(index, 'author_lastname', e.target.value)} placeholder="Last Name" className="w-1/2 bg-white text-gray-800 text-sm rounded-xl border p-2 outline-none border-gray-300 focus:border-main-blue" />
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
                        <input type="text" maxLength={13} value={isbn} disabled={isPending} onChange={(e) => setIsbn(e.target.value)} placeholder="9788328930247" className="w-full bg-white text-gray-800 text-sm rounded-xl border p-2.5 outline-none border-gray-300 focus:border-main-blue" />
                    </div>
                    <div className="flex flex-col gap-1 w-1/2">
                        <label className="text-sm font-semibold text-main-navy-blue">Year *</label>
                        <input type="number" value={year} min="2000" max={new Date().getFullYear()} disabled={isPending} onChange={(e) => setYear(e.target.value)} placeholder="2013" className="w-full bg-white text-gray-800 text-sm rounded-xl border p-2.5 outline-none border-gray-300 focus:border-main-blue" />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-main-navy-blue">Cover Image URL</label>
                    <input type="text" value={cover} disabled={isPending} onChange={(e) => setCover(e.target.value)} placeholder="https://..." className="w-full bg-white text-gray-800 text-sm rounded-xl border p-2.5 outline-none border-gray-300 focus:border-main-blue" />
                </div>
            </CustomModal.Content>

            <CustomModal.Footer className="w-full flex justify-center gap-4 pt-2 pb-6 px-6">
                <Button intent="third" size="medium" onClick={handleClose} disabled={isPending}>Cancel</Button>
                <Button intent="secondary" size="medium" onClick={handleSubmit} disabled={isPending}>
                    {isPending ? 'Adding...' : 'Add'}
                </Button>
            </CustomModal.Footer>
        </CustomModal>
    );
}

export default AddBookModal;