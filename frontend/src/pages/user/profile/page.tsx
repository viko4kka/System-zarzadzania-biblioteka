import TextField from "./components/TextField";
import { Button } from "../../../ui/Button";
import { userApi } from "../../../api/user/user.api";
import { useEffect, useState } from "react";
import type { UserData } from "../../../api/user/user.types";

function UProfile() {
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        (async () => {
            const data = await userApi.loggedInUser();
            setUserData(data);
        })();
    }, []);

    return (
        <div className="w-full flex flex-col">
            <h1 className="text-3xl m-[1%] ml-[0%]">My profile</h1>

            <div className="grid grid-cols-1 grid-rows-5 grid-flow-col gap-4 pb-[1%]">
                <div>
                    <h2>Name</h2>
                    <TextField placeholder="Jan" />
                </div>
                <div>
                    <h2>Surname</h2>
                    <TextField placeholder="Kowalski" />
                </div>
                <div>
                    <h2>Mail</h2>
                    <TextField disabled={true} default_value={userData?.mail} />
                </div>
                <div>
                    <h2>Old password</h2>
                    <TextField disabled={true} default_value="***********" />
                </div>
                <div>
                    <h2>New password</h2>
                    <TextField placeholder="New password" />
                </div>
            </div>
            <div className="flex gap-4">
                <Button intent="secondary" size="medium" onClick={() => {
                    userApi

                    console.log("Saved changes")
                }}>Save changes</Button>
                <Button intent="lightButton" size="medium" onClick={() => console.log("Discarded changes")}>Discard changes</Button>
            </div>

        </div>

    );
}

export default UProfile;