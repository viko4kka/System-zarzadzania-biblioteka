import Header from "./Header"
import type { ReactNode} from "react"
import { slide as Menu } from 'react-burger-menu';
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import Sidebar from "./components/Sidebar";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";



type MainLayoutProps = {
    children: ReactNode,
    
}




export default function MainLayout ({children}: MainLayoutProps){
    const [menuIsOpened, setMenuIsOpened] = useState<boolean>(false);
    const location = useLocation();

    const[isAdmin, setIsAdmin] = useState<boolean>(false);
    const[isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userDetails, setUserDetails]= useState<{firstName: string, lastName: string}>({firstName: '', lastName: ''});


  useEffect(()=>{
    //FIXME branie z tokena/ów role, firstName, lastName
    const setRoleAndNames =  ()=>{
      const isAdminFromToken: boolean=  localStorage.getItem('isAdmin') ? localStorage.getItem('isAdmin')==='true' : false
      const isLoggedInFromToken: boolean = localStorage.getItem('isLoggedIn') ? localStorage.getItem('isLoggedIn')==='true' : false
      const firstNameFromToken =  localStorage.getItem('name') ? localStorage.getItem('name') as string : ''
      const lastNameFromToken = localStorage.getItem('lastName') ? localStorage.getItem('lastName') as string : ''

      setIsAdmin(isAdminFromToken)
      setIsLoggedIn(isLoggedInFromToken)
      setUserDetails({firstName: firstNameFromToken, lastName: lastNameFromToken})
      }
    setRoleAndNames()


  },[location])


    return(
        <>
        
        <Menu width={'350px'}  isOpen={menuIsOpened} customBurgerIcon={false} onStateChange={(state) => setMenuIsOpened(state.isOpen)} outerContainerId="outer-container" pageWrapId="page-wrap">
             <button className=' cursor-pointer lg:hidden fixed top-6 xs:top-4.5 left-5 text-main-navy-blue text-4xl xs:text-5xl' onClick={()=>setMenuIsOpened(s=>!s)}><IoCloseOutline/></button>
                        <Sidebar isLoggedIn={isLoggedIn} isAdmin={isAdmin}/> 
        </Menu>

        <div className="bg-gray-50 h-full min-h-screen flex" id="page-wrap">
            <button className=' z-50 cursor-pointer lg:hidden fixed top-6 xs:top-4.5 left-5 text-main-navy-blue text-4xl xs:text-5xl' onClick={()=>setMenuIsOpened(s=>!s)}><IoMenuOutline/></button>
            

            
           <div className=" hidden lg:grid sticky left-0 top-0 h-screen ">
                        <Sidebar isLoggedIn={isLoggedIn} isAdmin={isAdmin}/>   
            </div>
            <div>
                <Header firstName={userDetails.firstName} lastName={userDetails.lastName} isLoggedIn={isLoggedIn} isAdmin={isAdmin}>
                    <div className="lg:p-16 p-8 pt-28 lg:pt-24">
                        {children}
                    </div>
                </Header>
            </div>
           
        </div>
        </>
    )
}