import theimage from "../assets/Podeum.png";
import { PlayerEntry } from "./sidebar";
export function EndScreen(props:{p1:any | undefined , p2: any | undefined, p3: any | undefined}){
    return(
        <>
            <div style = {{"display": "flex", "transform": "translate(0px, 90px)"}}>
                {props.p2 && <PlayerEntry player = {props.p2}></PlayerEntry>}
                {props.p1 && <div style={{"transform": "translate(0px, -30px)"}}><PlayerEntry player = {props.p1}></PlayerEntry></div>}
                {props.p3 && <PlayerEntry player = {props.p3}></PlayerEntry>}
            </div>
            <img src={theimage} style={{width:"80vh" ,"height": "60vh"}}/>
        </>
    )
}