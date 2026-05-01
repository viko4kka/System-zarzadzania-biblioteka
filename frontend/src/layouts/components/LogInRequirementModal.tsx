import CustomModal from "../../ui/CustomModal"
import { useNavigate } from "react-router-dom"
import { Button } from "../../ui/Button";

type LogInRequirementModalProps = {
    isOpened: boolean,
    onClose: ()=>void
}

export default function LogInRequirementModal({ isOpened,  onClose}: LogInRequirementModalProps){
const navigate= useNavigate();


    return (
             <CustomModal bgColor='var(--color-white)' isOpened={isOpened} onClose={onClose}>
                <CustomModal.Content  className="flex flex-col justify-center items-center mb-4 mx-16 ">
                    <img className=' w-40' src='/logo.png'/>
                    <span className="text-lg mt-8   w-[70%] text-center mx-5">Log in to borrow books and browse the catalog. </span> 
                </CustomModal.Content>
                <CustomModal.Footer 
                >
                    <Button intent='primary' onClick={()=>{navigate('/login')}} className=" w-32 h-10 p-0 ml-6">Log in</Button>
                </CustomModal.Footer>
      </CustomModal>
    )
}