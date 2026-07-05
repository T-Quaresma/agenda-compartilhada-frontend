import { Plus, Pencil, Trash2 } from "lucide-react"

type BottomNavProps = {
    groups?: any[]
    selectedGroupId?: number | null
    onGroupClick?: (groupId: number) => void
    onNewGroupClick?: () => void
    onGroupEddit?: (groupId: Number, currentName: string) => void
    onGroupDelete?: (groupId: Number) => void
}

function BottomNav({ groups = [], selectedGroupId = null, onGroupClick = () => {}, onNewGroupClick = () => {}, onGroupEddit, onGroupDelete }: BottomNavProps) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#87A7B8] rounded-t-3xl">
            {/*Área dos cards*/}
            <div className="px-4 pt-6 pb-3 justify-center overflow-x-auto overflow-y-hidden h-[144px] flex items-end gap-3">
                    <button 
                        title="Create a new activity group" 
                        onClick={onNewGroupClick} 
                        className="flex flex-col w-[84px] h-[100px] rounded-xl overflow-hidden cursor-pointer border-0 shrink-0">
                        <div className="bg-[#5C7E8D] h-[60%] flex items-center justify-center">
                            <Plus color="#26A5FF" size={36} strokeWidth={3} strokeLinecap="square" />
                        </div>
                        <div className="bg-[#386A81] h-[40%] flex items-center justify-center">
                            <span className="text-xs text-white">New Group</span>
                        </div>
                    </button>

                    {groups.map(group => (
                        <div 
                            key={group.grupoId} 
                            onClick={() => onGroupClick(group.grupoId)}
                            className={`flex flex-col w-[84px] h-[100px] rounded-xl overflow-hidden cursor-pointer shrink-0 transition-all duration-200 ${
                                selectedGroupId === group.grupoId 
                                    ? '-translate-y-2 ring-2 ring-white shadow-lg' 
                                    : 'translate-y-0'
                            }`}
                        >
                            <div className="bg-[#5C7E8D] h-[60%] flex items-center justify-center">
                                {group.imagem  
                                    ? <img src={group.imagem} alt={group.nomeGrupo} className="w-8 h-8 rounded" />
                                    : <div className="w-8 h-8 bg-[#87A7B8] rounded" />
                                }
                            </div>
                            <div className="bg-[#386A81] h-[40%] px-1 flex flex-col items-center justify-center gap-1">
                                <span className="text-xs text-white text-center truncate w-full">
                                    {group.nomeGrupo}
                                </span>  
                                <div className="flex gap-1">
                                    <button title="Edit Group" onClick={(e) => {e.stopPropagation(); onGroupEddit?.(group.grupoId, group.nomeGrupo)}}>
                                        <Pencil size={12} color="white"/>
                                    </button>
                                    <button title="Delete this group permanently" onClick={(e) => { e.stopPropagation(); onGroupDelete?.(group.grupoId) }}>
                                        <Trash2 size={12} color="white"/>
                                    </button>
                                </div>
                            </div>    
                        </div>
                    ))}
                
            </div>

            {/* Barra escura no rodapé */}
            <div className="h-4 w-full bg-[#5C7E8D]" />
        </nav>  
    )
}

export default BottomNav