import type { JSX } from "react"
import { Link } from "react-router-dom"

type NavLinkType = {
    label: string,
    path: string,
    Icon: () => JSX.Element
    active: boolean
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>)=>void
}
export default function NavLink ({path, label, Icon, active, onClick}: NavLinkType){

    return (
    <Link to={path} onClick={onClick} className="flex hover:bg-gray-100 transition-all duration-300  h-12 items-center m-3 mx-4 px-8 rounded-lg " style={{backgroundColor: active ? 'var(--color-main-light-blue)': "", color:  active ? 'var(--color-main-navy-blue)': "" }}>
        <span className=" mr-4 text-2xl"> <Icon/></span>{label}
    </Link>
    )
    
}