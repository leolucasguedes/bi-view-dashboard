import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";

interface ImpersonateContextProps {
    person: boolean;
    setPerson: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialContext: ImpersonateContextProps = {
    person: false,
    setPerson: () => {},
};

const impersonateContext = createContext<ImpersonateContextProps>(initialContext);

const ImpersonateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [person, setPerson] = useState<boolean>(() => {
        const storedPerson = localStorage.getItem("user");
        return storedPerson ? JSON.parse(storedPerson) : false;
    });

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(person));
    }, [person]);

    return (
        <impersonateContext.Provider value={{ person, setPerson }}>
            {children}
        </impersonateContext.Provider>
    );
};

export function useImpersonateContext() {
    const context = useContext(impersonateContext);
    if (!context) {
        throw new Error("useImpersonateContext must be used within an ImpersonateProvider");
    }
    return context;
}

export { impersonateContext, ImpersonateProvider };

