import './App.css'
import { RecoilRoot} from 'recoil'
import { SignUp } from './components/SignUp'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainScreen } from './components/MainScreen'

function App() {

  return (
    <div className='h-full w-full'>
       <RecoilRoot>
      <BrowserRouter>
        <Routes>
         <Route path="/" element={<SignUp/>}/> 
         <Route path="/mainscreen" element={<MainScreen />}/>
         </Routes>
      </BrowserRouter>
      </RecoilRoot>
    </div>
  )
}

export default App
