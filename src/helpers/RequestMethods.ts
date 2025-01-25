
import axios, { AxiosError, AxiosResponse } from 'axios'
export async function deleteRowsFetch(guids: string[]): Promise<boolean> {
    try {
        const response: AxiosResponse = await axios.get('url') 
        if (response.status === 200) {
            return true
        } else {
            return false
        }
    } catch (error: any) {
        new Error('Error')
        return false
    }
} 