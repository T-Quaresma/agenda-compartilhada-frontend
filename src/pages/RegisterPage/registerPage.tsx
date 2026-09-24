import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth";

function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const result = await registerUser({
                name,
                email,
                senha
            });

            console.log(result);

            navigate("/login");

        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#BCE0F3] flex flex-col items-center">

            <div className="mt-16 mb-24">
                <h1 className="text-[#5C7E8D] text-5xl font-bold tracking-wide">
                    SHARP
                </h1>
            </div>

            <main className="w-[90%] max-w-[350px]">

                <h2 className="text-[#5C7E8D] text-xl font-bold text-center mb-4">
                    Create Account
                </h2>

                <div className="bg-[#E1EFF4] rounded-lg p-4 flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white rounded-md px-4 py-3 text-[#5C7E8D] outline-none border border-transparent focus:border-[#26A5FF]"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white rounded-md px-4 py-3 text-[#5C7E8D] outline-none border border-transparent focus:border-[#26A5FF]"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="w-full bg-white rounded-md px-4 py-3 text-[#5C7E8D] outline-none border border-transparent focus:border-[#26A5FF]"
                    />
                </div>

                <div className="flex items-center justify-end gap-3 mt-4">
                    <span className="text-[#5C7E8D] text-sm">
                        Already have an account?
                    </span>

                    <button
                        onClick={() => navigate("/login")}
                        className="text-[#5C7E8D] text-sm hover:underline cursor-pointer"
                    >
                        Sign In
                    </button>

                    <button
                        onClick={handleRegister}
                        className="bg-[#26A5FF] hover:bg-[#168DDB] text-white font-bold px-6 py-3 rounded-md cursor-pointer transition-colors"
                    >
                        Register
                    </button>
                </div>

            </main>
        </div>
    );
}

export default RegisterPage;