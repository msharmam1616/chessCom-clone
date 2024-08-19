import './App.css'
import { RecoilRoot} from 'recoil'
import { SignUp } from './components/SignUp'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainScreen } from './components/MainScreen'
import { TimerParity } from './components/TimerParity'

function App() {

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
