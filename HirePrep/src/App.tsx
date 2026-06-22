import './App.css'
import Homepage from './pages/Homepage'
import DashboardPage from './pages/DashboardPage';
import {Routes , Route} from 'react-router-dom';

function App() {
  return (
    <div>
      <Routes>
        <Route path = '/' element = {<Homepage/>} />
        <Route path = '/dashboard' element = {<DashboardPage/>} />
      </Routes>
    </div>
  )
}

export default App
