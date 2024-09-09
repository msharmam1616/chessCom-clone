import { useRecoilValue } from "recoil";
import { boardSelector, userAtom }  from "../../store/atoms";
import { colorSelector } from "../../store/atoms";

const chars1= {
    1 : 'a',
    2 : 'b',
    3 : 'c',
    4 : 'd',
    5 : 'e',
    6 : 'f',
    7 : 'g',
    8 : 'h',
}

const chars= {
    a : 1,
    b : 2,
    c : 3,
    d : 4,
    e : 5,
    f : 6,
    g : 7,
    h : 8,
}

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

board: any= useRecoilValue(boardSelector);
userColor= useRecoilValue(colorSelector);

state= useRecoilValue(userAtom);


safe(x: number, y: number): boolean {
    let result =  x <= 8 && x >=1 && y >=1 && y <=8
    return result;
}

getKing(): any {
    const king= this.state.color == "white" ? "kw" : "kb"; 
    
    for(const key in this.board){
        if(this.board[key] == king) return key;
    }
    
    return "";
}

isCheck(move?: any, givenBoard? : any): boolean{
    const color= this.state.color == "white" ? "b" : "w";
    const kingCoords= this.getKing();
    const board= givenBoard ? givenBoard : this.board;

    for(const key in board){
       // console.log(this.board[key]);
      //  console.log(key);
        if(board[key].substring(1) == color){
            const direction= board[key].substring(0,1) == 'p' ? (color == "w" ? "plus" : "minus") : null; 
            const validMoves= this.computeMoves(board[key], key, direction, board);
            if(validMoves.includes(kingCoords) || validMoves.includes(move)){
                console.log(validMoves + " found!!");
                return true;
            } 
        }
    }

    return false;
}

isCheckMate(): boolean {
    const kingCoords= this.getKing()
    const king= this.board[kingCoords];
    console.log(this.computeMoves(this.state.color == "w" ? "kw" : "kb", kingCoords) + " are coords");
    let validMoves= this.computeMoves(this.state.color == "w" ? "kw" : "kb", kingCoords);

    validMoves= validMoves.filter((move:any) =>{
        let board= {
            ...this.board,
           [kingCoords as keyof typeof this.board]: "X",
           [move as keyof typeof this.board]: king
        }
        return !this.isCheck(move, board);
    })
    return validMoves.length == 0;
}

fetchSquareName(x: number, y: number): any{
    return (chars1[y as keyof typeof chars1]+x);
}


computeMoves(piece1: string, id: string, direction?: any, givenBoard?: any): any{
    let validMoves= [];
    const pieceColor= piece1.substring(1);
    const piece= piece1.substring(0,1);
    const limit1= (piece == "q") ? 2 : 1;
    const limit2= (piece == "n" || piece == "k") ? 8 : 4;

    const board= givenBoard ? givenBoard : this.board;
    const oppColor= this.state.color == "white" ? "b" : "w";
    const userColor= this.state.color == "white" ? "w" : "b";

    const x= parseInt(id.substring(1));
    const y= chars[id.substring(0,1) as keyof typeof chars];

   // console.log(this.board[this.fetchSquareName(x-1,y) as keyof typeof this.board]);
    //console.log(direction+"is direction");

  //  console.log({userColor, piece1, oppColor});
    if(piece == "p"){
        if(direction == "minus") {
            if(this.safe(x-1,1) && board[this.fetchSquareName(x-1,y) as keyof typeof this.board] == 'X') validMoves.push(this.fetchSquareName(x-1,y));
            if(this.safe(x-1, y+1) && board[this.fetchSquareName(x-1,y+1) as keyof typeof this.board].substring(1) == oppColor ) validMoves.push(this.fetchSquareName(x-1,y+1) as keyof typeof this.board);
            if(this.safe(x-1, y-1) && board[this.fetchSquareName(x-1,y-1) as keyof typeof this.board].substring(1) == oppColor ) validMoves.push(this.fetchSquareName(x-1,y-1) as keyof typeof this.board);
            if(pieceColor == "b" && x == 7) validMoves.push(this.fetchSquareName(x-2,y));
        }else{
            if(this.safe(x+1, y) && board[this.fetchSquareName(x+1,y) as keyof typeof this.board].substring(0) == 'X') validMoves.push(this.fetchSquareName(x+1,y) as keyof typeof this.board);
            if(this.safe(x+1, y+1) && board[this.fetchSquareName(x+1,y+1) as keyof typeof this.board].substring(1) == oppColor ) validMoves.push(this.fetchSquareName(x+1,y+1) as keyof typeof this.board);
            //console.log({x : x+1, y : y-1, piece: piece1, id: id, sqname: this.fetchSquareName(x+1,y-1)});
            if(this.safe(x+1, y-1) && board[this.fetchSquareName(x+1,y-1) as keyof typeof this.board].substring(1) == oppColor ) validMoves.push(this.fetchSquareName(x+1,y-1) as keyof typeof this.board);
            if(pieceColor == "w" && x == 2) validMoves.push(this.fetchSquareName(x+2,y));
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
                if(board[this.fetchSquareName(i,j) as keyof typeof this.board].substring(1) != userColor || pieceColor != board[this.fetchSquareName(i,j) as keyof typeof this.board].substring(1)) {
                    validMoves.push(this.fetchSquareName(i,j));
            }

            if(piece == "k" || piece == "n") break;
            if(board[this.fetchSquareName(i,j) as keyof typeof this.board] != "X") break;
        }
    }
   }
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



