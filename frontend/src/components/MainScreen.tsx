import { useRecoilState } from "recoil";
import { ChessBoard } from "./ChessBoard";
import { GameStarter } from "./GameStarterScreen/GameStarters";
import { Header } from "./Header";
import { userAtom } from "../store/atoms";
import { useContext, useEffect, useState } from "react";

export function MainScreen(){

    const [state,setState]= useRecoilState(userAtom);
  
    useEffect(() =>{

      
    state.socket.onopen= () =>{
      console.log("connected!!");
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
                request: {
                    ...state.request,
                    from: messageObj.from,
                    timeControl: messageObj.timeControl
                }
            }))
        }else if(messageObj.type == "move"){
            let [Xi,Yi] = [parseInt(messageObj.move.from[0]), parseInt(messageObj.move.from[1])];
            let [Xf,Yf] = [parseInt(messageObj.move.to[0]), parseInt(messageObj.move.to[1])]

            let initialX= 8-Xi-1, finalX= 8-Xf-1, finalY= Yf;

            let piece= state.board[initialX][Yi];

            console.log(initialX+Yi);
            console.log(finalX+finalY);

            setState((state) => ({
                ...state,
                board: state.board.map((arr, idx) =>{
                    if(idx == initialX){
                        piece= arr[Yi];
                        return [...arr.slice(0,Yi), "X", ...arr.slice(Yi+1)];
                    }else if(idx == finalX) {
                        return [...arr.slice(0,finalY), piece , ...arr.slice(finalY+1)]   
                    }
                    return [...arr];
                }),
                currentTurn: !state.currentTurn
            }));
        }else if(messageObj.type == "parity"){
            const obj= [
                messageObj.timers[1],
                messageObj.timers[0]
            ]
            setState((state) => ({
                ...state,
                timers: obj
            }))
        }else if(messageObj.type == "ilost"){
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