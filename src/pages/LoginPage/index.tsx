import { useState } from "react";
import { loginUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const navigate = useNavigate();

    const handleLogIn = async () => {
        try {
            const result = await loginUser({
                email,
                senha
            });

            console.log(result);
            
            navigate("/");
           
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div>
            <header />
            <div>
                <h1>Login</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <div>
                    <button>
                        Create Account
                    </button>
                    <button onClick={handleLogIn}>
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;