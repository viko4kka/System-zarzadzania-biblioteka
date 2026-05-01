import Header from "./Header"
import type { ReactNode} from "react"
import { slide as Menu } from 'react-burger-menu';
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import Sidebar from "./components/Sidebar";
import { useState,  } from "react";
import { useLoggedInUserData } from "../hooks/user/useLoggedInUserData";

type MainLayoutProps = {
    children: ReactNode,
}

export default function MainLayout ({children}: MainLayoutProps){
    const [menuIsOpened, setMenuIsOpened] = useState<boolean>(false);
    const {
        user,          
        isLoading,       
        isUnauthorized,           
    } = useLoggedInUserData();
    
    const isAdmin:boolean = (!isLoading && user?.isAdmin) ? user?.isAdmin : false
    const isLoggedIn:boolean  = !isLoading && !isUnauthorized
    const userDetails : {firstName: string, lastName: string} ={firstName: (!isLoading && user?.name) ? user?.name : '', lastName: (!isLoading &&  user?.lastname) ? user?.lastname : ''}


    return(
        <>
            <Menu width={'350px'}  isOpen={menuIsOpened} customBurgerIcon={false} onStateChange={(state) => setMenuIsOpened(state.isOpen)} outerContainerId="outer-container" pageWrapId="page-wrap">
                <button className=' cursor-pointer lg:hidden fixed top-6 xs:top-4.5 left-5 text-main-navy-blue text-4xl xs:text-5xl' onClick={()=>setMenuIsOpened(s=>!s)}><IoCloseOutline/></button>
                <Sidebar isLoggedIn={isLoggedIn} isAdmin={isAdmin}/> 
            </Menu>
            <div className="bg-gray-50 h-screen w-screen overflow-hidden min-h-screen flex max-w-screen max-h-screen" id="page-wrap">
                <button className=' z-50 cursor-pointer lg:hidden fixed top-6 xs:top-4.5 left-5 text-main-navy-blue text-4xl xs:text-5xl' onClick={()=>setMenuIsOpened(s=>!s)}><IoMenuOutline/></button>
                <div className=" hidden lg:grid sticky left-0 top-0 h-screen ">
                    <Sidebar isLoggedIn={isLoggedIn} isAdmin={isAdmin}/>   
                </div>
                <div className="flex-1 min-w-0">
                    <Header firstName={userDetails.firstName} lastName={userDetails.lastName} isLoggedIn={ isLoggedIn} isAdmin={isAdmin}>
                        <main className="flex-1 overflow-auto lg:p-16 p-4 pt-16 lg:pt-24 w-full h-full">
                        <div className="min-w-full inline-block">
                            {children}
                        </div>
                        </main>
                    </Header>
                </div>
            
            </div>
        </>
    )
}