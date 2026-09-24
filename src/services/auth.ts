interface LoginData {
    email: string;
    senha: string;
}

interface LoginResponse {
    message: string;
}

interface ValidateResponse {
    usuId: number;
    email: string;
    type: string;
    exp: number;
}

interface RefreshResponse {
    Message: string;
}

interface LogoutResponse {
    Message: string;
}

interface RegisterData {
    name: string;
    email: string;
    senha: string;
}

interface RegisterResponse {
    Message: string;
}

export class HttpError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status
    }
}

// função de login de usuario
export async function loginUser(data: LoginData): Promise<LoginResponse> {
    try {
        const response = await fetch(
            "http://localhost:5001/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
}

export async function validateSession(): Promise<ValidateResponse> {
    try {
        return await validateUser();
    } catch (error) {
        if (!(error instanceof HttpError) || error.status !== 401) {
            throw error;
        }
        await refreshAccessToken();
        return await validateUser();
    }
}

export async function validateUser(): Promise<ValidateResponse> {
    const response = await fetch(
        "http://localhost:5001/auth/validate",
        {
            method: "POST",
            credentials: "include"
        }
    );
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json()
}

export async function refreshAccessToken(): Promise<RefreshResponse> {
    const response = await fetch(
        "http://localhost:5001/auth/refresh",
        {
            method: "POST",
            credentials: "include"
        }
    );
    if (!response.ok) {
        throw new HttpError(response.status, `HTTP error! status: ${response.status}`)
    }

    return await response.json();
}

export async function logoutUser(): Promise<LogoutResponse> {
    const response = await fetch(
        "http://localhost:5001/auth/logout",
        {
            method: "POST",
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new HttpError(
            response.status,
            `HTTP error! status: ${response.status}`
        );
    }

    return await response.json();
}

export async function registerUser(data: RegisterData): Promise<RegisterResponse> {
    try {
        const response = await fetch("http://localhost:5001/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new HttpError(
                response.status,
                `HTTP error! status: ${response.status}`
            );
        }

        return await response.json();

    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}