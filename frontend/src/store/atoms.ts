

import { atom, selector } from "recoil";
import { PROD_SOCKET_URL } from "../extras";

export const userAtom = atom({
    key: 'userAtom',
    default: {
        color: "white",
        started: false,
        board: [
        ["rb","nb","bb","qb","kb","bb","nb","rb"],
        ["pb","pb","pb","pb","pb","pb","pb","pb"],
        ["X","X","X","X","X","X","X","X"],
        ["X","X","X","X","X","X","X","X"],
        ["X","X","X","X","X","X","X","X"],
        ["X","X","X","X","X","X","X","X"],
        ["pw","pw","pw","pw","pw","pw","pw","pw"],
        ["rw","nw","bw","qw","kw","bw","nw","rw"]
      ],
      timers: [
        {
            minutes: 0,
            seconds: 0
        },
        {
            minutes: 0,
            seconds: 0
        }
      ],
      currentTurn: true,
      helpers: {
        clickCount: 0,
        validMoves: [],
        obj: {
            piece: "",
            id: ""
        }
      },
      gameState: {
        loading: false,
        requestSent: false,
        SentRequestAccepted: false,
        ReceivedRequestAccepted: false,
        playerWon: 0
      },
      players: {
        player1: "",
        player2: ""
      },
      request: {
        show: false,
        from: "",
        timeControl: {
            minutes: 0,
            seconds: 0
        }
      },
      socket: new WebSocket(PROD_SOCKET_URL)
    }
})

export const colorSelector= selector({
    key: "colorSelector",
    get: ({get}) =>{
        const user= get(userAtom);
        return user.color;
    }
})

export const boardSelector= selector({
    key: "boardSelector",
    get: ({get}) =>{
        const user= get(userAtom);
        return user.board;
    }
})