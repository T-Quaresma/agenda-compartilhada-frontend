import { useEffect, useState, type FormEvent } from "react"
import { Calendar, MapPin, User, Repeat, Trash2, Search, UserPlus, X } from "lucide-react"
import {
    addScheduleParticipant,
    getScheduleParticipants,
    removeScheduleParticipant,
    searchUsersByName
} from "../../services/participante"
import type { ScheduleParticipant, UserSearchResult } from "../../services/participante"

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
    canManageParticipants?: boolean
    compact?: boolean
    onEditClick?: () => void
    onDeleteClick?: () => void
    onCardClick?: () => void
}

type ParticipantData = {
    scheduleId: number
    loadVersion: number
    participants: ScheduleParticipant[]
    failed?: boolean
}

function ScheduleCard({ nomeAtiv, agendId, nomeAgen, descAgen, data_inicio, data_fim, hora_inicio, hora_fim, local, frequency, compact, onEditClick, onDeleteClick, onCardClick, showDelete = true, canManageParticipants = true }: ScheduleProps) {
    const [participantData, setParticipantData] = useState<ParticipantData | null>(null)
    const [participantActionError, setParticipantActionError] = useState<string | null>(null)
    const [showAddParticipant, setShowAddParticipant] = useState(false)
    const [userSearch, setUserSearch] = useState("")
    const [userSearchResults, setUserSearchResults] = useState<UserSearchResult[]>([])
    const [hasSearchedUsers, setHasSearchedUsers] = useState(false)
    const [userSearchLoading, setUserSearchLoading] = useState(false)
    const [userSearchError, setUserSearchError] = useState<string | null>(null)
    const [addingUserId, setAddingUserId] = useState<number | null>(null)
    const [removingParticipantId, setRemovingParticipantId] = useState<number | null>(null)
    const [participantReloadVersion, setParticipantReloadVersion] = useState(0)
    const participants = participantData?.scheduleId === agendId
        ? participantData.participants
        : []
    const participantsLoading = canManageParticipants
        && !compact
        && Boolean(agendId)
        && (participantData?.scheduleId !== agendId
            || participantData.loadVersion !== participantReloadVersion)
    const participantsError = participantActionError
        ?? (participantData?.scheduleId === agendId
            && participantData.loadVersion === participantReloadVersion
            && participantData.failed
            ? "Could not load participants."
            : null)

    useEffect(() => {
        let cancelled = false

        if (compact || !canManageParticipants || !agendId) return

        async function loadParticipants() {
            try {
                const data = await getScheduleParticipants(agendId)
                if (!cancelled) {
                    setParticipantData({
                        scheduleId: agendId,
                        loadVersion: participantReloadVersion,
                        participants: data
                    })
                }
            } catch (error) {
                console.error("Error loading schedule participants:", error)
                if (!cancelled) {
                    setParticipantData({
                        scheduleId: agendId,
                        loadVersion: participantReloadVersion,
                        participants: [],
                        failed: true
                    })
                }
            }
        }

        loadParticipants()

        return () => {
            cancelled = true
        }
    }, [agendId, canManageParticipants, compact, participantReloadVersion])

    async function handleUserSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const name = userSearch.trim()
        setUserSearchError(null)
        setUserSearchResults([])

        if (!name) {
            setHasSearchedUsers(false)
            setUserSearchError("Enter the user's exact name to search.")
            return
        }

        setHasSearchedUsers(true)
        setUserSearchLoading(true)
        try {
            setUserSearchResults(await searchUsersByName(name))
        } catch (error) {
            console.error("Error searching users:", error)
            setUserSearchError("Could not search users.")
        } finally {
            setUserSearchLoading(false)
        }
    }

    async function handleAddParticipant(user: UserSearchResult) {
        setAddingUserId(user.usuId)
        setUserSearchError(null)

        try {
            const result = await addScheduleParticipant(user.usuId, agendId)
            setParticipantData(previous => previous?.scheduleId === agendId
                ? {
                    ...previous,
                    failed: false,
                    participants: previous.participants.some(
                        participant => participant.partId === result.partId
                    )
                        ? previous.participants
                        : [
                            ...previous.participants,
                            {
                                partId: result.partId,
                                usuId: user.usuId,
                                nomeUsu: user.nomeUsu,
                                status: result.status
                            }
                        ]
                }
                : {
                    scheduleId: agendId,
                    loadVersion: participantReloadVersion,
                    participants: [{
                        partId: result.partId,
                        usuId: user.usuId,
                        nomeUsu: user.nomeUsu,
                        status: result.status
                    }]
                })
            setShowAddParticipant(false)
            setUserSearch("")
            setUserSearchResults([])
        } catch (error) {
            console.error("Error adding schedule participant:", error)
            setUserSearchError("Could not send invitation. Please try again.")
        } finally {
            setAddingUserId(null)
        }
    }

    async function handleRemoveParticipant(participantId: number) {
        setRemovingParticipantId(participantId)
        setParticipantActionError(null)

        try {
            await removeScheduleParticipant(participantId)
            setParticipantData(previous => previous?.scheduleId === agendId
                ? {
                    ...previous,
                    participants: previous.participants.filter(
                        participant => participant.partId !== participantId
                    )
                }
                : previous)
        } catch (error) {
            console.error("Error removing schedule participant:", error)
            setParticipantActionError("Could not remove participant.")
        } finally {
            setRemovingParticipantId(null)
        }
    }
    
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
                    {showDelete && onDeleteClick && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteClick?.() }}
                            className="ml-2 p-1">
                            <Trash2 size={18} color="#26A5FF" />
                        </button>
                    )}
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
                                <p className="text-white text-[0.9vw] font-semibold">
                                    {participants.filter(participant => participant.status === "accepted").length} Participants
                                </p>
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
                        {showDelete && onDeleteClick &&(
                            <div className="flex flex-col items-center gap-1">
                                <p className="text-[#5C7E8D] text-xs">Delete Schedule</p>
                            
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteClick?.() }}
                                    className="bg-[#D22D39] text-white px-6 py-1 rounded-full text-sm w-[100px]">
                                    Delete
                                </button>
                            </div>
                        )}          
                    </div>
                </div>

                {/* Divisor vertical */}
                <div className="w-px bg-white" />

                {/* Coluna direita — Participantes */}
                <div className="flex flex-col flex-1 gap-3 rounded-xl p-4 min-w-0">
                    <h2 className="text-[#5C7E8D] text-[2.0vw] text-center">Participants</h2>
                    {participantsError && (
                        <p role="alert" className="text-red-600 text-sm text-center">{participantsError}</p>
                    )}
                    <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0">
                        {participantsLoading ? (
                            <p role="status" className="text-[#5C7E8D] text-sm text-center mt-4">
                                Loading participants...
                            </p>
                        ) : !canManageParticipants ? (
                            <p className="text-[#5C7E8D] text-sm text-center mt-4">
                                Participants are only visible to the schedule owner.
                            </p>
                        ) : participantData?.scheduleId === agendId && participantData.failed ? (
                            <button
                                type="button"
                                onClick={() => setParticipantReloadVersion(version => version + 1)}
                                className="text-[#5C7E8D] text-sm text-center mt-4 underline"
                            >
                                Could not load participants. Try again.
                            </button>
                        ) : participants.length === 0 ? (
                            <p className="text-[#5C7E8D] text-sm text-center mt-4">
                                No participants yet.
                            </p>
                        ) : (
                            participants.map(participant => (
                                <div
                                    key={participant.partId}
                                    className="flex items-center gap-2 min-h-10"
                                >
                                    <div className="w-7 h-7 rounded-full bg-[#87A7B8] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                                        {participant.nomeUsu.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-white text-sm truncate flex-1">
                                        {participant.nomeUsu}
                                    </span>
                                    <span className="text-[#5C7E8D] text-xs capitalize">
                                        {participant.status}
                                    </span>
                                    <button
                                        type="button"
                                        aria-label={`Remove ${participant.nomeUsu}`}
                                        disabled={removingParticipantId !== null}
                                        onClick={() => handleRemoveParticipant(participant.partId)}
                                        className="p-1 text-[#26A5FF] hover:text-red-600 disabled:opacity-50"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    {canManageParticipants && (
                        <button
                            type="button"
                            disabled={participantsLoading}
                            onClick={() => {
                                setUserSearchError(null)
                                setUserSearch("")
                                setUserSearchResults([])
                                setHasSearchedUsers(false)
                                setShowAddParticipant(true)
                            }}
                            className="self-center bg-[#9FD7F1] text-[#5C7E8D] px-5 py-2 rounded-full text-sm font-semibold disabled:opacity-50"
                        >
                            Add Participant
                        </button>
                    )}
                </div>
            </div>
            {showAddParticipant && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={() => setShowAddParticipant(false)}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="add-participant-title"
                        className="w-full max-w-md rounded-2xl bg-[#E1EFF4] p-6 shadow-xl"
                        onClick={event => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <h2 id="add-participant-title" className="text-[#5C7E8D] text-xl font-bold">
                                Add Participant
                            </h2>
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={() => setShowAddParticipant(false)}
                                className="text-[#5C7E8D]"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-[#5C7E8D] text-sm mb-3">
                            Search by the user's exact name. They will receive an invitation to this schedule.
                        </p>
                        <form onSubmit={handleUserSearch} className="flex gap-2">
                            <input
                                autoFocus
                                type="search"
                                value={userSearch}
                                onChange={event => {
                                    setUserSearch(event.target.value)
                                    setUserSearchResults([])
                                    setHasSearchedUsers(false)
                                }}
                                aria-label="User's exact name"
                                placeholder="User's exact name"
                                className="min-w-0 flex-1 rounded-lg border border-[#B9D9E5] bg-white px-3 py-2 text-[#5C7E8D] outline-none"
                            />
                            <button
                                type="submit"
                                disabled={userSearchLoading}
                                className="flex items-center gap-2 rounded-lg bg-[#5ca6db] px-4 py-2 text-white disabled:opacity-50"
                            >
                                <Search size={16} />
                                Search
                            </button>
                        </form>
                        {userSearchError && (
                            <p role="alert" className="mt-3 text-sm text-red-600">{userSearchError}</p>
                        )}
                        {userSearchLoading && (
                            <p role="status" className="mt-3 text-sm text-[#5C7E8D]">Searching...</p>
                        )}
                        {!userSearchLoading && hasSearchedUsers && userSearchResults.length === 0 && !userSearchError && (
                            <p className="mt-3 text-sm text-[#5C7E8D]">No users found. Check the exact name and try again.</p>
                        )}
                        <div className="mt-3 flex max-h-56 flex-col gap-2 overflow-y-auto">
                            {userSearchResults.map(user => (
                                <div
                                    key={user.usuId}
                                    className="flex items-center gap-3 rounded-lg bg-white p-3"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#87A7B8] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                                        {user.nomeUsu.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-[#5C7E8D] text-sm flex-1">{user.nomeUsu}</span>
                                    <button
                                        type="button"
                                        disabled={addingUserId !== null}
                                        onClick={() => handleAddParticipant(user)}
                                        className="flex items-center gap-1 rounded-full bg-[#9FD7F1] px-3 py-1 text-sm font-semibold text-[#5C7E8D] disabled:opacity-50"
                                    >
                                        <UserPlus size={15} />
                                        Invite
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </div>
    )
}

export default ScheduleCard