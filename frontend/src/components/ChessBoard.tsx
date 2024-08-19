import { useEffect } from "react"
import { pieces } from "../assets/pieces"
import { useRecoilState} from "recoil";
import { userAtom } from "../store/atoms";
import { moveCalculator }  from "./helpers/moveCalcuator";
import { Timer } from "./Timer";

export function ChessBoard(){
    const moves = new (moveCalculator as any)();

    const [state,setState]= useRecoilState(userAtom);

    useEffect(()=>{
        console.log(state);
        const [x, y]= moves.getKing();
        const kingCoords= x.toString()+y.toString();
        const divRef= document.getElementById(kingCoords);

        if(moves.isCheck()){
            console.log("king in check!");
            console.log(divRef);
            divRef?.classList.add("kingInCheck");
        }else{
            divRef?.classList.remove("kingInCheck");
        }

        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                let idx= i.toString()+j.toString();
                const divRef= document.getElementById(idx)?.getElementsByTagName('img')[0];
               // console.log(divRef);
               if(divRef && state.board[i][j] != 'X'){
                    divRef.src= pieces.get(state.board[i][j]) || "";
                    divRef.style.height= "6.7vh";
                    divRef.style.left= "0rem";
                    
               }else{
                  divRef?.removeAttribute('src');
               }
            }
        }
        //to implement: get response from the other player that the current user is under check, then compute the 

     //  let isCheck= check()
    },[state.board]);


    function clickHandler($event :any){
        console.log("click count iss !");
        console.log(state.helpers.clickCount);

        if(!state.currentTurn || !state.started) return;

        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                let idx= i.toString()+j.toString();
                document.getElementById(idx)?.classList.remove('selectedDiv');
            }
        }

        if(state.helpers.clickCount == 1){
            const clickedSquare= $event.target.id ? $event.target.id : $event.target.parentNode.id;
            const toX= parseInt(clickedSquare[0]);
            const toY= parseInt(clickedSquare[1]);
            let flag= 0;

            console.log(state.helpers.validMoves)

            for(let i=0;i<state.helpers.validMoves.length;i++){
                if(state.helpers.validMoves[i] == clickedSquare) flag= 1;
            }

            console.log(flag);

           

            let obj= state.helpers.obj;

            if(flag){   
                setState(state =>({
                    ...state,
                    board: state.board.map( (arr,idx) =>{
                        if(idx == parseInt(obj.id[0])){
                           return [ ...arr.slice(0, parseInt(obj.id[1])), "X", ...arr.slice(parseInt(obj.id[1])+1)];
                        }
                        if(idx == toX){
                            return [ ...arr.slice(0,toY), obj.piece.split("").reverse().join(""), ...arr.slice(toY+1)];
                        }
                        return [...arr];
                    }),
                    currentTurn: !state.currentTurn
                }));
     
                if(state.started){
                    state.socket.send(JSON.stringify({
                        from: state.players.player1,
                        to: state.players.player2,
                        type: "move",
                        move: {
                            from: state.helpers.obj.id,
                            to: clickedSquare
                        }
                    }))
                }
            }else{
                setState(state => ({
                    ...state,
                    helpers: {
                        ...state.helpers,
                        obj: {
                            piece: "",
                            id: ""
                        }
                    }
                }))
            }
            
            console.log(document.getElementById(obj.id.toString())?.classList);
            document.getElementById(obj.id.toString())?.classList.remove('selectedDiv');

            setState(state => ({
                ...state,
                helpers: {
                    ...state.helpers,
                    clickCount: 0
                }
            }));
            
        }else if($event.target.currentSrc) {
            let obj: any= {
                piece: "",
                id: ""
            }
            obj.id= $event.target.parentElement.id;
            obj.piece= $event.target.currentSrc.slice(-6).slice(0,2);
          
            
            const x= parseInt(obj.id[0]);
            const y= parseInt(obj.id[1]);

            console.log(x);
            console.log(y);
            const color= obj.piece[0] == 'w' ? "white":"black";
            const piece= obj.piece[1].toString();

            if(color != state.color) return;

           const validMoves: any= moves.computeMoves(obj.piece[1]+obj.piece[0], x, y, color);

           console.log(validMoves);

            // for(let i=0;i<validMoves.length; i++){
            //     const parentDiv= document.getElementById(validMoves[i].toString());
            //     const tag:any= parentDiv?.childNodes[0];
            //     console.log("the parent!!");
            //     console.log(tag);
            //     const validDiv= document.createElement('div');

            //     if(tag?.src){
            //         validDiv.classList.add('validMoveTaken');
            //     }else{
            //         validDiv.classList.add('validMove');
            //     }
            //     parentDiv?.appendChild(validDiv);
            //     console.log(" p div is ");
            //     console.log(parentDiv);
            // }
            document.getElementById(obj.id.toString())?.classList.add('selectedDiv');
            setState(state =>({
                ...state,
                helpers: ({
                    ...state.helpers,
                    clickCount: 1,
                    validMoves: validMoves,
                    obj: obj
                })
            }));
            console.log(obj);
        }
        console.log("exiting with");
        console.log(state.helpers.clickCount);
    }
  

    return <div className="w-[100%] h-80vh flex flex-col relative z-0">
        
        <Timer></Timer>
        <div className="wrapper w-[92%] h-[61vh] absolute z-10 top-[4.1rem] left-[4.5%]" onClick={clickHandler}>
            {

                state.color == "white" ? <div className="w-full h-full absolute wrapper">
                     <div className="gridDivWhite relative" id="00"><img className="absolute" /><div className="absolute -top-1.5 left-[2px]">a</div> <div className="absolute bottom-[0] left-[1px] text-[0.8rem]">1</div></div>
            <div className="gridDivBlack relative" id="01" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">b</div></div>
            <div className="gridDivWhite relative" id="02" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">c</div></div>
            <div className="gridDivBlack relative" id="03" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">d</div></div>
            <div className="gridDivWhite relative" id="04"><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">e</div></div>
            <div className="gridDivBlack relative" id="05" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">f</div></div>
            <div className="gridDivWhite relative" id="06" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">g</div></div>
            <div className="gridDivBlack relative" id="07" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">h</div></div>

            <div className="gridDivBlack relative" id="10" ><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">2</div></div>
            <div className="gridDivWhite relative" id="11" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="12" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="13" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="14" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="15" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="16" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="17" ><img className="absolute"/></div>

            <div className="gridDivWhite relative" id="20" ><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">3</div></div>
            <div className="gridDivBlack relative" id="21" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="22" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="23" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="24" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="25" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="26" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="27" ><img className="absolute"/></div>

            <div className="gridDivBlack relative" id="30" ><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">4</div></div>
            <div className="gridDivWhite relative" id="31"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="32"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="33"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="34"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="35"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="36"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="37"><img className="absolute"/></div>

            <div className="gridDivWhite relative" id="40"><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">5</div></div>
            <div className="gridDivBlack relative" id="41"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="42"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="43"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="44"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="45"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="46"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="47"><img className="absolute"/></div>

            <div className="gridDivBlack relative" id="50"><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">6</div></div>
            <div className="gridDivWhite relative" id="51"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="52"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="53"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="54"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="55"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="56" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="57"><img className="absolute"/></div>

            <div className="gridDivWhite relative" id="60"><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">7</div></div>
            <div className="gridDivBlack relative" id="61"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="62"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="63"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="64"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="65"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="66"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="67"><img className="absolute"/></div>

            <div className="gridDivBlack relative" id="70"><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">8</div></div>
            <div className="gridDivWhite relative" id="71"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="72"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="73"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="74"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="75"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="76"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="77"><img className="absolute"/></div>
                </div>
                 :

                 <div className="w-full h-full absolute wrapper">
                     <div className="gridDivBlack relative" id="00"><img className="absolute" /><div className="absolute -top-1.5 left-[2px]">a</div> <div className="absolute bottom-[0] left-[1px] text-[0.8rem]">8</div></div>
            <div className="gridDivWhite relative" id="01" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">b</div></div>
            <div className="gridDivBlack relative" id="02" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">c</div></div>
            <div className="gridDivWhite relative" id="03" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">d</div></div>
            <div className="gridDivBlack relative" id="04"><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">e</div></div>
            <div className="gridDivWhite relative" id="05" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">f</div></div>
            <div className="gridDivBlack relative" id="06" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">g</div></div>
            <div className="gridDivWhite relative" id="07" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">h</div></div>

            <div className="gridDivWhite relative" id="10" ><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">7</div></div>
            <div className="gridDivBlack relative" id="11" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="12" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="13" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="14" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="15" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="16" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="17" ><img className="absolute"/></div>

            <div className="gridDivBlack relative" id="20" ><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">6</div></div>
            <div className="gridDivWhite relative" id="21" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="22" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="23" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="24" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="25" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="26" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="27" ><img className="absolute"/></div>

            <div className="gridDivWhite relative" id="30" ><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">5</div></div>
            <div className="gridDivBlack relative" id="31"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="32"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="33"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="34"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="35"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="36"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="37"><img className="absolute"/></div>

            <div className="gridDivBlack relative" id="40"><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">4</div></div>
            <div className="gridDivWhite relative" id="41"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="42"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="43"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="44"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="45"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="46"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="47"><img className="absolute"/></div>

            <div className="gridDivWhite relative" id="50"><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">3</div></div>
            <div className="gridDivBlack relative" id="51"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="52"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="53"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="54"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="55"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="56" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="57"><img className="absolute"/></div>

            <div className="gridDivBlack relative" id="60"><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">2</div></div>
            <div className="gridDivWhite relative" id="61"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="62"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="63"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="64"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="65"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="66"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="67"><img className="absolute"/></div>

            <div className="gridDivWhite relative" id="70"><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">1</div></div>
            <div className="gridDivBlack relative" id="71"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="72"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="73"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="74"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="75"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="76"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="77"><img className="absolute"/></div>
                 </div>
            }

            
        </div>
    </div>
}