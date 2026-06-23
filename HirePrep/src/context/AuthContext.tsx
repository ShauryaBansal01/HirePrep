import React , {createContext , useContext , useState , useEffect} from 'react';
import api from '../services/api';

interface AuthContextType {
    user : any ,
    token : string | null ,
    login: (token:string , user: any) => void ;
    logout: ()=> void ;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [user,setUser] = useState<any>(null);
    const [token , setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if(token){
            localStorage.setItem('token' , token);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }else{
            localStorage.removeItem('token');
            delete  api.defaults.headers.common['Authorization'];
        }
    },[token]);

    const login = (newToken: string , newUser: any) => {
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user,token,login,logout}}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used withing AuthProvider');
    }
    return context;
};
