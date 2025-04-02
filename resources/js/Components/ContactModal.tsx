import React, { useState } from 'react';
import { ButtonHTMLAttributes } from 'react';
import { MdClose } from "react-icons/md";
import { UserData } from '../types';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: UserData[];
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, users }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<UserData[]>([]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);

        const numericTerm = searchTerm.replace(/\D/g, '');

        const results = users.filter((user) =>
            user.whatsapp.includes(numericTerm)
        );
        setSearchResults(results.slice(0, 10));
    };

    const handleUserClick = (whatsapp: string) => {
        window.open(`https://wa.me/${whatsapp}`, '_blank');
    };

    return (
        <>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50" onClick={onClose}>
                    <div className="bg-white dark:bg-light-dark rounded-lg p-8 shadow-lg relative" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-2 right-2 text-gray-500 cursor-pointer" onClick={onClose}>
                            <MdClose className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-semibold mb-4 dark:text-white">Buscar Contato</h2>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full dark:bg-light-dark"
                            placeholder="Digite o número"
                            onKeyDown={(e) => {
                                const onlyNumbers = /[0-9]/;
                                const keyPressed = e.key;
                                if (!onlyNumbers.test(keyPressed) && keyPressed !== 'Backspace' && keyPressed !== 'Delete' && keyPressed !== 'ArrowLeft' && keyPressed !== 'ArrowRight') {
                                    e.preventDefault();
                                }
                            }}
                        />
                        {searchResults.length > 0 ? (
                            <ul className="w-full">
                                {searchResults.map((user) => (
                                    <li
                                        key={user.id}
                                        className="flex items-center justify-between border border-gray-200 rounded px-4 py-2 mb-1 cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleUserClick(user.whatsapp)}
                                    >
                                        <span className="mr-12">{user.name}</span>
                                        <span className="text-sm text-gray-500">{user.whatsapp}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 dark:text-white">Nenhum resultado encontrado</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ContactModal;
