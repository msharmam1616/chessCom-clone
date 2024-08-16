import { useRecoilValue } from "recoil";
import { boardSelector, colorSelector } from "../../store/atoms";


const board= useRecoilValue(boardSelector);
const color= useRecoilValue(colorSelector);

export function checkHelper(){



}