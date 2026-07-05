import { Calendar, MapPin, User, Repeat, Trash2 } from "lucide-react"

type ScheduleProps = {
    nomeAtiv: string
    agendId: number
    nomeAgen: string
    descAgen: string | null
    data_inicio: string | null
    data_fim: string | null
    hora_inicio: string | null
    hora_fim: string | null
    local: string | null
    frequency: string | null
    showDelete?: boolean
    compact?: boolean
    onEditClick?: () => void
    onDeleteClick: () => void
    onCardClick?: () => void
}

function ScheduleCard({ nomeAtiv, nomeAgen, descAgen, data_inicio, data_fim, hora_inicio, hora_fim, local, frequency, compact, onEditClick, onDeleteClick, onCardClick }: ScheduleProps) {
    
    // Formata data: "Wed, 15 Jul 2026 00:00:00 GMT" → "Wed, 15 Jul 2026"
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null
        return new Date(dateStr).toDateString()
    }

    // Formata hora: "12:00:00" → "12:00"
    const formatTime = (timeStr: string | null) => {
        if (!timeStr) return null
        return timeStr.slice(0, 5)
    }

    const dateDisplay = [
        formatDate(data_inicio),
        formatTime(hora_inicio),
        data_fim ? `- ${formatDate(data_fim)}` : null,
        hora_fim ? `- ${formatTime(hora_fim)}` : null,
    ].filter(Boolean).join(' ')

    if (compact) {
        return (
            <div 
                onClick={onCardClick}
                className="p-3 cursor-pointer hover:bg-[#E1EFF4] transition-all last:border-b-0"
            >
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1 flex-1">
                        <h3 className="text-white font-bold text-base">{nomeAgen}</h3>
                        <div className="flex items-center gap-4">
                            {dateDisplay && (
                                <div className="flex items-center gap-1">
                                    <Calendar size={18} color="#26A5FF" />
                                    <p className="text-white text-sm">{dateDisplay}</p>
                                </div>
                            )}
                            {local && (
                                <div className="flex items-center gap-1">
                                    <MapPin size={18} color="#26A5FF" />
                                    <p className="text-white text-sm">{local}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteClick() }}
                        className="ml-2 p-1">
                        <Trash2 size={18} color="#26A5FF" />
                    </button>
                </div>
                <div className="h-px bg-white w-[40%] mx-auto mt-3"></div>
            </div>
        )
    }

    return (
        <div className="bg-[#E1EFF4] rounded-[2rem] p-10 w-[90%] mx-auto min-h-[69vh] flex-1 flex flex-col">
            <div className="bg-[#B9D9E5] rounded-[2rem] flex gap-6 p-6 h-full flex-1">
                
                {/* Coluna esquerda — informações do schedule */}
                <div className="flex flex-col flex-1 gap-4 pt-5">
                    <h1 className="text-[#5C7E8D] text-[2.0vw] text-center">{nomeAgen}</h1>
                    {descAgen && (
                        <p className="text-[#758B94] text-[0.8vw] text-center">{descAgen}</p>
                    )}

                    <div className="flex flex-col gap-3 mt-12 items-center">
                        <div className="flex flex-col gap-5 inline-flex">
                            {dateDisplay && (
                                <div className="flex items-center gap-2">
                                    <Calendar size={24} color="#26A5FF" />
                                    <p className="text-white text-[0.9vw] font-semibold">{dateDisplay}</p>
                                </div>
                            )}
                            {local && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={24} color="#26A5FF" />
                                    <p className="text-white text-[0.9vw] font-semibold">{local}</p>
                                </div>
                            )}
                            {nomeAtiv && (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-[#87A7B8] rounded-full shrink-0" />
                                    <p className="text-white text-[0.9vw] font-semibold">{nomeAtiv}</p>
                                </div>
                            )}
                            {frequency && (
                                <div className="flex items-center gap-2">
                                    <Repeat size={24} color="#5ca6db" />
                                    <p className="text-white text-[0.9vw] font-semibold">{frequency}</p>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <User size={24} color="#26A5FF" />
                                <p className="text-white text-[0.9vw] font-semibold">* Participants</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-[#87A7B8] rounded-full shrink-0" />
                                <p className="text-white text-[0.9vw] font-semibold">Created by UserName</p>
                            </div>
                        </div>
                    </div>

                    {/* Botões no rodapé */}
                                    <div className="mt-auto pt-4 border-t border-[#B9D9E5] w-full flex gap-6 justify-center">
                    {onEditClick && (
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-[#5C7E8D] text-xs">Edit Schedule</p>
                            <button
                                onClick={(e) => { e.stopPropagation(); onEditClick?.() }}
                                className="bg-[#5ca6db] text-white px-6 py-1 rounded-full text-sm w-[100px]">
                                Edit
                            </button>
                        </div>
                    )}
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-[#5C7E8D] text-xs">Delete Schedule</p>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteClick() }}
                                className="bg-[#D22D39] text-white px-6 py-1 rounded-full text-sm w-[100px]">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                {/* Divisor vertical */}
                <div className="w-px bg-white" />

                {/* Coluna direita — Participantes */}
                <div className="flex flex-col flex-1 gap-3 rounded-xl p-4 min-w-0">
                    <h2 className="text-[#5C7E8D] text-[2.0vw] text-center">Participants</h2>
                    <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                        <p className="text-[#5C7E8D] text-sm text-center mt-4">Under Construction</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScheduleCard