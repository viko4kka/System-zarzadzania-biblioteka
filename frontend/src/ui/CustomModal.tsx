import type { ReactNode } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

// type CustomModalProps ={
//     isOpened: boolean //state decydujący czy modal jest otwart
//     children?: ReactNode
//     header?: string
//     footer?: ReactNode
//     width?: string
//     height?: string
//     onClose?: ()=>void 
//     withoutCloseButton?: boolean
//     bgColor?: string


// }

// export default function CustomModal ({    isOpened,    children,    header,    footer,    onClose, height, width, withoutCloseButton, bgColor }: CustomModalProps){

// return (<>
//     <Modal open={isOpened} onClose={onClose ? onClose : ()=>{}} center closeIcon={withoutCloseButton ? <></> : null}
// styles={{modal: {borderRadius: 'var(--radius-2xl)', backgroundColor: bgColor ? bgColor : "var(--color-gray-100)", width: width ? width : 'auto', height: height ? height : 'auto', zIndex: 1000, maxWidth: '100vw'}}}
//   >
//         <div className='min-h-30 flex flex-col h-full justify-between'>
//             <h1 className='text-main-navy-blue flex  -mt-1 text-lg font-semibold  mr-8'>{header}</h1>
//             <div className='flex flex-col  h-full justify-between content-between '>
//                 <div className='my-8 flex-wrap overflow-auto'>{children}</div>
//                 <div className='m-xl flex justify-center content-center overflow-auto'>{footer}</div>
//             </div>

//         </div>

//     </Modal>
// </>)
// }

type CustomModalProps ={
    isOpened: boolean //state decydujący czy modal jest otwart
    children?: ReactNode
    width?: string
    height?: string
    onClose?: ()=>void 
    withoutCloseButton?: boolean
    bgColor?: string
    header?: string


}

type CustomModalElementsProps={
   children?: ReactNode
   className?:string
}

const CustomModal = ({children, isOpened, onClose, height, width, bgColor, withoutCloseButton, header}: CustomModalProps) =>{
    return     <Modal open={isOpened} onClose={onClose ? onClose : ()=>{}} center closeIcon={withoutCloseButton ? <></> : null}
    styles={{modal: {borderRadius: 'var(--radius-2xl)', backgroundColor: bgColor ? bgColor : "var(--color-gray-200)", width: width ? width : 'auto', height: height ? height : 'auto', zIndex: 1000, maxWidth: '90vw', padding: '0px'}}}
  >
     <h1 className='text-main-navy-blue block m-4 mb-0 text-lg font-semibold truncate  mr-12'>{header}</h1>
     {children}     
    </Modal>
}

CustomModal.Content = ({children, className}: CustomModalElementsProps) => (  <div className=' flex justify-center content-center overflow-auto p-8 pb-2'><div className={className}>{children}</div></div>)
CustomModal.Footer = ({children, className}: CustomModalElementsProps) => (  <div className=' flex justify-center content-center overflow-auto p-8 pt-2'><div className={className}>{children}</div></div>)

export default CustomModal