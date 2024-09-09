import { useRecoilState } from "recoil";
import { ChessBoard } from "./ChessBoard";
import { GameStarter } from "./GameStarterScreen/GameStarters";
import { Header } from "./Header";
import { userAtom } from "../store/atoms";
import { useEffect } from "react";
import { whiteBoard } from "../extras";

export function MainScreen(){

    const [state,setState]= useRecoilState(userAtom);
  
    useEffect(() =>{

    console.log("mainscreen!!");
      
    state.socket.onopen= () =>{
      console.log("connected!!");
    }

    state.socket.onerror= (err) =>{
        console.log("err is ");
        console.log(err);
    }
  
    state.socket.onmessage = (message: any) =>{
      const messageObj:any = JSON.parse(message.data);
    //  if(messageObj.to == state.players.player1){
     // console.log(messageObj);
    //  console.log(state.started);
  
      if(messageObj.to == state.players.player1){
          
        if(messageObj.type != "move" && messageObj.type != "parity") {
            setState(state => ({
              ...state,
              gameState: {
                  ...state.gameState,
                  loading: true
              }
        }))}
      
        if(messageObj.type == "requestASK"){
            if(state.started) return;
             setState(state => ({
                  ...state,
                 request: {
                    ...state.request,
                    from: messageObj.from,
                    timeControl: messageObj.timeControl,
                    show: true }}))
        }else if(messageObj.type == "requestACCEPTED"){
            if(state.started) return;
            
                setState(state => ({
                 ...state,
                    gameState: {
                    ...state.gameState,
                    SentRequestAccepted: true
                },
                board: whiteBoard,
                color: "white",
                currentTurn: true,
                request: {
                    ...state.request,
                    from: messageObj.from,
                    timeControl: messageObj.timeControl
                }
            }))
        }else if(messageObj.type == "move"){
            console.log(state.board);
            // const piece= state.board[messageObj.move.from as keyof typeof whiteBoard];

            // console.log(messageObj.move);
            // console.log(messageObj);

            // console.log({piece});
    
            setState(state =>({
                ...state,
                board: messageObj.board,
                currentTurn: !state.currentTurn
            }));

            console.log("after ", state.board);
        }else if(messageObj.type == "parity"){
           // console.log("parity!!!");
            const obj= [
                messageObj.timers[1],
                messageObj.timers[0]
            ]
            setState((state) => ({
                ...state,
                ...state.gameState,
                timers: obj
            }))
        }else if(messageObj.includes("gameOver")){
            setState((state) =>({
                ...state,
                gameState: {
                    ...state.gameState,
                    loading: true,
                    playerWon: 1,
                },
                timers: state.timers.map( () =>{
                    return { minutes : 0, seconds : 0};
                })
            }))
        }
    }}

    },[]);
  

    return (
        <div className="h-[100%] w-[100%] bg-[#2C2B29] z-0 relative">
            <Header></Header>
            <ChessBoard></ChessBoard>
            <GameStarter></GameStarter>
        </div>
    )
}