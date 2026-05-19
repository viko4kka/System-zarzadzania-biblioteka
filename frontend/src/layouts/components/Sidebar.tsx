 import NavLink from "./NavLink";
import { BiLogOut } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import CustomModal from "../../ui/CustomModal";
import { BiBookBookmark, BiFolder, BiHistory, BiUser } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type {  JSX } from "react"
import LogInRequirementModal from "./LogInRequirementModal";
import { useLogout } from "../../hooks/auth/useLogOut";
import { Button } from "../../ui/Button";

type SidebarProps ={
isAdmin:boolean
isLoggedIn: boolean
}

type NavLinkType = {
    label: string,
    path: string,
    Icon: () => JSX.Element
}

const guestNavLinks: NavLinkType[]=[
      {
    path: '/books',
    Icon: ()=> <BiFolder/>,
    label: "Catalog"
    
  },
    {
    path: '/user/loans',
    Icon: ()=> < BiBookBookmark/>,
    label: "Loans"
  },
  {
    path: '/user/history',
   Icon: ()=><BiHistory/>,
    label: "History"
  },
  {
    path: '/user/profile',
     Icon: ()=> < FiSettings />,
    label: "My profile"
  },
]

const userNavLinks: NavLinkType[]=[
      {
    path: '/user/dashboard',
    Icon: ()=> <BiFolder/>,
    label: "Catalog"
    
  },
    {
    path: '/user/loans',
    Icon: ()=> < BiBookBookmark/>,
    label: "Loans"
  },
  {
    path: '/user/history',
   Icon: ()=><BiHistory/>,
    label: "History"
  },
  {
    path: '/user/profile',
     Icon: ()=> < FiSettings />,
    label: "My profile"
  },
]


const adminNavLinks: NavLinkType[]=[
      {
    path: '/admin/dashboard',
     Icon: ()=> <BiFolder/>,
    label: "Catalog"
    
  },
    {
    path: '/admin/loans',
    Icon: ()=> < BiBookBookmark/>,
    label: "Loans"
  },
  {
    path: '/admin/history',
    Icon: ()=><BiHistory/>,
    label: "History"
  },
    {
    path: '/admin/users',
   Icon: ()=> < BiUser/>,
    label: "Users"
  },
  {
    path: '/admin/profile',
    Icon: ()=> <FiSettings />,
    label: "My profile"
  },
]

export default function Sidebar({isAdmin, isLoggedIn}: SidebarProps){
    const { logout } = useLogout();

const [logoutModalOpened, setLogoutModalOpened] = useState<boolean>(false)
const [loginModalOpened, setLoginModalOpened] = useState<boolean>(false)

const navigate= useNavigate();
const location = useLocation();

//const userOrAdminNavLinks =isAdmin ? adminNavLinks : userNavLinks
const choosenNavLinks =isLoggedIn ? isAdmin ? adminNavLinks : userNavLinks : guestNavLinks

    return(<>
    <CustomModal isOpened={logoutModalOpened} onClose={()=>{setLogoutModalOpened(false)}}>
        <CustomModal.Content className="flex justify-center items-center text-2xl text-center text-main-navy-blue h-28">Are you sure you want to log out?</CustomModal.Content>
        <CustomModal.Footer className="w-full  flex justify-center text-xl ">        
            <Button intent='third' onClick={()=>{setLogoutModalOpened(false)}} className=" h-10 lg:w-32  lg:mr-6 w-24 mr-2 ">No</Button> 
            <Button intent='secondary' onClick={logout} className="h-10 lg:w-32  lg:ml-6 w-24 ml-2">Yes</Button>
        </CustomModal.Footer>
    </CustomModal>

    <LogInRequirementModal onClose={()=>{setLoginModalOpened(false)}} isOpened={loginModalOpened}/>
            <div className="flex flex-col justify-between h-full z-10 bg-white w-[320px]  min-w-xs shadow-sm border-r border-gray-200"> 
                        <div >
                            <div className="  mt-12 mb-16 flex place-content-center w-full "><img className=' w-40' src='/logo.png'/></div>    
                               { choosenNavLinks.map((navLink, idx)=> { 
                                return (<NavLink key={"navLink"+idx}  path={navLink.path} label={navLink.label} Icon={navLink.Icon} active={location.pathname===navLink.path}
                                onClick={(e)=>{e.preventDefault(); 
                                    const splittedPath = navLink.path.split('/')
                                    if(isLoggedIn){
                                      navigate(navLink.path)
                                    } else if (splittedPath[1]==='admin' || splittedPath[1]==='user'){
                                      setLoginModalOpened(true);
                                    }else{
                                       navigate(navLink.path)
                                    }
                                     }}
                                />)}) 
                            }
                                
                        </div>
                        
                        {
                            isLoggedIn && <Link to='' onClick={()=>{setLogoutModalOpened(true)}}  className="flex transition-all duration-300 mb-12 hover:bg-red-100  hover:text-red-600 h-12 items-center m-3 mx-4 px-8 rounded-lg " >
                                            <span className=" mr-4 text-2xl"> <BiLogOut/></span>Log out
                                          </Link>
                        }
                        
                        
                    </div>
                    </>
                 
    )
}