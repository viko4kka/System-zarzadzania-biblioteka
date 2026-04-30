import type { ReactNode } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

type CustomModalProps ={
    isOpened: boolean //state decydujący czy modal jest otwart
    children?: ReactNode
    header?: string
    footer?: ReactNode
    width?: string
    height?: string
    onClose?: ()=>void 
    withoutCloseButton?: boolean
    bgColor?: string


}

export default function CustomModal ({    isOpened,    children,    header,    footer,    onClose, height, width, withoutCloseButton, bgColor }: CustomModalProps){

return (<>
    <Modal open={isOpened} onClose={onClose ? onClose : ()=>{}} center closeIcon={withoutCloseButton ? <></> : null}
styles={{modal: {borderRadius: 'var(--radius-2xl)', backgroundColor: bgColor ? bgColor : "var(--color-gray-100)", width: width ? width : 'auto', height: height ? height : 'auto', zIndex: 1000, maxWidth: '100vw'}}}
  >
        <div className='min-h-30 flex flex-col h-full justify-between'>
            <h1 className='text-main-navy-blue flex  -mt-1 text-lg font-semibold  mr-8'>{header}</h1>
            <div className='flex flex-col  h-full justify-between content-between '>
                <div className='my-8 flex-wrap overflow-auto'>{children}</div>
                <div className='m-xl flex justify-center content-center overflow-auto'>{footer}</div>
            </div>

        </div>

    </Modal>
</>)
}