import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import search_ico from '../../assets/search_ico.png';
import { URL } from "../../extras";
import { userNameContext } from "../../Contexts/ConnectedPlayerContext";

export function SearchBar(){

    const [usersList, setUsersList] = useState([]);
    const [box, showBox]= useState(false);
    const inputRef= useRef<HTMLInputElement>(null);
    const {connectedPlayerName, setConnectedPlayerName}= useContext(userNameContext);

    useEffect(()=>{

    },[usersList, box])

    function searchHandler($event : any){

        const username= $event.target.value;

        if(username.length){
            showBox(true);
        }else{
            showBox(false);
        }
        console.log(username);

        axios.post(URL+'api/v1/user/getUsers', {
            username
        }).then(
            (res:any)=>{
                console.log(res);
                setUsersList(res.data.users);
                console.log(usersList);
            }
        );
    }

    function userSelectHandler($event:any){
        const connectedUser= $event.target.innerText;

        setConnectedPlayerName(connectedUser);
        if(inputRef.current){
            inputRef.current.value= connectedUser
        }
        showBox(false)
    }

    return (
        <div className='relative w-[100%] z-0'>
            <img src={search_ico} className='absolute h-[2rem] top-[1.6rem] left-[3.3rem]'></img>
            <input type='text' className='mt-5 w-[70%] h-[2.8rem] outline-none bg-[#3C3B39] rounded-xl ml-12 pl-[2.6rem] text-[1.2rem]' onChange={searchHandler} ref={inputRef}></input>
            {box ?  <div className="left-[3.3rem] absolute bg-[#3C3B39] w-[70%] border border-[#EBECD0] h-[5rem] overflow-y-scroll" onClick={userSelectHandler}>
                {usersList?.length ? usersList.map((user:any)=>{
                    return <div className="pl-3 mt-2 pb-1 w-[100%] overflow-x-hidden overflow-y-scroll border-b-2 "> {user}</div>
                }) : <div> No Users Found! </div> }
            </div> : null}
        </div>
    )
}