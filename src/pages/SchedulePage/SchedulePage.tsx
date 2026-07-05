import Header from "../../components/Header/Header"
import BottomNav from "../../components/BottomNav/BottomNav"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { createSchedule, displaySchedule, deleteSchedule, editSchedule } from "../../services/agendamento"
import ScheduleCard from "../../components/ScheduleCard/ScheduleCard"
import { listGroups } from "../../services/grupo"
import Modal from "../../components/modal/modal"
import {Undo2} from "lucide-react"


function SchedulePage() {
    const [name, setName] = useState('')
    const[description, setDescription] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [local, setLocal] = useState('')
    const [frequency, setFrequency] = useState('')
    const [schedule, setSchedule] = useState<any>(null)
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [groups, setGroups] = useState<any[]>([])

    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    

    const queryParams = new URLSearchParams(location.search)
    const activityId = queryParams.get('activity_id')

    // busca os agendamentos 
    useEffect(() => {
        const fetchSchedule = async () => {
            if(id && id !== 'new') {
                try {
                    const data =  await displaySchedule(Number(id))
                    setSchedule(data[0])
                } catch {
                    setError ('Error loading schedule.')
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }
        fetchSchedule()
    },[id])

    // passa os valores atribuidos ao useStates, eles podem ser valores vazios para não dar conflito com o backend
    useEffect(() => {
        if (isEditing && schedule) {
            setName(schedule.nomeAgen || '')
            setDescription(schedule.descAgen || '')
            setStartDate(schedule.data_inicio || '')
            setEndDate(schedule.data_fim || '')
            setStartTime(schedule.hora_inicio || '')
            setEndTime(schedule.hora_fim || '')
            setLocal(schedule.local || '')
            setFrequency(schedule.frequency || '')
        }
    }, [isEditing])

    useEffect(() => {
        const fetchGroups = async () => {
            const data = await listGroups(1)
            if (Array.isArray(data)) setGroups(data)
        }
        fetchGroups()
    }, [])

    const handleCreateSchedule = async () => {
        const formattedStartTime = startTime ? `${startTime}:00` : null
        const formattedEndTime = endTime ? `${endTime}:00` : null
        const formattedStartDate = startDate || null
        const formattedEndDate = endDate || null
        const formattedFrequency = frequency === '' ? null : frequency
        const result = await createSchedule(name, description, formattedStartDate, formattedEndDate, formattedStartTime, formattedEndTime, Number(activityId), local, formattedFrequency)
        navigate(`/schedule/${result.agenId}`)
    }

    const handleDeleteSch = async () => {
        await deleteSchedule(Number(id))
        setDeleteModal(false)
        navigate(`/activity/${schedule?.ativId}`)
    }

    const handleEditSch = async () => {
        const formattedStartTime = startTime 
            ? (startTime.length === 5 ? `${startTime}:00` : startTime)
            : null
        const formattedEndTime = endTime 
            ? (endTime.length === 5 ? `${endTime}:00` : endTime)
            : null
        // Converte data longa para formato ISO se necessário
        const formattedStartDate = startDate 
            ? new Date(startDate).toISOString().split('T')[0]
            : null
        const formattedEndDate = endDate 
            ? new Date(endDate).toISOString().split('T')[0]
            : null
        const formattedFrequency = frequency === '' ? null : frequency
        
        await editSchedule(name, description, formattedStartDate, formattedEndDate, formattedStartTime, formattedEndTime, Number(id), local, formattedFrequency)
        setIsEditing(false)
        const data = await displaySchedule(Number(id))
        setSchedule(data[0])
    }

    function renderContent() {
        if (loading) {
            return (
                <p className="text-center text-[#5C7E8D] mt-8">Loading...</p>
            )
        }
        if (error) {
            return (
                <p className="text-center text-red-500 mt-8">{error}</p>
            )
        }
         if (id === 'new')
            return(
                <div className="flex justify-center px-16 pt-12">
                    {/* main card */}  
                    <div className="bg-[#E1EFF4] rounded-2xl p-8 w-full max-w-[600px] flex flex-col gap-4">
                        <h1 className="text-[#5C7E8D] font-bold text-2xl text-center">Create Schedule</h1>
                        <div className="flex flex-col gap-1">
                            <p className="text-[#5C7E8D] font-medium text-sm">Schedule Name</p>
                            <input value={name} type="text" onChange={e => setName(e.target.value)}
                                className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[#5C7E8D] font-medium text-sm">Choose Description*</p>
                            <input value={description} type="text" onChange={e => setDescription(e.target.value)} 
                                className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5] h-24 resize-none"
                            />
                        </div>
                        {/* date/time block */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <p className="text-[#5C7E8D] font-medium text-sm">Start Date*</p>
                                <input value={startDate} type="date" onChange={e => setStartDate(e.target.value)}
                                    className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]"   
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[#5C7E8D] font-medium text-sm">End Date*</p>
                                <input value={endDate} type="date" onChange={e => setEndDate(e.target.value)}
                                    className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]"    
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[#5C7E8D] font-medium text-sm">Start Time*</p>
                                <input value={startTime} type="time" onChange={e => setStartTime(e.target.value)}
                                    className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[#5C7E8D] font-medium text-sm">End Time*</p>
                                <input value={endTime} type="time" onChange={e => setEndTime(e.target.value)}
                                    className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]"
                                />
                            </div>
                        </div>
                         {/* local/frequency block */}
                        <div className="flex flex-col gap-1">
                            <p className="text-[#5C7E8D] font-medium text-sm">Local*</p>
                            <input value={local} type="text" onChange={e => setLocal(e.target.value)}
                                className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[#5C7E8D] font-medium text-sm">Schedule Frequency</p>
                            <select value={frequency} onChange={e => setFrequency(e.target.value)}
                                className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]"
                            >
                                <option value="">Does not repeat</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div className="flex justify-center gap-3">
                            <button 
                                title="Add a new schedule to this activity" 
                                onClick={handleCreateSchedule}
                                className="bg-[#9FD7F1] text-white px-8 py-2 rounded-full"
                            >
                                Confirm
                            </button>
                            <button 
                                onClick={() => navigate(`/activity/${activityId}`)}
                                className="bg-[#FF6B6B] text-white px-8 py-2 rounded-full">
                                Cancel
                                </button>
                        </div>
                    </div>
                </div>      
        )

        if(isEditing) {
            return(
                <div className="flex justify-center px-16 pt-12 gap-4">
                    <div className="bg-[#E1EFF4] rounded-2xl p-8 w-full max-w-[600px] flex flex-col gap-4">
                        <h1 className="text-[#5C7E8D] font-bold text-2xl text-center">Edit Schedule</h1>
                        <div  className="flex flex-col gap-1">
                            <p className="text-[#5C7E8D] font-medium text-sm">Schedule Name</p>
                            <input value={name} type="text" onChange={e => setName(e.target.value)}
                                className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[#5C7E8D] font-medium text-sm">Choose Description*</p>
                            <input value={description} type="text" onChange={e => setDescription(e.target.value)} 
                                className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5] h-24 resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <p className="text-[#5C7E8D] font-medium text-sm">Start Date*</p>
                                <input value={startDate} type="date" onChange={e => setStartDate(e.target.value)}
                                    className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[#5C7E8D] font-medium text-sm">End Date*</p>
                                <input value={endDate} type="date" onChange={e => setEndDate(e.target.value)}
                                    className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[#5C7E8D] font-medium text-sm">Start Time*</p>
                                <input value={startTime} type="time" onChange={e => setStartTime(e.target.value)}
                                    className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[#5C7E8D] font-medium text-sm">End Time*</p>
                                <input value={endTime} type="time" onChange={e => setEndTime(e.target.value)}
                                    className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[#5C7E8D] font-medium text-sm">Local*</p>
                            <input value={local} type="text" onChange={e => setLocal(e.target.value)} 
                                className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[#5C7E8D] font-medium text-sm">Schedule Frequency</p>
                            <select value={frequency} onChange={e => setFrequency(e.target.value)}
                                className="bg-white rounded-lg px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]"
                            >
                                <option value="">Does not repeat</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <button title="Confirm Changes" onClick={handleEditSch}
                                className="bg-[#9FD7F1] text-white font-bold px-8 py-2 rounded-full"
                            >
                                Confirm
                            </button>
                            <button title="Cancel Changes" onClick={() => setIsEditing(false)}
                                className="bg-[#FF6B6B] text-white font-bold px-8 py-2 rounded-full"
                            >
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
                        <button 
                            title="Return to activity page"
                            onClick={() => navigate(`/activity/${schedule?.ativId}`)}
                            className="absolute top-36 flex flex-col items-center text-white gap-1 cursor-pointer z-50"
                            style={{ left: 'calc(12.5% - 50px)' }}>
                            <Undo2 size={36} color="white" />
                            <span className="text-2xl">Return</span>
                        </button>
                    {/* Card centralizado */}
                    <div className="relative mt-6 w-[85%] mx-auto">
                        <div className="min-h-[69vh] rounded-[2rem] h-full flex flex-col"> 
                            <ScheduleCard 
                                nomeAtiv={schedule?.nomeAtiv}
                                nomeAgen={schedule?.nomeAgen}
                                agendId={schedule?.agenId}
                                descAgen={schedule?.descAgen}
                                data_inicio={schedule?.data_inicio}
                                data_fim={schedule?.data_fim}
                                hora_inicio={schedule?.hora_inicio}
                                hora_fim={schedule?.hora_fim}
                                local={schedule?.local}
                                frequency={schedule?.frequencia}
                                onEditClick={() => setIsEditing(true)}
                                showDelete={true}
                                onDeleteClick={() => setDeleteModal(true)}
                            />
                        </div>
                    </div>

                    <Modal 
                        title="Delete Confirmation"
                        message="This action cannot be reversed, are you sure?"
                        onConfirm={handleDeleteSch}
                        onCancel={() => setDeleteModal(false)}
                        isOpen={deleteModal}
                    />
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


export default SchedulePage
