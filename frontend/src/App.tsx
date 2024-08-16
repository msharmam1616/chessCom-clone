import './App.css'
import { RecoilRoot, useRecoilState } from 'recoil'
import { SignUp } from './components/SignUp'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainScreen } from './components/MainScreen'
import { SOCKET_URL } from './extras'
import { socketContext } from './Contexts/ConnectedPlayerContext'
import { TimerParity } from './components/TimerParity'

function App() {
 
  
  const socket= new WebSocket(SOCKET_URL);

  return (
    <div className='h-full w-full'>
       <RecoilRoot>
      <BrowserRouter>
        <Routes>
         <Route path="/signUp" element={<SignUp/>}/> 
         <Route path="/" element={<MainScreen />}/>
         </Routes>
         <TimerParity></TimerParity>
      </BrowserRouter>
      </RecoilRoot>
    </div>
  )
}

export default App
