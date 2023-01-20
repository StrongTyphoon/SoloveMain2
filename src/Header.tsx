// import React, {useEffect, useState} from 'react';
// import {FaTwitter,FaDiscord,FaInstagram,FaTelegram,FaShoppingCart,FaHome} from "react-icons/fa";
import styled from "styled-components";
import { NavLink } from 'react-router-dom';    
// import {LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
// import * as anchor from "@project-serum/anchor";
// import {useAnchorWallet} from "@solana/wallet-adapter-react";
// import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";

const StyledLink = styled(NavLink)`
  margin: 30px;
  text-decoration-line: none;
`

function Header(){
    return(
      <div id="header">
        <div className="navbar">
          <div className="navbarLogo">
            <img src="logo1.svg" alt="Logo" style={{height:'30px'}}/>
          </div>
          
          <div className="navbarMenu">
            <StyledLink className={({ isActive }) => isActive ? 'active' : ''} to='/'><p>HOME</p></StyledLink>
            <StyledLink className={({ isActive }) => isActive ? 'active' : ''} to='/About'><p>ABOUT</p></StyledLink>
            <StyledLink className={({ isActive }) => isActive ? 'active' : ''} to='/Roadmap'><p>ROADMAP</p></StyledLink>
            <StyledLink className={({ isActive }) => isActive ? 'active' : ''} to='/Faq'><p>FAQ</p></StyledLink>
            <StyledLink className={({ isActive }) => isActive ? 'active' : ''} to='/Mint'><p>MINT</p></StyledLink>
          </div>
          
          {/* <Wallet>
            {wallet ?
              <WalletAmount>0 sol<ConnectButton2/></WalletAmount> :
              <ConnectButton>Connect wallet</ConnectButton>}
              {/* {wallet ?
                <WalletAmount>{(balance || 0).toLocaleString()} sol<ConnectButton2/></WalletAmount> :
                <ConnectButton>Connect wallet</ConnectButton>}  
          </Wallet>*/}

        </div>
      </div>
    )
  }
  
export default Header