import { useRecoilValue } from "recoil";
import { boardSelector, userAtom }  from "../../store/atoms";
import { colorSelector } from "../../store/atoms";


const moves= new Map();
moves.set("b", [{
    X: [1,1,-1,-1],
    Y: [1,-1,1,-1],
}]);
moves.set("r", [{
    X: [0,0,1,-1],
    Y: [1,-1,0,0],
}]);
moves.set("n",[{
    X: [2,1,2,1,-2,-1,-2,-1],
    Y: [1,2,-1,-2,1,2,-1,-2]
}]);
moves.set("k",[{
    X: [1,-1,0,0,1,1,-1,-1],
    Y: [0,0,1,-1,-1,1,-1,1]
}]),
moves.set("q", [{
    X: [1,1,-1,-1],
    Y: [1,-1,1,-1]
},{
    X: [0,0,1,-1],
    Y: [1,-1,0,0],
}]);

export class moveCalculator {

    constructor(){
        
    }

board= useRecoilValue(boardSelector);
userColor= useRecoilValue(colorSelector);

state= useRecoilValue(userAtom);


safe(x: number, y: number): boolean {
    return x < 8 && x >=0 && y < 8 && y >=0;
}

getKing(): any {
    const king= this.state.color == "white" ? "kw" : "kb"; 
    for(let i:number=0;i<8;i++){
        for(let j:number=0;j<8;j++){
            if(this.state.board[i][j] == king){
                return [i,j];
            }
        }
    }
}

isCheck(): boolean{
    const color= this.state.color == "white" ? "b" : "w";
    const [kx, ky]= this.getKing();

    console.log({kx, ky});
    
    for(let i= 0;i<8;i++){
        for(let j=0;j<8;j++){
            const curPiece= this.state.board[i][j];
            if(curPiece.substring(1) == color){
                console.log({curPiece, i, j});
                let validMoves= this.computeMoves(curPiece, i, j);
                console.log(validMoves);
                if(validMoves.includes(kx.toString()+ky.toString())) return true;
            }
        }
    }

    return false;
}

isCheckMate() {
    const [xCord, yCord]= this.getKing()
    if(this.computeMoves("k", xCord, yCord).length == 0) return true;
}


computeMoves(piece1: string, x: number, y: number): any{
    let validMoves= [];
    const pieceColor= piece1.substring(1);
    const piece= piece1.substring(0,1);
    const limit1= (piece == "q") ? 2 : 1;
    const limit2= (piece == "n" || piece == "k") ? 8 : 4;

    const oppColor= this.state.color == "white" ? "b" : "w";
    const userColor= this.state.color == "white" ? "w" : "b";

    if(piece == "p"){
        if(userColor ==  pieceColor) {
            if(this.safe(x-1, y) && this.board[x-1][y].substring(0) == 'X') validMoves.push((x-1).toString()+(y).toString());
            if(this.safe(x-1, y+1) && this.board[x-1][y+1].substring(1) == oppColor ) validMoves.push((x-1).toString()+(y+1).toString());
            if(this.safe(x-1, y-1) && this.board[x-1][y-1].substring(1) == oppColor ) validMoves.push((x-1).toString()+(y-1).toString());
        }else{
            if(this.safe(x+1, y) && this.board[x+1][y].substring(0) == 'X') validMoves.push((x+1).toString()+(y).toString());
            if(this.safe(x+1, y+1) && this.board[x+1][y+1].substring(1) == userColor ) validMoves.push((x+1).toString()+(y+1).toString());
            if(this.safe(x+1, y-1) && this.board[x+1][y-1].substring(1) == userColor ) validMoves.push((x+1).toString()+(y-1).toString());
        }
        return validMoves;
    }


    for(let itr1= 0;itr1<limit1;itr1++){
        const X= moves.get(piece)[itr1].X;
        const Y= moves.get(piece)[itr1].Y;

        for(let itr2= 0;itr2<limit2;itr2++){
            let curX=x+X[itr2];
            let curY=y+Y[itr2]; 
            for(let i=curX, j= curY; this.safe(i,j) ;X[itr2] == 1 ? i++ : X[itr2] == -1 ? i--: i, Y[itr2] == 1 ? j++ : Y[itr2] == -1 ? j--: j){
                if(this.board[i][j].substring(1) != userColor || pieceColor != this.board[i][j].substring(1)) {
                    validMoves.push(i.toString()+ j.toString());
            }

            if(piece == "k" || piece == "n") break;
            if(this.board[i][j] != "X") break;
        }
    }
   }

   console.log(validMoves);

    return validMoves;
   }

//    check(){
//     let toSearch= "k"+userColor[0];

//     let color=userColor[0];
//     let x= 0,y= 0;
//     let validMoves: any[]= [];
    
//     for(let i=0;i<8;i++){
//         for(let j=0;j<8;j++){
//             if(this.board[i][j] == toSearch){
//                 x= i;
//                 y= j;
//             }
//         }
//     }

//     validMoves= computeMoves("k",x, y, color);

//     if(!validMoves.length) alert("checkmate!"); 
// }
}



