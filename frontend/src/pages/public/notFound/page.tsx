import { Button } from "../../../ui/Button"
import { useNavigate } from "react-router-dom"

export default function NotFoundPage(){

    const navigate = useNavigate();



    return (    <div className="bg-mainBgLight flex h-screen w-full items-center justify-center px-12">
          <div className="flex flex-col items-center rounded-xl bg-white py-8 min-w-[35vw]">
            {/* <img className="w-40" src="/logo.png" /> */}
            <h1 className="text-main-navy-blue text-7xl sm:text-8xl my-5">404</h1>
    
             <p className="500:mx-16 800:mx-24 text-main-navy-blue/70 500:text-base 500:mt-4 mx-8 mt-2 text-center text-sm">
             Not found
            </p>
            <p className="text-main-navy-blue 500:text-2xl my-5 text-center text-xl mx-8 ">
              Ops, something went wrong...
            </p>
           
            <Button
              onClick={()=>{navigate('/catalog')}}
              className="mt-6 flex items-center justify-center"
              intent="login"
              size="medium"
            >
              Go back
            </Button>
          </div>
        </div>)
}