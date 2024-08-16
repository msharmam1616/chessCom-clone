import logo from '../assets/logo.png'

export function Header(){
    return (
        <div className="h-[20%] w-full">
            <img src={logo} className='w-[30%] h-[100%]'></img>
        </div>
    )
}