import './textchannel.css'

export function TextArea(){
    return(
        <div id="TextBox">
            <div id="textHistory">
                <p>hello</p>
            </div>
            <label htmlFor="textContent">Enter Text</label><br></br>
            <input type="text" id="textContent" content="textContent" placeholder="Type Something Here!"></input>
        </div>
    );
}