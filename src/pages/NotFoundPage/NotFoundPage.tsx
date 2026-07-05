import Header from "../../components/Header/Header"
import { useNavigate } from "react-router-dom"

function NotFoundPage() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-[#BCE0F3] flex flex-col">
            <Header />
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <div className="bg-[#E1EFF4] rounded-2xl p-12 flex flex-col items-center gap-4 w-[90%] max-w-[500px]">
                    <h1 className="text-[#5C7E8D] font-bold text-8xl">404</h1>
                    <div className="w-full h-px bg-[#B9D9E5]" />
                    <h2 className="text-[#5C7E8D] font-bold text-2xl">Page not found</h2>
                    <p className="text-[#5C7E8D] text-sm text-center">
                        The page you are looking for doesn't exist or has been moved.
                    </p>
                    <button 
                        title="Return to main page" 
                        onClick={() => navigate('/')}
                        className="bg-[#9FD7F1] text-white font-bold px-8 py-2 rounded-full mt-2">
                        Go back home
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage