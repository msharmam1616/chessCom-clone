import { useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms";
import { useEffect } from "react";


export function TimerController({player}: any){

    const state= useRecoilValue(userAtom);

    useEffect(()=>{
    },[state.timers]);

    return (
        <div className="text-[1.3rem] text-black text-[1.3rem] p-2"> {state.timers[player].minutes}:{state.timers[player].seconds < 10 ? '0'+state.timers[player].seconds : state.timers[player].seconds }</div>
    )

}