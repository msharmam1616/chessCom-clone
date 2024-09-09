import { useEffect, useRef, useState } from "react"
import { useRecoilState } from "recoil";
import { userAtom } from "../../store/atoms";

export function AskRequestScreen(){

    const [time, setTime]= useState(3);
    const intervalRef= useRef(0);
    const [state,setState]= useRecoilState(userAtom);

    
    useEffect(()=>{

        if(intervalRef.current){
            clearInterval(intervalRef.current);
        }

        if(!time) {
            console.log(state);
            const accept = state.gameState.ReceivedRequestAccepted;
            console.log(accept);
            setState(state => ({
                ...state, 
                started: true,
                players: {
                    ...state.players,
                    player2: state.request.from
                },
                timers: state.timers.map(()=>{
                    return state.request.timeControl
                }),
                gameState: {
                    ...state.gameState,
                    loading: false
                }
            }))
            console.log(state);
        } else{
            intervalRef.current= setInterval(() =>{
                setTime(time-1);
            },1000);
        }

        return () => {
            clearInterval(intervalRef.current);
        }
    },[time])

    return (
    <div className="text-black flex flex-col items-center">
            { state.gameState.SentRequestAccepted ? <div> Player {state.request.from} has accepted the challenge! </div> : <div> Challenge Accepted! </div>}           
            <div> Game Starting in </div>
            <div> {time} </div>
    </div>

    )
}