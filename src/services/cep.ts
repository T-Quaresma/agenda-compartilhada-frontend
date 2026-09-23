import { API_URL } from "./api"

interface CepResponse {
    rua: string
    bairro: string
    cidade: string
    estado: string
}
async function searchCep(cep: string): Promise<CepResponse> {
    const response = await fetch(
        `${API_URL}/cep?cep=${cep}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    )
    if (!response.ok) {
        throw new Error(`Error searching CEP: ${response.status}`)
    }
    return await response.json()
}

export { searchCep }