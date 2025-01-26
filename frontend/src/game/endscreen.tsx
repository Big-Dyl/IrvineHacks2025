import theimage from "../assets/Podeum.png";
import { PlayerEntry } from "./sidebar";
export function EndScreen(props:{p1:any | undefined , p2: any | undefined, p3: any | undefined}){
    return(
        <>
            <div className="relative">
                {props.p2 && <div className="absolute" style={{top: "15%", left: "3%"}}><PlayerEntry player = {props.p2}></PlayerEntry></div>}
                {props.p1 && <div className="absolute" style={{top: "3%", left: "33%"}}><PlayerEntry player = {props.p1}></PlayerEntry></div>}
                {props.p3 && <div className="absolute" style={{top: "15%", left: "62%"}}><PlayerEntry player = {props.p3}></PlayerEntry></div>}
                <img src={theimage} style={{width:"80vh" ,"height": "60vh"}}/>
            </div>
        </>
    )
}