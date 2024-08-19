import { useContext, useEffect, useRef, useState } from "react"
import { useRecoilState } from "recoil";
import { userAtom } from "../../store/atoms";
import { userNameContext, socketContext } from "../../Contexts/ConnectedPlayerContext";

export function OptionSelect(){

    const [selectedValue, setSelectedValue]= useState({
        minutes: 1,
        seconds: 0
    });
    const [state,setState]= useRecoilState(userAtom);
    const buttonRef= useRef<HTMLButtonElement>(null);

    const {connectedPlayerName, }= useContext(userNameContext);

    useEffect(()=>{
        if(state.started){
            buttonRef.current?.classList.add('disabled');
        }

    },[state.started])


    function handleSelectChange($event:any){
        console.log($event);
        const timers= {
            minutes: 0,
            seconds: 0
        }

        const value= $event.target.value;

        switch(value){
            case "1 Mins":
                timers.minutes= 1
                break;
            
            case "3 Mins":
                timers.minutes= 3
                break;

            case "5 Mins":
                timers.minutes= 5;
                break;
            
            case "10 Mins":
                timers.minutes= 10;
                break;
            
            case "30 Mins":
                timers.minutes= 30;
                break;
            
            default:
                timers.minutes= 50;
                break;
        }

        setSelectedValue(timers);
    }
    return(
        <div className="w-full flex flex-col items-center">
        <select onChange={handleSelectChange} className='overflow-y-scroll mt-5 bg-[#3C3B39] p-4 w-[70%] text-sm  outline-none' >
            <option className='options'>
                    1 Mins
                </option>
             <option className='options'> 
                    3 Mins
                </option >
             <option className='options'>
                    5 Mins
                 </option>
             <option className='options'>
                    10 Mins
                </option>
             <option className='options'>
                    30 Mins
                </option>
        </select>

    <button className='mt-8 p-3 bg-[#81B64C] font-bold text-[1.8rem] rounded-xl w-[50%] text-white' onClick={()=>{
        if(state.started){
            return;
        }

        console.log("inside!");

        state.socket.send(JSON.stringify({
            from: state.players.player1,
            to: connectedPlayerName,
            type: "requestASK",
            timeControl: selectedValue,
        }));

        setState((state: any) => ({
            ...state,
            requestSent: true,
            loading: true
        }))


        // setState((state:any) => ({
        // ...state,
        // timers: state.timers.map(() =>{
        //     return {
        //         minutes: selectedValue.minutes-1,
        //         seconds: 59
        //     }
        // }),
        // started: true,
        // players: {
        //     ...state.players,
        //     player2: connectedPlayerName
        // }
        // }));
    }} ref={buttonRef}> Play !</button>
    </div>
    )
}