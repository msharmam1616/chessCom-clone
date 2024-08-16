
import { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo.png';
import axios from 'axios';
import { URL } from '../extras';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userAtom } from '../store/atoms';


export function SignUp() {

    const [login, setLogin]= useState(1);
    const navigate= useNavigate();

    const setState= useSetRecoilState(userAtom);


    useEffect(()=>{
        if(inputRef.current){
            inputRef.current.value= "Username or Email";
        }
        if(passwordRef.current){
            passwordRef.current.value= "Password";
        }

    },[]);

    function submitHandler($event:any){

        const login= $event.target.innerText == 'Login';
        
        const link= URL+"api/v1/user/"+ (login == true ? "signIn" : "signUp");
        let data:any= {
            username: inputRef?.current?.value,
            password: passwordRef?.current?.value
        }

        axios.post(link, data)
        .then((res:any)=>{
            console.log(res);
            console.log("User Created Successfully!");

            if(!res.data.err){
            setState(state =>({
                ...state,
                players: {
                    ...state.players,
                    player1: data.username
                }    
            }))
            navigate('/');
            }
        })  
        .catch((err:any)=>{
            console.log("Error Occurred!");
        })
    }

    
    const inputRef= useRef<HTMLInputElement>(null);
    const passwordRef= useRef<HTMLInputElement>(null);

    return(
    <div className='bg-[#2C2B29] h-full w-full relative p-4'>
        <img src={logo} alt="" className='h-[5%] ml-[9%] relative top-[1rem]' />
        <div className='flex text-[#8A897B] flex-col p-4 bg-[#262421] mt-[2rem] rounded-xl'>
            <input type="text" className='w-[100%] bg-[#302E2B] h-[2.8rem] pl-4 rounded-xl outline-none focus:border border-slate-100' ref={inputRef} onClick={()=>{
                if(inputRef.current && inputRef.current.value == "Username or Email"){
                    inputRef.current.value="";
                }

                if(passwordRef.current && passwordRef.current.value == ""){
                    passwordRef.current.type="text"
                    passwordRef.current.value= "Password";
                }
            }}></input>
            <input type="text" className='w-[100%] bg-[#302E2B] h-[2.8rem] mt-4 pl-4 rounded-xl outline-none focus:border border-slate-100' ref={passwordRef} onClick={()=>{
                 if(passwordRef.current && passwordRef.current.value == "Password"){
                    passwordRef.current.value="";
                    passwordRef.current.type="password"
                }

                if(inputRef.current && inputRef.current.value == ""){
                    inputRef.current.value= "Username or Email";
                }
            }}></input>
            <div className='flex justify-between mt-4'>
                <div className='flex'> 
                <input type='checkbox' className='bg-[#262421] ml-2'></input>
                <div className='ml-2'>Remember Me</div>
                </div>
                <div className='underline underline-offset-2'> Forgot Password? </div>
            </div>
            <button className='bg-[#81B64C] p-5 rounded-xl text-white text-2xl font-[1000] mt-[2.5rem] shadow-xl focus:bg-[#779556]' onClick={submitHandler}>
                Login
            </button>

            <div className='flex items-center mt-4'>
                <div className='bg-[#302E2B] w-[45%] h-[0.2rem]'></div>
                <div className='mx-5'> OR </div>
                <div className='bg-[#302E2B] w-[45%] h-[0.2rem]'></div>
            </div>

            <button className='bg-[#81B64C] p-5 rounded-xl text-white text-2xl font-[1000] mt-[1.5rem] shadow-xl focus:bg-[#779556]' onClick={submitHandler}>
                SignUp
            </button>
        </div>
    </div>)
}