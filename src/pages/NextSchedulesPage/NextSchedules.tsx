import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CalendarDays, MapPin, Search } from "lucide-react"
import Header from "../../components/Header/Header"
import { listSchedule } from "../../services/agendamento"
import { listActivities } from "../../services/atividade"

// Dados da activity necessários para identificar e ilustrar seus schedules.
type Activity = {
    ativId: number
    nomeAtiv: string
    imagem?: string | null
}

// Campos do schedule exibidos nos cartões e usados na ordenação cronológica.
type Schedule = {
    agenId: number
    activityId: number
    nomeAtiv: string
    imagemAtiv?: string | null
    nomeAgen: string
    descAgen?: string | null
    data_inicio?: string | null
    data_fim?: string | null
    hora_inicio?: string | null
    hora_fim?: string | null
    local?: string | null
    frequencia?: string | null
}

type DateRange = "all" | "today" | "week" | "month"

// Confere que uma resposta da API é um objeto antes de ler seus campos.
function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null
}

// As activities precisam ter ID e nome; a imagem é opcional.
function isActivity(value: unknown): value is Activity {
    return isRecord(value)
        && typeof value.ativId === "number"
        && typeof value.nomeAtiv === "string"
        && (value.imagem === undefined || value.imagem === null || typeof value.imagem === "string")
}

// Valida os campos que a tela usa antes de aceitar schedules vindos da API.
function isSchedule(value: unknown): value is Omit<Schedule, "activityId" | "nomeAtiv" | "imagemAtiv"> & {
    nomeAtiv?: string
} {
    return isRecord(value)
        && typeof value.agenId === "number"
        && typeof value.nomeAgen === "string"
        && [value.nomeAtiv, value.descAgen, value.data_inicio, value.data_fim,
            value.hora_inicio, value.hora_fim, value.local, value.frequencia]
            .every(field => field === undefined || field === null || typeof field === "string")
}

// Converte a data e hora de início em uma data ordenável; schedules sem data ficam sem valor.
function getScheduleDate(schedule: Schedule): Date | null {
    if (!schedule.data_inicio) return null

    const parsedDate = new Date(schedule.data_inicio)
    if (Number.isNaN(parsedDate.getTime())) return null

    // APIs costumam serializar datas sem horário como meia-noite UTC; preservamos o dia do calendário.
    const dateOnly = schedule.data_inicio.match(/^(\d{4})-(\d{2})-(\d{2})/)
    const date = dateOnly
        ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
        : new Date(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate())

    if (schedule.hora_inicio) {
        const time = schedule.hora_inicio.match(/^(\d{1,2}):(\d{2})/)
        if (time) date.setHours(Number(time[1]), Number(time[2]), 0, 0)
    }

    return date
}

// Calcula o início inclusivo e o fim exclusivo do período selecionado.
function getRangeBounds(range: Exclude<DateRange, "all">, now: Date): [Date, Date] {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const end = new Date(start)

    if (range === "today") {
        end.setDate(end.getDate() + 1)
    } else if (range === "week") {
        const daysSinceMonday = (start.getDay() + 6) % 7
        start.setDate(start.getDate() - daysSinceMonday)
        end.setTime(start.getTime())
        end.setDate(end.getDate() + 7)
    } else {
        start.setDate(1)
        end.setTime(start.getTime())
        end.setMonth(end.getMonth() + 1)
    }

    return [start, end]
}

