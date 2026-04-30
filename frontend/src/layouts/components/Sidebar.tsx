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

const [logoutModalOpened, setLogoutModalOpened] = useState<boolean>(false)
const [loginModalOpened, setLoginModalOpened] = useState<boolean>(false)

const navigate= useNavigate();
const location = useLocation();

const logout = ()=>{
    //TODO remove tokens !!!!!!!!!!!!!!!
    //window.location.assign('/login');
}

const userOrAdminNavLinks =isAdmin ? adminNavLinks : userNavLinks

    return(<>
    <CustomModal  isOpened={logoutModalOpened} onClose={()=>{setLogoutModalOpened(false)}}
    footer={

        <div className=" w-fulls h-12 flex justify-center text-xl ">
            <button onClick={()=>{setLogoutModalOpened(false)}} className="bg-white border border-gray-100 shadow-gray-400 w-32 h-10 p-0 flex justify-center items-center shadow-md rounded-xl mr-6 ">No</button> 
            <button onClick={logout} className="bg-main-navy-blue text-white w-32 h-10 p-0 flex justify-center items-center rounded-xl ml-6">Yes</button>
        </div>
    }>
        <span className="flex justify-center text-2xl text-center text-main-navy-blue mx-8 my-4">Are you sure you want to log out?</span>
    </CustomModal>

    <LogInRequirementModal onClose={()=>{setLoginModalOpened(false)}} isOpened={loginModalOpened}/>
        
            <div className="flex flex-col justify-between h-full z-10 bg-white w-(20vw) max-w-(95vw) min-w-xs shadow-sm border-r border-gray-200"> 
                        <div >
                            <div className="  mt-12 mb-16  flex place-content-center w-full "><img className=' w-40' src='/logo.png'/></div>    
                            
                               { isLoggedIn ? userOrAdminNavLinks.map((navLink, idx)=> { return (<NavLink key={"navLink"+idx}  path={navLink.path} label={navLink.label} Icon={navLink.Icon} active={location.pathname===navLink.path}/>)})
                                :<>
                                    {/* <NavLink key={"navLink0"}  path={'/books'} label='Catalog' Icon={ ()=> <BiFolder/>} active={location.pathname==='/books'}/> */}
                                    {guestNavLinks.map((navLink, idx)=><NavLink path={navLink.path} key={"navLink"+idx+1} onClick={(e)=>{e.preventDefault(); 
                                    const splittedPath = navLink.path.split('/')
                                    console.log(splittedPath)
                                    if(isLoggedIn){
                                      navigate(navLink.path)
                                    } else if (splittedPath[1]==='admin' || splittedPath[1]==='user'){
                                      setLoginModalOpened(true);
                                    }
                                     }} label={navLink.label} Icon={navLink.Icon} active={location.pathname===navLink.path}/>)}
                                </>   
                            }
                                
                        </div>
                        
                        {
                            isLoggedIn && <Link to='' onClick={()=>{setLogoutModalOpened(true)}}  className="flex transition-colors  duration-300  ease-out mb-12 hover:bg-red-100  hover:text-red-600 h-12 items-center m-3 mx-4 px-8 rounded-md " >
                            <span className=" mr-4 text-2xl"> <BiLogOut/></span>Log out
                        </Link>
                        }
                        
                        
                    </div>
                    </>
                 
    )
}