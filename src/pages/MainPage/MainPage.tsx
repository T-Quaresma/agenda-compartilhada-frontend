import Header from "../../components/Header/Header"
import Modal from "../../components/modal/modal"
import BottomNav from "../../components/BottomNav/BottomNav"
import { useState, useEffect } from "react"
import { listActivities } from "../../services/atividade"
import { listGroups, createGroup, deleteGroup, updateGroup } from "../../services/grupo"
import { Plus } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import AvatarPicker from "../../components/AvatarPicker/AvatarPicker"

function MainPage() {
    const [activities, setActivities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [groups, setGroups] = useState<any[]>([])
    const [showNewGroup, setShowNewGroup] = useState(false)
    const [newGroupName, setNewGroupName] = useState('')
    const [groupToDelete, setGroupToDelete] = useState<number | null>(null)
    const [editingGroup, setEditingGroup] = useState<{id: number, name: string} | null>(null)
    const [editGroupName, setEditGroupName] = useState('')
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const groupFromUrl = queryParams.get('group_id')
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(groupFromUrl ? Number(groupFromUrl) : null)

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await listActivities(1)
                if (Array.isArray(data)) {
                    setActivities(data) 
                } else {
                    setActivities([])
                }
                setLoading(false)
            } catch {
                setError("Error Loading Activities.")
                setLoading(false)
            }
        }
        fetchActivities()     
    }, [])

    useEffect(() => {
        const fetchGroups = async () => {
            const data = await listGroups(1)
            if (Array.isArray(data)) setGroups(data)
        }
        fetchGroups()
    }, [])
    
    const handleCreateGroup = async () => {
        const result = await createGroup(newGroupName, 1, selectedAvatar)
        setGroups(prev => [...prev, { grupoId: result.grupoId, nomeGrupo: newGroupName, imagem: selectedAvatar }])
        setNewGroupName('')
        setSelectedAvatar(null)
        setShowNewGroup(false)
    }

    const handleDeleteGroup = async () => {
        await deleteGroup(Number(groupToDelete))
        setGroups(prev => prev.filter(g => g.grupoId !== groupToDelete))
        if (selectedGroupId === groupToDelete) setSelectedGroupId(null)
        setGroupToDelete(null)
    }

    const handleEditGroup = async () => {
        await updateGroup(editingGroup!.id, editGroupName, null)
        setGroups(prev => prev.map(g => g.grupoId === editingGroup!.id ? {...g, nomeGrupo: editGroupName} : g))
        setEditingGroup(null)
    }

    // Filtra por grupo E por searchTerm
    const filteredActivities = activities
        .filter(a => selectedGroupId ? a.grupoId === selectedGroupId : true)
        .filter(a => searchTerm ? a.nomeAtiv.toLowerCase().includes(searchTerm.toLowerCase()) : true)

    return (
        <div className="min-h-screen bg-[#BCE0F3] pb-[160px]">
            <Header />
            {loading && <p className="text-center text-[#5C7E8D] mt-8">Loading...</p>}
            {error && <p className="text-center text-red-500 mt-8">{error}</p>}

            {showNewGroup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#E1EFF4] rounded-2xl p-6 w-[90%] max-w-md flex flex-col gap-4">
                        <h2 className="text-[#5C7E8D] font-bold text-xl text-center">Create New Group</h2>
                        <input 
                            value={newGroupName} 
                            onChange={e => setNewGroupName(e.target.value)} 
                            placeholder="Group name"
                            className="bg-white rounded-full px-4 py-2 text-[#5C7E8D] outline-none"
                        />
                        <AvatarPicker 
                            selectedAvatar={selectedAvatar}
                            onSelect={(url) => setSelectedAvatar(url)}
                        />
                        <div className="flex gap-2 justify-center">
                            <button 
                                onClick={handleCreateGroup}
                                className="bg-[#9FD7F1] text-white font-bold px-6 py-2 rounded-full">
                                Create
                            </button>
                            <button 
                                onClick={() => setShowNewGroup(false)}
                                className="bg-[#87A7B8] text-white font-bold px-6 py-2 rounded-full">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editingGroup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#E1EFF4] rounded-2xl p-6 w-[90%] max-w-[500px] flex flex-col gap-4 max-h-[800px] overflow-y-auto">
                        <h2 className="text-[#5C7E8D] text-xl text-center">Edit Group</h2>
                        <input 
                            value={editGroupName} 
                            onChange={e => setEditGroupName(e.target.value)}
                            className="bg-white rounded-full px-4 py-2 text-[#5C7E8D] outline-none border border-[#B9D9E5]"
                            placeholder="Group name"
                        />
                        <AvatarPicker
                            selectedAvatar={selectedAvatar} 
                            onSelect={(url) => setSelectedAvatar(url)}
                        />
                        <div className="flex gap-2 justify-center">
                            <button 
                                onClick={handleEditGroup}
                                className="bg-[#9FD7F1] text-white font-bold px-6 py-2 rounded-full">
                                Save
                            </button>
                            <button 
                                onClick={() => setEditingGroup(null)}
                                className="bg-[#87A7B8] text-white font-bold px-6 py-2 rounded-full">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!loading && (
                <div className="space-y-[40px]">
                    {/* Título e search */}
                    <div className="flex flex-col items-center gap-3 py-4">
                        <h2 className="text-[#5C7E8D] font-bold text-xl">
                            {selectedGroupId 
                                ? groups.find(g => g.grupoId === selectedGroupId)?.nomeGrupo 
                                : 'All Activities'}
                        </h2>
                        <input 
                            type="text"
                            placeholder="Search for activities"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-white rounded-full px-4 py-2 w-64 text-[#5C7E8D] outline-none"
                        />
                    </div>

                    {/* Grid de cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[12px] gap-y-[30px] px-6">
                        {/* New Activity */}
                        <div 
                            className="bg-[#E1EFF4] rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer h-[200px] relative pt-6"
                            onClick={() => navigate(`/activity/new${selectedGroupId ? `?group_id=${selectedGroupId}` : ''}`)}>
                            <Plus color="#26A5FF" size={40} />
                            <p className="text-[#5C7E8D] font-bold text-sm">New Activity</p>
                        </div>

                        {/* Cards das atividades */}
                        {filteredActivities.map(activity => (
                            <div 
                                key={activity.ativId} 
                                className="bg-[#E1EFF4] rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer h-[200px] relative pt-8"
                                onClick={() => navigate(`/activity/${activity.ativId}`)}>
                                {/* Avatar vazando para fora do card */}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                    {activity.imagem 
                                        ? <img src={activity.imagem} alt={activity.nomeAtiv} className="w-12 h-12 rounded-full" />
                                        : <div className="w-12 h-12 bg-[#87A7B8] rounded-full" />
                                    }
                                </div>
                                <p className="text-[#5C7E8D] font-bold text-sm text-center px-2">{activity.nomeAtiv}</p>
                                <p className="text-[#5C7E8D] text-xs text-center px-2 line-clamp-2">{activity.descAtiv}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Modal
                title="Delete Group"
                message="This will not delete the activities inside."
                onConfirm={handleDeleteGroup}
                onCancel={() => setGroupToDelete(null)}
                isOpen={groupToDelete !== null}
            />
            <BottomNav 
                groups={groups}
                selectedGroupId={selectedGroupId}
                onGroupClick={(id) => setSelectedGroupId(id === selectedGroupId ? null : id)}
                onNewGroupClick={() => setShowNewGroup(true)}
                onGroupEddit={(id, name) => { setEditingGroup({id: Number(id), name}); setEditGroupName(name) }}
                onGroupDelete={(id) => setGroupToDelete(Number(id))}
            />
        </div>
    )
}

export default MainPage