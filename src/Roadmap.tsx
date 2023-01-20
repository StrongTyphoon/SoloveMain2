function Roadmap(){


    function Slogun(){
        window.addEventListener('scroll', () => {  

        });

        return(
            <div>
                <div className="sloguncontainer">
                    <div className='scrolling-text'>
                        <div className="scrolling-text-content">SOLOVE SUPPORTS ALL THE LOVE IN THE WORLD. SOLOVE SUPPORTS ALL THE LOVE IN THE WORLD.</div>
                    </div>
                    <div className='scrolling-text'>
                        <div className="scrolling-text-content">SOLOVE SUPPORTS ALL THE LOVE IN THE WORLD. SOLOVE SUPPORTS ALL THE LOVE IN THE WORLD.</div>
                    </div>
                    <div className='scrolling-text'>
                        <div className="scrolling-text-content">SOLOVE SUPPORTS ALL THE LOVE IN THE WORLD. SOLOVE SUPPORTS ALL THE LOVE IN THE WORLD.</div>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div>
                <div className = 'Roadmapwall'>
                    <div className = "Scrolldown">
                        <p className='Scrolldowntext'>scroll down</p>
                        </div>
                    <div className = "Circle">
                        <Slogun></Slogun>
                    </div>
                </div>
        </div>
        
        
    )
};

export default Roadmap;