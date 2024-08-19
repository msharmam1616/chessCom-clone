import { useRecoilState } from "recoil";
import { userAtom } from "../../store/atoms";

export function IncomingRequest(){
    
    const [state, setState]= useRecoilState(userAtom);
    
    return <div>
        <div> Incoming Challenge From </div>
        <div className="mt-2"> {state.request.from }</div>
        <div className="mt-2"> Time Control </div>
        <div className="flex"> 

            <div >
            {state.request.timeControl.minutes} Minutes
            </div>
            <div className="ml-2">
            {state.request.timeControl.seconds} Seconds
            </div>
         </div>

        <div className="flex w-[75%] mt-2">
        <button className="bg-red-500/80 text-white p-2 rounded-xl" onClick={()=>{
            setState((state: any) => ({
                ...state,
                request: {
                    ...state.request,
                    show: false
                },
                gameState: {
                    ...state.gameState,
                    ReceivedRequestAccepted: true  
                }
            }))

            state.socket.send(JSON.stringify({
                from: state.players.player1,
                to: state.request.from,
                type: "requestACCEPTED",
                timeControl: state.request.timeControl 
            }))

        }} >Accept</button>
        <button className="ml-10 bg-green-500/80 p-2 rounded-xl" onClick={()=>{

        }}>Reject</button>
        </div>
    </div>
}