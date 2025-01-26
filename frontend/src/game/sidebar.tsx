import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import Peter from "@/assets/Peter_AntEater.png"
import Pioneer from "@/assets/PeterPioneer.png"
import Rouge from "@/assets/Rouge.png"
import Wizard from "@/assets/WizardAnteater.png"

interface Player{
    id: string;
    name: string;
    char: number;
    score: number;
}

interface RankBarProps{
    playerList: Player[];
    className: string;
}

interface EntryProps{
    player: Player
}

const picLis = [Peter, Pioneer, Rouge, Wizard];

const PlayerEntry: React.FC<EntryProps> = ({player}) => {
    return (
        <li className="flex h-16 rounded-xl border-2 my-2 shadow-lg bg-white">
            <img src={picLis[player.char]}/>
            <div className="flex flex-col justify-center ">
                <div className="w-40 flex justify-end mr-4 text-xl font-serif">{player.name}</div>
                <div className="w-40 flex justify-end mr-4 font-bold">{player.score}</div>
            </div>
        </li>
    );
}

export const RankBar: React.FC<RankBarProps> = ({playerList, className}) => {

    const getCps = () => {
        let compos = [];
        for(let i=0; i<playerList.length; i++){
            compos.push(<PlayerEntry player={playerList[i]}/>)
        }
        return compos;
    }

    return (
        <div className={className}>
            <ul>
                {getCps()}
            </ul>
        </div>
    );
}