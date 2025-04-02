import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useCallback,
} from "react";
import axios from "axios";
import { UserDataFull } from "../types";

interface UserContextType {
    users: UserDataFull[];
    setUsers: React.Dispatch<React.SetStateAction<UserDataFull[]>>;
    loading: boolean;
    fetchUsers: (userId: number, isAdmin: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [users, setUsers] = useState<UserDataFull[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async (userId: number, isAdmin: boolean) => {
        setLoading(true);
        try {
            const storageKey = isAdmin ? "usersChDataAdmin" : "usersChData";
            const timestampKey = isAdmin
                ? "usersChDataAdminTimestamp"
                : "usersChDataTimestamp";
            const storedUsers = localStorage.getItem(storageKey);
            const storedTimestamp = localStorage.getItem(timestampKey);
            const isDataValid =
                storedTimestamp &&
                Date.now() - parseInt(storedTimestamp) < 3600000; // 1 hora

            if (storedUsers && isDataValid) {
                setUsers(JSON.parse(storedUsers));
            } else {
                const response = await axios.post("/api/dashboard/graphs", {
                    userId,
                });
                if (response.data.success) {
                    const fetchedUsers = response.data.data.users;
                    setUsers(fetchedUsers);
                    localStorage.setItem(
                        storageKey,
                        JSON.stringify(fetchedUsers)
                    );
                    localStorage.setItem(timestampKey, Date.now().toString());
                } else {
                    console.log("Usuário não encontrado");
                }
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }, []);

    return (
        <UserContext.Provider value={{ users, setUsers, loading, fetchUsers }}>
            {children}
        </UserContext.Provider>
    );
};
