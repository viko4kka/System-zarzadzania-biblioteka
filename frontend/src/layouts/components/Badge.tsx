import { Link } from "react-router-dom"

type BadgeProps={
    title: string
    href?: string
    color?: string
    bgColor: string
}

export default function Badge({title, color, bgColor, href}: BadgeProps){

    return (< Link to={href ? href: ''} className="block  shadow-md  max-w-36 sm:max-w-52 text-center lg:max-w-sm xl:max-w-xl 2xl:max-w-4xl   lg:text-md  sm:text-sm  text-xs truncate px-4  lg:px-10 py-2 rounded-3xl font-medium mx-1  my-1 min-w-28" 
                    style={{backgroundColor: `var(${bgColor})`, color: color ? `var(${color})` : ''}}>
        {title}
        </Link>)
}