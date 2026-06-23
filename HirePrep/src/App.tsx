import './App.css'
import Homepage from './pages/Homepage'
import DashboardPage from './pages/DashboardPage';
import { AuthProvider } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import {Routes , Route} from 'react-router-dom';

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path = '/' element = {<Homepage/>} />
          <Route path = '/dashboard' element = {<DashboardPage/>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App
