import TextField from "./components/TextField";
import { Button } from "../../../ui/Button";
import { userApi } from "../../../api/user/user.api";
import { useEffect, useState } from "react";
import type { UserData } from "../../../api/user/user.types";

function UProfile() {
    const [userData, setUserData] = useState<UserData | null>(null);

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await userApi.loggedInUser();
                setUserData(data);
                setName(data.name || "");
                setSurname(data.lastname || "");
            } catch (error) {
                console.error("Błąd pobierania usera:", error);
                alert("Nie udało się pobrać danych użytkownika");
            }
        })();
    }, []);

    const getErrorMessage = (data: any) => {
        const msg = data?.message;

        if (Array.isArray(msg)) return msg.join(", ");
        if (typeof msg === "string") return msg;

        return "Nieznany błąd";
    };

    const handleSaveChanges = async () => {
        if (!oldPassword.trim()) {
            alert("Podaj stare hasło.");
            return;
        }

        setIsLoading(true);

        try {
            const passwordToSend = newPassword.trim()
                ? newPassword
                : oldPassword;

            await userApi.updateUser(
                name,
                surname,
                oldPassword,
                passwordToSend
            );

            alert("Zmiany zostały zapisane pomyślnie!");

            window.location.reload();

        } catch (error: any) {
            console.error("FULL ERROR:", error);

            const backendData = error?.response?.data;

            if (backendData) {
                alert(`Błąd: ${getErrorMessage(backendData)}`);
                return;
            }

            if (error?.request) {
                alert("Brak odpowiedzi z serwera (problem z połączeniem).");
                return;
            }

            alert(error?.message || "Nieznany błąd aplikacji");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDiscardChanges = () => {
        setName(userData?.name || "");
        setSurname(userData?.lastname || "");
        setOldPassword("");
        setNewPassword("");
    };

    return (
        <div className="w-full flex flex-col">
            <h1 className="text-3xl m-[1%] ml-[0%]">My profile</h1>

            <div className="grid grid-cols-1 grid-rows-5 grid-flow-col gap-4 pb-[1%]">
                <div>
                    <h2>Name</h2>
                    <TextField
                        placeholder="Jan"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <h2>Surname</h2>
                    <TextField
                        placeholder="Kowalski"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                    />
                </div>

                <div>
                    <h2>Mail</h2>
                    <TextField disabled default_value={userData?.mail} />
                </div>

                <div>
                    <h2>Old password</h2>
                    <TextField
                        type="password"
                        placeholder="Enter current password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </div>

                <div>
                    <h2>New password</h2>
                    <TextField
                        type="password"
                        placeholder="New password (optional)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <Button
                    intent="secondary"
                    size="medium"
                    disabled={isLoading}
                    onClick={handleSaveChanges}
                >
                    {isLoading ? "Saving..." : "Save changes"}
                </Button>

                <Button
                    intent="lightButton"
                    size="medium"
                    disabled={isLoading}
                    onClick={handleDiscardChanges}
                >
                    Discard changes
                </Button>
            </div>
        </div>
    );
}

export default UProfile;