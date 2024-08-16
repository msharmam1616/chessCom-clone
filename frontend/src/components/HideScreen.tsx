import { useEffect, useRef, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { userAtom } from "../store/atoms"
import { AskRequestScreen } from "./TimerScreens/AskRequestScreen";
import { RequestSent } from "./TimerScreens/RequestSent";
import { IncomingRequest } from "./TimerScreens/IncomingRequest";
import { GameFinishScreen } from "./TimerScreens/GameFinishScreen";

export function HideScreen(){

    const [state,setState]= useRecoilState(userAtom);
    const divRef= useRef<HTMLDivElement>(null)

    useEffect(() =>{

    }, [state.gameState])

    return (
        <>
        {
            state.gameState.loading ?  <div className="absolute h-[100%] w-[100%] bg-slate-200/75 z-20" ref={divRef}>
            <div className="flex flex-col items-center justify-items-center bg-white w-[75%] ml-[3.3rem] mt-[20rem] p-4 rounded-xl opacity-100">
                    
                    {
                        state.gameState.ReceivedRequestAccepted || state.gameState.SentRequestAccepted ? <AskRequestScreen></AskRequestScreen> : <div></div>
                    }

                    {
                        state.request.show ? <IncomingRequest></IncomingRequest> : <div></div>
                    }

                    {
                        state.gameState.requestSent ? <RequestSent></RequestSent>: <div></div>
                    }

                    {
                        state.gameState.playerWon != 0 ? <GameFinishScreen></GameFinishScreen> : <div></div>
                    }
                   
            </div>
            </div> : <div></div>
        } 
        </>
    )
}