import Header from "../../components/Header/Header"
import BottomNav from "../../components/BottomNav/BottomNav"
import ScheduleCard from "../../components/ScheduleCard/ScheduleCard"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { createActivity, getActivity, deleteActivity, updateActivity } from "../../services/atividade"
import { listSchedule } from "../../services/agendamento"
import Modal from "../../components/Modal/Modal"
import { deleteSchedule } from "../../services/agendamento"
import { listGroups } from "../../services/grupo"
import AvatarPicker from "../../components/AvatarPicker/AvatarPicker"
import { Undo2 } from "lucide-react"

function ActivityPage() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [activity, setActivity] = useState<any>(null)
    const [scheduleList, setScheduleList] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null)
    const [groups, setGroups] = useState<any[]>([])
    const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
    const [scheduleSearch, setScheduleSearch] = useState('')
    const navigate = useNavigate()
    const { id } = useParams()
    const location = useLocation()

    const queryParams = new URLSearchParams(location.search)
    const groupId = queryParams.get('group_id')

    useEffect(() => {
        const fetchActivityId = async () => {
            if (id && id !== 'new') {
                try {
                    const data = await getActivity(Number(id))
                    setActivity(data[0])
                } catch {
                    setError('Error loading activity.')
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }
        fetchActivityId()
    }, [id])

    useEffect(() => {
        fetchScheduleList()
    }, [id])

    useEffect(() => {
        if (isEditing && activity) {
            setName(activity?.nomeAtiv || '')
            setDescription(activity?.descAtiv || '')
            setSelectedAvatar(activity?.imagem || '')
            setSelectedGroup(activity?.grupoId || null)
        }
    }, [isEditing])

    useEffect(() => {
        const fetchGroups = async () => {
            const data = await listGroups(1)
            if (Array.isArray(data)) setGroups(data)
        }
        fetchGroups()
    }, [])

    const fetchScheduleList = async () => {
        if (id && id !== 'new') {
            try {
                const data = await listSchedule(Number(id))
                if (Array.isArray(data)) {
                    setScheduleList(data)
                } else {
                    setScheduleList([])
                }
            } catch {
                setError('Error loading schedules.')
            }
        }
    }

    const handleCreate = async () => {
        await createActivity(name, description, 1, selectedAvatar || '', groupId ? Number(groupId) : null)
        navigate(groupId ? `/?group_id=${groupId}` : '/')
    }

    const handleDelete = async () => {
        await deleteActivity(Number(id))
        setDeleteModal(false)
        navigate('/')
    }

    const handleEdit = async () => {
        await updateActivity(name, description, Number(id), selectedAvatar || '', selectedGroup)
        setIsEditing(false)
        const data = await getActivity(Number(id))
        setActivity(data[0])
    }

    const handleDeleteSchedule = async () => {
        await deleteSchedule(Number(scheduleToDelete))
        setScheduleToDelete(null)
        fetchScheduleList()
    }

    const filteredSchedules = scheduleSearch
        ? scheduleList.filter(s => s.nomeAgen?.toLowerCase().includes(scheduleSearch.toLowerCase()))
        : scheduleList

    function renderContent() {
        if (loading) return <p className="text-center text-[#5C7E8D] mt-8">Loading...</p>
        if (error) return <p className="text-center text-red-500 mt-8">{error}</p>

        if (id === 'new') {
            return (
                <div className="flex justify-center px-16 pt-12">
                    <div className="bg-[#E1EFF4] rounded-2xl p-8 w-full max-w-[600px] flex flex-col gap-4">
                        <h1 className="text-[#5C7E8D] font-bold text-2xl text-center">Create Activity</h1>
                        <div className="flex flex-col gap-1">
                            <p className="text-[#5C7E8D] font-medium text-sm">Activity Name</p>
                            <input
                                value={name} type="text"
                                onChange={e => setName(e.target.value)}
                                className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[#5C7E8D] font-medium text-sm">Description (optional)</p>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5] h-24 resize-none"
                            />
                        </div>
                        <AvatarPicker selectedAvatar={selectedAvatar} onSelect={(url) => setSelectedAvatar(url)} />
                        <div className="flex gap-3 justify-center">
                            <button onClick={handleCreate}
                                className="bg-[#9FD7F1] text-white px-6 py-2 rounded-full">
                                Create Activity
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-[#87A7B8] text-white px-6 py-2 rounded-full"
                                >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        if (isEditing) {
            return (
                <div className="flex justify-center px-16 pt-12">
                    <div className="bg-[#E1EFF4] rounded-2xl p-8 w-full max-w-[600px] flex flex-col gap-4">
                        <h1 className="text-[#5C7E8D] font-bold text-2xl text-center">Edit Activity</h1>
                        <div className="flex flex-col gap-1">
                            <p className="text-[#5C7E8D] font-medium text-sm">Activity Name</p>
                            <input
                                value={name} type="text"
                                onChange={e => setName(e.target.value)}
                                className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[#5C7E8D] font-medium text-sm">Description (optional)</p>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5] h-24 resize-none"
                            />
                        </div>
                        <AvatarPicker selectedAvatar={selectedAvatar} onSelect={(url) => setSelectedAvatar(url)} />
                        <div className="flex flex-col gap-1">
                            <p className="text-[#5C7E8D] font-medium text-sm">Move to Group</p>
                            <select
                                value={selectedGroup ?? ''}
                                onChange={e => setSelectedGroup(Number(e.target.value) || null)}
                                className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]">
                                <option value="">No group</option>
                                {groups.map(group => (
                                    <option key={group.grupoId} value={group.grupoId}>{group.nomeGrupo}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <button onClick={handleEdit}
                                className="bg-[#9FD7F1] text-white font-bold px-6 py-2 rounded-full">
                                Confirm
                            </button>
                            <button onClick={() => setIsEditing(false)}
                                className="bg-[#87A7B8] text-white font-bold px-6 py-2 rounded-full">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="relative px-16 pt-12 min-h-screen">
                {/* Botão Return */}
                <button onClick={() => navigate('/')}
                    className="absolute top-36 flex flex-col items-center text-white gap-1 cursor-pointer z-50"
                    style={{ left: 'calc(12.5% - 50px)' }}>
                    <Undo2 size={36} color="white" />
                    <span className="text-2xl">Return</span>
                </button>
                <div className="relative mt-6 w-[85%] mx-auto"> 
                        <div className="relative mt-6 w-[85%] mx-auto">
                            {/* Card principal */}
                            <div className="bg-[#E1EFF4] rounded-2xl p-6 flex gap-6 min-h-[69vh] overflow-visible">
                                {/* Coluna esquerda */}
                                <div className="flex flex-col items-center flex-1 pt-[3.8vw] py-6 gap-4 relative">
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10">
                                        {activity.imagem
                                            ? <img src={activity.imagem} alt={activity.nomeAtiv} className="w-[3.8vw] h-[3.8vw] rounded-full" />
                                            : <div className="w-16 h-16 bg-[#87A7B8] rounded-full border-4 border-[#BCE0F3]" />
                                        }
                                    </div>
                                    {/* Topo — nome e descrição */}
                                    <div className="flex flex-col items-center gap-4 w-full">
                                        <h1 className="text-[#5C7E8D] text-5xl text-center mb-8">{activity?.nomeAtiv}</h1>
                                        <p className="text-[#758B94] text-4xl text-center">{activity?.descAtiv}</p>
                                    </div>
                                    {/* Baixo — botões Edit e Delete */}
                                    <div className="flex flex-col gap-0 w-[50%] mx-auto mt-auto mb-auto">
                                        <div className="border-t border-[#B9D9E5] pt-3 mt-2">
                                            <p className="text-[#5C7E8D] text-sm text-center mb-16">Edit Activity</p>
                                            <div className="flex justify-center mb-4">
                                                <button onClick={() => setIsEditing(true)}
                                                    className="bg-[#9FD7F1] text-white px-6 py-1 rounded-full text-sm">
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                        <div className="border-t border-[#B9D9E5] pt-3 mt-2">
                                            <p className="text-[#5C7E8D] text-sm text-center mb-16">Delete Activity</p>
                                            <div className="flex justify-center">
                                                <button onClick={() => setDeleteModal(true)}
                                                    className="bg-[#D22D39] text-white px-6 py-1 rounded-full text-sm">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Divisor vertical */}
                                <div className="w-px bg-[#B9D9E5]" />
                                {/* Coluna direita — box de schedules */}
                                <div className="flex flex-col flex-1 gap-3 bg-[#B9D9E5] rounded-xl p-4">
                                    <input
                                        type="text"
                                        placeholder="Search for schedules"
                                        value={scheduleSearch}
                                        onChange={e => setScheduleSearch(e.target.value)}
                                        className="bg-white rounded-full px-4 py-1 text-[#5C7E8D] self-center text-sm"
                                    />
                                    <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                                        {filteredSchedules.length === 0
                                            ? <p className="text-[#5C7E8D] text-sm text-center mt-4">No schedules found. Create your first schedule!</p>
                                            : filteredSchedules.map(schedule => (
                                                <ScheduleCard
                                                    key={schedule.agenId}
                                                    nomeAtiv={schedule.nomeAtiv}
                                                    nomeAgen={schedule.nomeAgen}
                                                    agendId={schedule.agenId}
                                                    descAgen={schedule.descAgen}
                                                    data_inicio={schedule.data_inicio}
                                                    data_fim={schedule.data_fim}
                                                    hora_inicio={schedule.hora_inicio}
                                                    hora_fim={schedule.hora_fim}
                                                    local={schedule.local}
                                                    frequency={schedule.frequencia}
                                                    compact={true}
                                                    onCardClick={() => navigate(`/schedule/${schedule.agenId}`)}
                                                    onDeleteClick={() => setScheduleToDelete(schedule.agenId)}
                                                />
                                            ))
                                        }
                                    </div>
                                    <button onClick={() => navigate(`/schedule/new?activity_id=${id}`)}
                                        className="bg-[#9FD7F1] text-[#5C7E8D] self-center  px-4 py-1 rounded-full w-fit">
                                        Create Schedule
                                    </button>
                                </div>
                            </div>   
                        </div>

                        <Modal
                            title="Delete Activity"
                            message="This action cannot be undone."
                            onConfirm={handleDelete}
                            onCancel={() => setDeleteModal(false)}
                            isOpen={deleteModal}
                        />
                        <Modal
                            title="Delete Schedule"
                            message="This action cannot be undone."
                            onConfirm={handleDeleteSchedule}
                            onCancel={() => setScheduleToDelete(null)}
                            isOpen={scheduleToDelete !== null}
                        />
                    
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#BCE0F3] pb-[160px]">
            <Header />
            {renderContent()}
            <BottomNav 
                groups={groups}
                selectedGroupId={null}
                onGroupClick={(id) => navigate(`/?group_id=${id}`)}
                onNewGroupClick={() => navigate('/')}
            />
        </div>
    )
}

export default ActivityPage