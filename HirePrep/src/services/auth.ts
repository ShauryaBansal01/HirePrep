import api from './api'

export const register = async (name: string , email: string , password: string) =>{
    const response = await api.post('/auth/register' , {name , email , password});
    return response.data ;
}

export const login = async (email: string , passowrd: string) => {
    const response = await api.post('/auth/login' , {email,passowrd});
    return response.data ;
}