import styled from "styled-components";
import Button from '@material-ui/core/Button';
import {BiChevronRightCircle} from "react-icons/bi";

interface ImageTest{
    length: number;
};

const StyledButton = styled(Button)`
background-color: white !important;
color:black !important;
`;

const Image = styled.img`
  width: ${(props:ImageTest) => props.length}vw;
  height: ${(props:ImageTest) => props.length}vw;
  border-radius: 50%;
  `;

function MainHome(){

    return(
        <div style={{backgroundColor:'black', width:'100vw',height:'100vh', position:'relative', top:'0'}}>
            <div style = {{width:'80%', position:'relative',top:'100px', left:'10%', height:'80%', border:'2px solid mediumaquamarine', borderRadius:'30px',display:'flex'}}>
                <div className="imgContainer" style={{position:'relative', width:'60%', margin:'5px 10px'}}>
                    <span style={{position:'absolute',left:'5%', top:'8%'}}><Image length={30} src={'Solove1.jpg'}></Image></span>
                    <span style= {{position:'absolute', right:'8%', top:'5%'}}><Image length={11} src={'Solove3.jpg'}></Image></span>
                    <span style= {{position:'absolute', right:'10%', bottom:'2%'}}><Image length={18} src={'Solove2.jpg'}></Image></span>
                    
                </div>
                <div className="textContainer">
                    <h1>Welcome to </h1>
                    <img src="solovewhite.png" alt="Solove" width="320px"></img>
                    <p>Solove Supports all the loves in the world.<br/>Join our world and create a new relationship</p>
                    <StyledButton type="submit" formTarget='_blank' href="https://opensea.io">Click to shop<BiChevronRightCircle/></StyledButton>
                </div>
            </div>
        </div>
    )
}
export default MainHome;