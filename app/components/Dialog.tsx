import { PropsWithChildren, ReactElement, useState } from "react";
import { Dialog } from "@headlessui/react"

type DialogProps = {
    isOpen?: boolean
    title: string
    desc?: string
    actionLbl?: string
    acting?: boolean
    onAction?: () => void
}


function _Dialog({ isOpen: isDialogOpen, title, desc, actionLbl, onAction = () => {}, children }: PropsWithChildren<DialogProps>): ReactElement {
    let [isOpen, setIsOpen] = useState(isDialogOpen)

    function handleAction() {
        onAction()
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
            <div className="modal modal-open grid place-content-center">
                <Dialog.Overlay />
                <div className="modal-box w-full">
                    <Dialog.Title className="text-2xl font-semibold text-blue-900">{title}</Dialog.Title>
                        {desc && <Dialog.Description>
                            {desc}
                            </Dialog.Description>
                        }
                    <div className="h-1 bg-blue-200 mt-2 mb-4"></div>
                    {children}
                    <div className="modal-action">
                        <button onClick={handleAction}>{actionLbl || 'action'}</button>
                        <button onClick={() => setIsOpen(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default _Dialog
