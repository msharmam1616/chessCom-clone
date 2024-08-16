import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { userAtom } from "../store/atoms";

export function TimerParity(){
    
    const [state, setState]= useRecoilState(userAtom);
    const [timer, setTimer] = useState(0);
    const intervalRef= useRef(0);

    return (
        <></>
    )
}