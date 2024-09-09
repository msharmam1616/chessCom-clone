import { useRecoilState } from "recoil"
import { pieces } from "../assets/pieces"
import { userAtom } from "../store/atoms"
import { useEffect, useRef } from "react";
import { TimerController } from "./TimerController";

export function Timer({} : any){

    const [state, setState]= useRecoilState(userAtom);
    const intervalRef= useRef(0);

    const player1Ref= useRef<HTMLDivElement>(null);
    const player2Ref= useRef<HTMLDivElement>(null);
    
    useEffect(()=>{
    //    console.log("reloading!!");

        if(intervalRef.current){
            clearInterval(intervalRef.current);
        }

        player1Ref.current?.classList.remove('turn');
        player1Ref.current?.classList.remove('noTurn');
        player2Ref.current?.classList.remove('turn');
        player2Ref.current?.classList.remove('noTurn');

        if(state.currentTurn){
            player1Ref.current?.classList.add('turn');
            player2Ref.current?.classList.add('noTurn');
        }else{
            player2Ref.current?.classList.add('turn');
            player1Ref.current?.classList.add('noTurn');
        }
        if(!state.currentTurn) return;

    
        if(state.started){
        
            intervalRef.current= setInterval(()=>{
                 setState(state=>{

                     let curMinutes= state.timers[0].minutes;
                     let curSeconds= state.timers[0].seconds;

                    if(!curSeconds){
                        curMinutes-=1;
                         curSeconds= 60;
                     }else{
                        curSeconds-=1;
                     }

                    
                     const newTimers=  state.timers.map((timer,idx) =>{
                        if(idx == 0){
                             return {minutes: curMinutes, seconds: curSeconds}
                        }else{
                             return timer;
                    }})

                   // console.log("sending!!!!!asdfasfdsadfsadfasdfasfdafdfasdfdsafsadfsadfsf");
                  //  console.log(newTimers)
                     
                    state.socket.send(JSON.stringify({
                        type: "parity",
                        from: state.players.player1,
                        to: state.players.player2,
                        timers: newTimers
                    }))

                    return {
                     ...state,
                     timers: newTimers}
            })
            if(!state.timers[0].minutes && !state.timers[0].seconds) {
                state.socket.send(JSON.stringify({
                    type: "gameOver,onTime",
                    from: state.players.player1,
                    to: state.players.player2
                }));
    
                setState((state) => ({
                    ...state,
                    started: false,
                    timers: state.timers.map(()=>{
                        return {
                            minutes: 0,
                            seconds: 0
                        }
                    }),
                    gameState: {
                        ...state.gameState,
                        loading: true,
                        playerWon: 2
                    }
                }))
    
                return;
         }
        
        },1000);

    }else{
            player1Ref.current?.classList.add('turn');
            player2Ref.current?.classList.add('turn');
        }

        return () => {
            clearInterval(intervalRef.current);
        };

    },[state.currentTurn, state.started, state.players, state.timers]);

    return (
        <div className="h-[80vh] w-full relative z-15 flex flex-col justify-between">
        <div className="flex w-full h-[7vh] text-white items-center justify-between ">
            <div className="flex items-center">
                      <img src={pieces.get("pw")} alt="" className="w-[2rem] h-[70%]"/>
                     <div className="text-[1rem] ml-1">{state.players.player2} (1800) </div>
             </div>
             <div ref={player2Ref} className="mr-2 rounded-xl">
             <TimerController player={1}></TimerController>
             </div>
        </div>

        <div className="flex w-full h-[7vh] text-white items-center justify-between">
            <div className="flex items-end w-full">
                      <img src={pieces.get("pw")} alt="" className="w-[2rem] h-[70%]"/>
                     <div className="text-[1rem] ml-1">{state.players.player1} (1800) </div>
             </div>
             <div ref={player1Ref} className="mr-2 rounded-xl">
             <TimerController player={0} ></TimerController>
             </div>
        </div>
        </div>
    )
}