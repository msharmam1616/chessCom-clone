import { useRecoilState } from "recoil"
import { userAtom } from "../../store/atoms"
import { useEffect } from "react";

export function GameFinishScreen() {

    const [state, setState]= useRecoilState(userAtom);

    useEffect(() =>{
    }, [state.gameState.playerWon])

    return (
        <div className="text-black flex flex-col items-center">
            {state.gameState.playerWon == 1 ? <div> You have won the match !!</div> : <div> You have the lost the match bro</div>}
            <button className="mt-3 p-2 bg-green-400 w-[60%] rounded-xl" onClick={()=>{
                setState(state => ({
                    ...state,
                    gameState: {
                        ...state.gameState,
                        loading: false,
                        playerWon: 0
                    }
                }))
            }}> Close </button>
        </div>
    )
}