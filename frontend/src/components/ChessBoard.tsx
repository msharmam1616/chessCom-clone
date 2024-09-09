import { useEffect } from "react"
import { pieces } from "../assets/pieces"
import { useRecoilState} from "recoil";
import { userAtom } from "../store/atoms";
import { moveCalculator }  from "./helpers/moveCalcuator";
import { Timer } from "./Timer";
import { whiteBoard } from "../extras";

export function ChessBoard(){
    const moves = new (moveCalculator as any)();

    const [state,setState]= useRecoilState(userAtom);
    const chars= ['a','b','c','d','e','f','g','h'];

    useEffect(()=>{
        console.log(state.board);
        if(state.started && !state.currentTurn){
            state.socket.send(JSON.stringify({
                from: state.players.player1,
                to: state.players.player2,
                type: "move",
                move: {
                    from: state.helpers.obj.id,
                    to: "clickedSquare"
                },
                board: state.board
            }))
        }

        for(let i=1;i<=8;i++){
            chars.forEach(char => {
                const piece = state.board[(char+i) as keyof typeof whiteBoard];
                const divRef= document.getElementById((char+i))?.getElementsByTagName('img')[0];
                document.getElementById((char+i))?.classList.remove("kingInCheck");
                if(divRef && piece != "X"){
                    divRef.src= pieces.get(piece) || "";
                    divRef.style.height= "6.0vh";
                    divRef.style.left= "0.1rem";
               }else{
                  divRef?.removeAttribute('src');
               }
            })
        }

   
        const kingSquare= moves.getKing();
        const kingSquareRef= document.getElementById(kingSquare);
        const isCheck = moves.isCheck();

        if(isCheck){
            console.log("king in check!");
            kingSquareRef?.classList.add("kingInCheck");
        }

        if(isCheck && moves.isCheckMate()){
            console.log("checkMATE!!");

            setState(state => ({
                ...state,
                gameState: {
                    ...state.gameState,
                    loading: true,
                    playerWon: 0,
                },
                timers: state.timers.map( () =>{
                    return { minutes : 0, seconds : 0};
                }) 
            }))

            state.socket.send(JSON.stringify({
                from: state.players.player1,
                to: state.players.player2,
                type: "gameOver,checkMate"
            }))
        }

       
        //to implement: get response from the other player that the current user is under check, then compute the 

    },[state.board, state.color]);


    function clickHandler($event :any){
        console.log("click count iss !");
        console.log(state.helpers.clickCount);

        if(!state.currentTurn) return;

        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                let idx= i.toString()+j.toString();
                document.getElementById(idx)?.classList.remove('selectedDiv');
            }
        }

        if(state.helpers.clickCount == 1){
            const clickedSquare= $event.target.id ? $event.target.id : $event.target.parentNode.id;
  
            let flag= 0;

            for(let i=0;i<state.helpers.validMoves.length;i++){
                if(state.helpers.validMoves[i] == clickedSquare) flag= 1;
            }

            let obj= state.helpers.obj;
    
            if(flag){   
               setState(state => ({
                    ...state,
                    board: {
                        ...state.board,
                        [obj.id as keyof typeof whiteBoard]: "X",
                        [clickedSquare as keyof typeof whiteBoard]: obj.piece[1] + obj.piece[0]
                    },
                    currentTurn: !state.currentTurn
                }));

                // if(state.started){
                //     state.socket.send(JSON.stringify({
                //         from: state.players.player1,
                //         to: state.players.player2,
                //         type: "move",
                //         move: {
                //             from: state.helpers.obj.id,
                //             to: clickedSquare
                //         },
                //         board: state.board
                //     }))
                // }
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

            const color= obj.piece[0] == 'w' ? "white":"black";
        
            if(color != state.color) return;

            const direction= obj.piece[1] == 'p' ? (obj.piece[0] == 'w' ? "plus" : "minus") : null;

           let validMoves: any= moves.computeMoves(obj.piece[1]+obj.piece[0], obj.id, direction);

           console.log("before" + validMoves);
            validMoves= validMoves.filter((move:any) =>{
                let board= {
                    ...state.board,
                   [obj.id as keyof typeof state.board]: "X",
                   [move as keyof typeof state.board]: obj.piece[1]+obj.piece[0]
                }
                console.log({move , board});
                return !moves.isCheck(board);
            })
           

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
        }
    }
  

    return <div className="w-[100%] h-80vh flex flex-col relative z-0">
        
        <Timer></Timer>
        <div className="wrapper w-[92%] h-[61vh] absolute z-10 top-[4.1rem] left-[4.5%]" onClick={clickHandler}>
            {

                state.color == "white" ? <div className="w-full h-full absolute wrapper">
                     <div className="gridDivWhite relative" id="a8"><img className="absolute" /><div className="absolute -top-1.5 left-[2px]">a</div> <div className="absolute bottom-[0] left-[1px] text-[0.8rem]">8</div></div>
            <div className="gridDivBlack relative" id="b8" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">b</div></div>
            <div className="gridDivWhite relative" id="c8" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">c</div></div>
            <div className="gridDivBlack relative" id="d8" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">d</div></div>
            <div className="gridDivWhite relative" id="e8"><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">e</div></div>
            <div className="gridDivBlack relative" id="f8" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">f</div></div>
            <div className="gridDivWhite relative" id="g8" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">g</div></div>
            <div className="gridDivBlack relative" id="h8" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">h</div></div>

            <div className="gridDivBlack relative" id="a7" ><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">7</div></div>
            <div className="gridDivWhite relative" id="b7" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="c7" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="d7" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="e7" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="f7" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="g7" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="h7" ><img className="absolute"/></div>

            <div className="gridDivWhite relative" id="a6" ><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">6</div></div>
            <div className="gridDivBlack relative" id="b6" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="c6" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="d6" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="e6" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="f6" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="g6" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="h6" ><img className="absolute"/></div>

            <div className="gridDivBlack relative" id="a5" ><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">5</div></div>
            <div className="gridDivWhite relative" id="b5"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="c5"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="d5"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="e5"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="f5"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="g5"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="h5"><img className="absolute"/></div>

            <div className="gridDivWhite relative" id="a4"><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">4</div></div>
            <div className="gridDivBlack relative" id="b4"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="c4"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="d4"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="e4"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="f4"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="g4"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="h4"><img className="absolute"/></div>

            <div className="gridDivBlack relative" id="a3"><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">3</div></div>
            <div className="gridDivWhite relative" id="b3"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="c3"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="d3"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="e3"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="f3"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="g3" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="h3"><img className="absolute"/></div>

            <div className="gridDivWhite relative" id="a2"><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">2</div></div>
            <div className="gridDivBlack relative" id="b2"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="c2"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="d2"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="e2"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="f2"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="g2"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="h2"><img className="absolute"/></div>

            <div className="gridDivBlack relative" id="a1"><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">1</div></div>
            <div className="gridDivWhite relative" id="b1"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="c1"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="d1"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="e1"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="f1"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="g1"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="h1"><img className="absolute"/></div>
                </div>
                 :

                 <div className="w-full h-full absolute wrapper">
                     <div className="gridDivBlack relative" id="a1"><img className="absolute" /><div className="absolute -top-1.5 left-[2px]">a</div> <div className="absolute bottom-[0] left-[1px] text-[0.8rem]">1</div></div>
            <div className="gridDivWhite relative" id="b1" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">b</div></div>
            <div className="gridDivBlack relative" id="c1" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">c</div></div>
            <div className="gridDivWhite relative" id="d1" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">d</div></div>
            <div className="gridDivBlack relative" id="e1"><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">e</div></div>
            <div className="gridDivWhite relative" id="f1" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">f</div></div>
            <div className="gridDivBlack relative" id="g1" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">g</div></div>
            <div className="gridDivWhite relative" id="h1" ><img className="absolute"/><div className="absolute -top-1.5 left-[2px]">h</div></div>

            <div className="gridDivWhite relative" id="a2" ><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">2</div></div>
            <div className="gridDivBlack relative" id="b2" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="c2" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="d2" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="e2" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="f2" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="g2" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="h2" ><img className="absolute"/></div>

            <div className="gridDivBlack relative" id="a3" ><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">3</div></div>
            <div className="gridDivWhite relative" id="b3" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="c3" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="d3" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="e3" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="f3" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="g3" ><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="h3" ><img className="absolute"/></div>

            <div className="gridDivWhite relative" id="a4" ><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">4</div></div>
            <div className="gridDivBlack relative" id="b4"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="c4"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="d4"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="e4"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="f4"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="g4"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="h4"><img className="absolute"/></div>

            <div className="gridDivBlack relative" id="a5"><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">5</div></div>
            <div className="gridDivWhite relative" id="b5"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="c5"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="d5"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="e5"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="f5"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="g5"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="h5"><img className="absolute"/></div>

            <div className="gridDivWhite relative" id="a6"><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">6</div></div>
            <div className="gridDivBlack relative" id="b6"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="c6"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="d6"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="e6"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="f6"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="g6" ><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="h6"><img className="absolute"/></div>

            <div className="gridDivBlack relative" id="a7"><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">7</div></div>
            <div className="gridDivWhite relative" id="b7"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="c7"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="d7"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="e7"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="f7"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="g7"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="h7"><img className="absolute"/></div>

            <div className="gridDivWhite relative" id="a8"><img className="absolute"/><div className="absolute bottom-[0] left-[1px] text-[0.8rem]">8</div></div>
            <div className="gridDivBlack relative" id="b8"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="c8"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="d8"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="e8"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="f8"><img className="absolute"/></div>
            <div className="gridDivWhite relative" id="g8"><img className="absolute"/></div>
            <div className="gridDivBlack relative" id="h8"><img className="absolute"/></div>
                 </div>
            }

            
        </div>
    </div>
}