function NextSchedules() {
    // A lista completa fica no estado; os filtros são aplicados sem refazer chamadas à API.
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [dateRange, setDateRange] = useState<DateRange>("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    // Carrega as activities da sessão e busca em paralelo os schedules de cada uma.
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const activityData: unknown = await listActivities()
                if (!Array.isArray(activityData) || !activityData.every(isActivity)) {
                    throw new Error("Invalid activities response")
                }

                const scheduleLists = await Promise.all(
                    activityData.map(async activity => {
                        const activitySchedules: unknown = await listSchedule(activity.ativId)
                        if (!Array.isArray(activitySchedules) || !activitySchedules.every(isSchedule)) {
                            throw new Error(`Invalid schedules response for activity ${activity.ativId}`)
                        }

                        // Guarda o vínculo à activity para mostrar seu nome/imagem em cada cartão.
                        return activitySchedules.map(schedule => ({
                            ...schedule,
                            activityId: activity.ativId,
                            nomeAtiv: schedule.nomeAtiv || activity.nomeAtiv,
                            imagemAtiv: activity.imagem
                        }))
                    })
                )

                // Une as listas individuais para ordenar e filtrar em um único lugar.
                setSchedules(scheduleLists.flat())
            } catch (fetchError) {
                console.error("Error loading schedules:", fetchError)
                setError("Error loading schedules.")
            } finally {
                setLoading(false)
            }
        }

        fetchSchedules()
    }, [])

    // Filtra pela busca e pelo período; próximos eventos vêm primeiro e os passados depois.
    const visibleSchedules = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLocaleLowerCase()
        const now = new Date()
        const bounds = dateRange === "all" ? null : getRangeBounds(dateRange, now)

        return schedules
            .filter(schedule => {
                const matchesSearch = !normalizedSearch
                    || schedule.nomeAgen.toLocaleLowerCase().includes(normalizedSearch)
                    || schedule.nomeAtiv.toLocaleLowerCase().includes(normalizedSearch)
                if (!matchesSearch) return false

                if (!bounds) return true
                const scheduleDate = getScheduleDate(schedule)
                return scheduleDate !== null
                    && scheduleDate >= bounds[0]
                    && scheduleDate < bounds[1]
            })
            .sort((first, second) => {
                const firstDate = getScheduleDate(first)
                const secondDate = getScheduleDate(second)
                if (firstDate === null) return secondDate === null ? 0 : 1
                if (secondDate === null) return -1

                const firstIsUpcoming = firstDate >= now
                const secondIsUpcoming = secondDate >= now
                if (firstIsUpcoming !== secondIsUpcoming) return firstIsUpcoming ? -1 : 1

                return firstIsUpcoming
                    ? firstDate.getTime() - secondDate.getTime()
                    : secondDate.getTime() - firstDate.getTime()
            })
    }, [dateRange, schedules, searchTerm])

    // Apresenta uma data legível sem alterar o valor original recebido da API.
    const formatScheduleDate = (schedule: Schedule) => {
        const date = getScheduleDate(schedule)
        if (!date) return "Date not set"

        const dateText = date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric"
        })
        const timeText = schedule.hora_inicio?.slice(0, 5)
        return timeText ? `${dateText} · ${timeText}` : dateText
    }

    const rangeOptions: { value: DateRange; label: string }[] = [
        { value: "all", label: "All" },
        { value: "today", label: "Today" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" }
    ]

    return (
        <div className="min-h-screen bg-[#BCE0F3] pb-8">
            <Header />
            <main className="px-4 py-6 sm:px-8">
                <h1 className="mb-4 text-center text-2xl font-semibold text-white">Schedules</h1>

                {/* Campo de busca por nome do schedule ou da activity associada. */}
                <label className="mx-auto mb-6 flex max-w-md items-center gap-2 rounded-full bg-[#E1EFF4] px-4 py-2 text-[#5C7E8D]">
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={event => setSearchTerm(event.target.value)}
                        placeholder="Search schedules"
                        aria-label="Search schedules"
                        className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    />
                    <Search size={18} aria-hidden="true" />
                </label>

                <section className="mx-auto max-w-[1400px] rounded-2xl bg-[#E1EFF4] px-4 py-5 sm:px-8">
                    <h2 className="mb-4 text-center text-xl font-semibold text-[#5C7E8D]">
                        Next schedules
                    </h2>

                    {/* Períodos do mockup mais a opção All para listar todos os schedules. */}
                    <div className="mb-6 flex justify-center gap-8 border-b border-white">
                        {rangeOptions.map(option => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setDateRange(option.value)}
                                aria-pressed={dateRange === option.value}
                                className={`border-b-2 px-2 pb-2 text-sm ${
                                    dateRange === option.value
                                        ? "border-[#26A5FF] font-semibold text-[#26A5FF]"
                                        : "border-transparent text-[#758B94] hover:text-[#26A5FF]"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {loading && <p className="py-8 text-center text-[#5C7E8D]">Loading schedules...</p>}
                    {error && <p className="py-8 text-center text-red-500">{error}</p>}
                    {!loading && !error && visibleSchedules.length === 0 && (
                        <p className="py-8 text-center text-[#5C7E8D]">No schedules found.</p>
                    )}

                    {/* A grade se adapta à largura da tela; cada cartão abre os detalhes do schedule. */}
                    {!loading && !error && visibleSchedules.length > 0 && (
                        <div className="grid max-h-[60vh] grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {visibleSchedules.map(schedule => (
                                <button
                                    key={schedule.agenId}
                                    type="button"
                                    onClick={() => navigate(`/schedule/${schedule.agenId}`)}
                                    className="flex min-h-28 items-center gap-3 rounded-xl bg-[#9FD7F1] p-3 text-left transition-colors hover:bg-[#8BCBE8]"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-center text-sm font-bold text-[#244B5A]">
                                            {schedule.nomeAtiv}
                                        </p>
                                        <p className="mt-2 truncate text-sm font-semibold text-white">
                                            {schedule.nomeAgen}
                                        </p>
                                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white">
                                            <span className="flex items-center gap-1">
                                                <CalendarDays size={13} aria-hidden="true" />
                                                {formatScheduleDate(schedule)}
                                            </span>
                                            {schedule.local && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={13} aria-hidden="true" />
                                                    <span className="truncate">{schedule.local}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {schedule.imagemAtiv && (
                                        <img
                                            src={schedule.imagemAtiv}
                                            alt=""
                                            aria-hidden="true"
                                            className="h-9 w-9 shrink-0 rounded-full object-cover"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default NextSchedules
