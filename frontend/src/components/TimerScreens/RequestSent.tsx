import { useSetRecoilState } from "recoil"
import { userAtom } from "../../store/atoms"

export function RequestSent(){

    const setState= useSetRecoilState(userAtom);


    return <div>
          <div> Waiting for the user to accept!, </div>
          <div> Please wait..</div> 
          <span className="loader"></span>
          <button className="bg-green-500/70 p-2 rounded-xl mt-2" onClick={()=>{
                        setState(state =>({
                            ...state,
                            loading: false
            }))
           }}> Cancel </button>
    </div>
}