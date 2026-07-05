import avatars from "../../assets/avatars";

type AvatarPickerProps = {
    selectedAvatar: string | null
    onSelect: (url: string) => void
}

function AvatarPicker ({ selectedAvatar, onSelect }: AvatarPickerProps) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-[#5C7E8D] font-medium text-sm ">Choose an avatar</p>
            <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto p-2 bg-white rounded-xl">
                {avatars.map((url, index) => (
                    <img 
                        key={index}
                        src={url}
                        alt={`Avatar ${index + 1}`}
                        onClick={() => onSelect(url)}
                        className={`w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform ${
                                selectedAvatar === url ? 'ring-2 ring-[#26A5FF]' : ''}
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}

export default AvatarPicker