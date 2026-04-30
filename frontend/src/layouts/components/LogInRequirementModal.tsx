import CustomModal from "../../ui/CustomModal"
import { useNavigate } from "react-router-dom"

type LogInRequirementModalProps = {
    isOpened: boolean,
    onClose: ()=>void
}

export default function LogInRequirementModal({ isOpened,  onClose}: LogInRequirementModalProps){
const navigate= useNavigate();


    return (
             <CustomModal bgColor='var(--color-white)' isOpened={isOpened} onClose={onClose} footer={<div className="w-full flex justify-center mb-8"> <button onClick={()=>{navigate('/login')}} className="bg-main-blue text-white w-32 h-10 p-0 flex justify-center items-center rounded-xl ml-6">Log in</button></div>}>
      <div className="flex flex-col justify-center items-center mx-16">
        <img className=' w-40' src='/logo.png'/>
       <span className="text-lg mt-8   w-[70%] text-center mx-5">Log in to borrow books and browse the catalog. </span> 
      </div>

      </CustomModal>
    )
}