type ModalProps = {
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel: () => void,
    isOpen: boolean
}

function Modal({title, message, onConfirm, onCancel, isOpen}: ModalProps) {
    if (!isOpen)
        return null
    else {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#E1EFF4] rounded-2xl p-6 w-[90%] max-w-[400px] flex flex-col gap-4">
                    <h1 className="text-[#5C7E8D] font-bold text-xl text-center">{title}</h1>
                    <h2 className="text-[#5C7E8D] text-sm text-center">{message}</h2>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onConfirm}
                            className="bg-[#D22D39] text-white px-6 py-2 rounded-full"
                        >
                            Confirm
                        </button>
                        <button 
                            onClick={onCancel}
                            className="bg-[#87A7B8] text-white px-6 py-2 rounded-full"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    }    
}

export default Modal