import newGame from '../../assets/newGame.png';
import twoPlayerMode from '../../assets/friends.png';
import {  useContext, useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from '../../store/atoms';
import { OptionSelect } from './OptionSelect';
import { SearchBar } from './SearchBar';
import { socketContext, userNameContext } from '../../Contexts/ConnectedPlayerContext';
import { HideScreen } from '../HideScreen';

export function GameStarter(){

    const newGameRef= useRef<HTMLDivElement>(null);
    const twoPlayerModeRef= useRef<HTMLDivElement>(null);
    const [connectedPlayerName, setConnectedPlayerName]= useState("");
    const [mode, setMode]= useState(0);

    const state= useRecoilValue(userAtom);

    useEffect(()=>{
        newGameRef.current?.classList.add('starterSelect');
        setMode(1);
    },[])

    function clickHandler($event : any){

        newGameRef.current?.classList.remove('starterSelect');
        twoPlayerModeRef.current?.classList.remove('starterSelect');
        
        const id= $event.target.id ? $event.target.id : $event.target.parentElement.id;
        if(id== '1'){
            newGameRef.current?.classList.add('starterSelect');
            twoPlayerModeRef.current?.classList.remove('starterSelect');
        }else{
            twoPlayerModeRef.current?.classList.add('starterSelect');
            newGameRef.current?.classList.remove('starterSelect');
        }
    }

    return (
        <div className='text-[#DFDFDE] bg-[#21201D] h-[50dvh] mt-3 w-[90%] ml-[5%] mr-[5%] flex flex-col items-center rounded-xl'>
            <div className='flex justify-evenly items-center w-full' onClick={clickHandler}>
                    <div className='w-[50%] flex flex-col items-center' ref={newGameRef} id='1'>
                    <img src={newGame} alt="" className='w-[3rem] mt-3' />
                    <div className='text-[#DFDFDE] mb-3'>New Game</div>
                    </div>

                    <div className='w-[50%] flex flex-col items-center' ref={twoPlayerModeRef} id='2'>
                    <img src={twoPlayerMode} className='w-[3rem] mt-3'></img>
                    <div  className='text-[#DFDFDE] mb-3'>2P Mode </div>
                    </div>
            </div>

            <userNameContext.Provider value= {{connectedPlayerName, setConnectedPlayerName}}>
                {
                    state.gameState.loading? (<div className='absolute top-[0] h-[100%] w-[100dvw]'>
                        <HideScreen></HideScreen>
                    </div>):  (null)
                }
                  { mode ? (<SearchBar></SearchBar>) : null}
                 <OptionSelect></OptionSelect>
           </userNameContext.Provider>
        </div>
    )
}