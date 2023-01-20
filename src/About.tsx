import React from 'react';
import AboutSlider from './AboutSlider';

const itemSize = 200;
function About(){

    return(
        <div style={{backgroundColor:'black', width:'100vw',height:'100vh', position:'relative', top:'0', overflow:'hidden'}}>
            <div style={{marginLeft :'50vw', transform:`translateX(calc(0px - 20vw - ${(itemSize)}px))`, position:'absolute', marginTop:'calc(100px + 5vw)'}}>
            <AboutSlider/>
            </div>
        </div>
    )
}

export default About