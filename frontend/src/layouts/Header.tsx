import type { ReactNode } from "react"
import Badge from "./components/Badge"

type HeaderProps = {
    children: ReactNode,
    isAdmin:boolean
    isLoggedIn: boolean
    firstName: string,
    lastName: string,
}

export default function  Header({children,
    isAdmin,
    isLoggedIn,
    firstName,
    lastName}: HeaderProps){
    return <>
    <div className="fixed flex top-5.5 lg:right-15 right-2 ">
        {isAdmin &&  isLoggedIn && <div className="mx-0 lg:mx-4"><Badge title="Administrator" cursor="default"  bgColor="--color-highlight" color="--color-font-highlight"/></div>}
        <div className="mx-0 lg:mx-4">
            {
                isLoggedIn ? <Badge title= {"Welcome, "+firstName+' '+lastName}  href={ isAdmin ? '/admin/profile' : '/user/profile'} color="--color-main-navy-blue" bgColor="--color-main-light-blue"/>
                : <Badge title='Log in' href="/login" color="--color-main-navy-blue" bgColor="--color-main-light-blue"/>
            }
        </div>
    </div>
    <div className="w-full h-full">{children}</div>
    </>
}