import {useEffect, useState} from "react";
import styled from "styled-components";
import confetti from "canvas-confetti";
import * as anchor from "@project-serum/anchor";
import {LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import {useAnchorWallet} from "@solana/wallet-adapter-react";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import {GatewayProvider} from '@civic/solana-gateway-react';
import Countdown from "react-countdown";
import {Snackbar, Paper, LinearProgress, Chip} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {toDate, AlertState, getAtaForMint} from './utils';
import {MintButton} from './MintButton';
import {
    CandyMachine,
    awaitTransactionSignatureConfirmation,
    getCandyMachineState,
    mintOneToken,
    mintOneToken_2,
    CANDY_MACHINE_PROGRAM,
} from "./candy-machine";
import {FaTwitter,FaDiscord,FaInstagram,FaTelegram,FaShoppingCart,FaHome} from "react-icons/fa";


const cluster = process.env.REACT_APP_SOLANA_NETWORK!.toString();
const decimals = process.env.REACT_APP_SPL_TOKEN_TO_MINT_DECIMALS ? +process.env.REACT_APP_SPL_TOKEN_TO_MINT_DECIMALS!.toString() : 9;
const splTokenName = process.env.REACT_APP_SPL_TOKEN_TO_MINT_NAME ? process.env.REACT_APP_SPL_TOKEN_TO_MINT_NAME.toString() : "TOKEN";

const WalletAmount = styled.div`
  color: black;
  width: auto;
  padding: 5px 5px 5px 16px;
  min-width: 48px;
  min-height: auto;
  border-radius: 22px;
  background-color: var(--main-text-color);
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);
  box-sizing: border-box;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  font-weight: 500;
  line-height: 1.75;
  text-transform: uppercase;
  border: 0;
  margin: 0;
  display: inline-flex;
  outline: 0;
  position: relative;
  align-items: center;
  user-select: none;
  vertical-align: middle;
  justify-content: flex-start;
  gap: 10px;
`;

const Wallet = styled.ul`
  flex: 0 0 auto;
  margin: 0;
  padding: 0;
`;

const ConnectButton = styled(WalletMultiButton)`// connect button 뒤 네모
  border-radius: 18px !important;
  background-color: #946cee;
  margin: 0 auto;
  height: 40px;
`;

const ConnectButton2 = styled(WalletMultiButton)`// 지갑 연결햇을때 배경
  border-radius: 18px !important;
  margin: 0 auto;
  height: 35px;
`;

const ConnectButton3 = styled(WalletMultiButton)`// Container안 Buton connect button 뒤 네모
    position: relative;
    border-radius: 18px !important;
    background-color: #946cee;  
    width: 60%;
    font-size: 20px;
    top: 40px;
    left:20%;
`;

const NFT = styled.div`// MAIN뒤에 네모 
  min-width: 420px;
  padding: 5px 20px 20px 20px;
  flex: 1 1 auto;
  color: white;
`;

const Des = styled(NFT)`
  text-align: left;
  padding-top: 0px;
`;

const Card = styled(Paper)`
  display: inline-block;
  background-color: var(--card-background-lighter-color) !important;
  margin: 5px;
  opacity: 0.5;
  padding: 24px;
`;

const MintButtonContainer = styled.div`
  button.MuiButton-contained:not(.MuiButton-containedPrimary).Mui-disabled {
    color: #464646;
  }

  button.MuiButton-contained:not(.MuiButton-containedPrimary):hover,
  button.MuiButton-contained:not(.MuiButton-containedPrimary):focus {
    -webkit-animation: pulse 1s;
    animation: pulse 1s;
    box-shadow: 0 0 0 2em rgba(255, 255, 255, 0);
  }

  @-webkit-keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 #ef8f6e;
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 #ef8f6e;
    }
  }
`;

const Logo = styled.div`
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    img {
    margin-top:30px;
    min-width:30vw;
    }
    background: radial-gradient(circle closest-side at 50% 35%,
    grey 7%, transparent)
    ;
`;

const Menu = styled.ul`
  list-style: none;
  display: inline-flex;
  flex: 1 0 auto;

  li {
    margin: 0 12px;

    a {
      color: var(--main-text-color);
      list-style-image: none;
      list-style-position: outside;
      list-style-type: none;
      outline: none;
      text-decoration: none;
      text-size-adjust: 100%;
      touch-action: manipulation;
      transition: color 0.3s;
      padding-bottom: 15px;

      img {
        max-height: 26px;
      }
    }

    a:hover, a:active {
      color: rgb(131, 146, 161);
      border-bottom: 4px solid var(--title-text-color);
    }

  }
`;

const SolExplorerLink = styled.a`
  color: var(--title-text-color);
  border-bottom: 1px solid var(--title-text-color);
  font-weight: bold;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: none;
  outline: none;
  text-decoration: none;
  text-size-adjust: 100%;

  :hover {
    border-bottom: 2px solid var(--title-text-color);
  }
`;


const MintContainer = styled.div`
    display: flex;  
    flex-flow: wrap;
    position: relative;
    justify-content: center;
    align-itmes: center;
    margin:20px;
`;

const ImgContainer = styled.div`
    position: relative;
    margin: 25px;

`;

const DesContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 550px
`;

const Price = styled(Chip)`
  position: absolute;
  margin: 5px;
  font-weight: bold;
  font-size: 1em !important;
`;

const Image = styled.img`
  height: 250px;
  width: auto;
  padding: 5px;
  border-radius: 7px;
  box-shadow: 5px 5px 40px 5px rgba(0,0,0,0.5);
`;


const BorderLinearProgress = styled(LinearProgress)`
  margin: 20px 0;
  height: 10px !important;
  border-radius: 30px;
  border: 2px solid white;
  box-shadow: 5px 5px 40px 5px rgba(0,0,0,0.5);
  background-color:var(--main-text-color) !important;
  
  > div.MuiLinearProgress-barColorPrimary{
    background-color:var(--title-text-color) !important;
  }

  > div.MuiLinearProgress-bar1Determinate {
    border-radius: 30px !important;
    background-image: linear-gradient(270deg, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.5));
  }
`;

const ShimmerTitle = styled.h1`
  margin: 50px auto;
  text-transform: uppercase;
  animation: glow 2s ease-in-out infinite alternate;
  color: var(--main-text-color);
  @keyframes glow {
    from {
      text-shadow: 0 0 20px var(--main-text-color);
    }
    to {
      text-shadow: 0 0 30px var(--title-text-color), 0 0 10px var(--title-text-color);
    }
  }
`;


const GoldTitle = styled.h2`
  color: var(--title-text-color);
  font-family: 'Roboto Serif', sans-serif;
`;

const LogoAligner = styled.div`
  display: flex;
  align-items: center;

  img {
    max-height: 35px;
    margin-right: 10px;
  }
`;
const ProgressBar = styled.div`
    width: 100%;
    height: 30px;
    background-color: #dedede;
    font-weight: 600;
    font-size: .8rem;
    margin-top: 20px;
`;
interface ITest{
    width: number,
} 

const Progress = styled.div`
    width: ${(props:ITest) => props.width}%; 
    height: 30px;
    padding: 0;
    text-align: center;
    background-color: blue;
    color: #111;
    `


export interface HomeProps {
    candyMachineId: anchor.web3.PublicKey;
    connection: anchor.web3.Connection;
    txTimeout: number;
    rpcHost: string;
}

const Home = (props: HomeProps) => {
    const [balance, setBalance] = useState<number>();
    const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
    const [isActive, setIsActive] = useState(false); // true when countdown completes or whitelisted
    const [solanaExplorerLink, setSolanaExplorerLink] = useState<string>("");
    const [itemsAvailable, setItemsAvailable] = useState(0);
    const [itemsRedeemed, setItemsRedeemed] = useState(0);
    const [itemsRemaining, setItemsRemaining] = useState(0);
    const [isSoldOut, setIsSoldOut] = useState(false);
    const [payWithSplToken, setPayWithSplToken] = useState(false);
    const [price, setPrice] = useState(0);
    const [priceLabel, setPriceLabel] = useState<string>("SOL");
    const [whitelistPrice, setWhitelistPrice] = useState(0);
    const [whitelistEnabled, setWhitelistEnabled] = useState(false);
    const [whitelistTokenBalance, setWhitelistTokenBalance] = useState(0);
    const [isWhitelist, setIsWhitelist] = useState(true); //whitelist에 유저가 있나?
    const [isMinted, setIsMinted] = useState(false);       //유저가 이미 mint를 했나?
    const [mintcnt, setMintcnt] = useState(1);        //몇개를 민팅할 것인가?

    const [alertState, setAlertState] = useState<AlertState>({
        open: false,
        message: "",
        severity: undefined,
    });

    const wallet = useAnchorWallet();
    const [candyMachine, setCandyMachine] = useState<CandyMachine>();

    const rpcUrl = props.rpcHost;

    const refreshCandyMachineState = () => {
        (async () => {
            if (!wallet) return;

            const cndy = await getCandyMachineState(
                wallet as anchor.Wallet,
                props.candyMachineId,
                props.connection
            );

            setCandyMachine(cndy);
            setItemsAvailable(cndy.state.itemsAvailable);
            setItemsRemaining(cndy.state.itemsRemaining);
            setItemsRedeemed(cndy.state.itemsRedeemed);

            var divider = 1;
            if (decimals) {
                divider = +('1' + new Array(decimals).join('0').slice() + '0');
            }

            // detect if using spl-token to mint
            if (cndy.state.tokenMint) {
                setPayWithSplToken(true);
                // Customize your SPL-TOKEN Label HERE
                // TODO: get spl-token metadata name
                setPriceLabel(splTokenName);
                setPrice(cndy.state.price.toNumber() / divider);
                setWhitelistPrice(cndy.state.price.toNumber() / divider);
            }else {
                setPrice(cndy.state.price.toNumber() / LAMPORTS_PER_SOL);
                setWhitelistPrice(cndy.state.price.toNumber() / LAMPORTS_PER_SOL);
            }


            // fetch whitelist token balance
            if (cndy.state.whitelistMintSettings) {
                setWhitelistEnabled(true);
                if (cndy.state.whitelistMintSettings.discountPrice !== null && cndy.state.whitelistMintSettings.discountPrice !== cndy.state.price) {
                    if (cndy.state.tokenMint) {
                        setWhitelistPrice(cndy.state.whitelistMintSettings.discountPrice?.toNumber() / divider);
                    } else {
                        setWhitelistPrice(cndy.state.whitelistMintSettings.discountPrice?.toNumber() / LAMPORTS_PER_SOL);
                    }
                }
                let balance = 0;
                try {
                    const tokenBalance =
                        await props.connection.getTokenAccountBalance(
                            (
                                await getAtaForMint(
                                    cndy.state.whitelistMintSettings.mint,
                                    wallet.publicKey,
                                )
                            )[0],
                        );

                    balance = tokenBalance?.value?.uiAmount || 0;
                } catch (e) {
                    console.error(e);
                    balance = 0;
                }
                setWhitelistTokenBalance(balance);
                setIsActive(balance > 0);
            } else {
                setWhitelistEnabled(false);
            }
        })();
    };

    const renderCounter = ({days, hours, minutes, seconds}: any) => {
        return (
            <div><Card elevation={1}><h1>{days}</h1><br/>Days</Card><Card elevation={1}><h1>{hours}</h1>
                <br/>Hours</Card><Card elevation={1}><h1>{minutes}</h1><br/>Mins</Card><Card elevation={1}>
                <h1>{seconds}</h1><br/>Secs</Card></div>
        );
    };

    // function displaySuccess(mintPublicKey: any): void {
    //     let remaining = itemsRemaining - 1;
    //     setItemsRemaining(remaining);
    //     setIsSoldOut(remaining === 0);
    //     if (whitelistTokenBalance && whitelistTokenBalance > 0) {
    //         let balance = whitelistTokenBalance - 1;
    //         setWhitelistTokenBalance(balance);
    //         setIsActive(balance > 0);
    //     }
    //     setItemsRedeemed(itemsRedeemed + 2);
    //     const solFeesEstimation = 0.012; // approx
    //     if (!payWithSplToken && balance && balance > 0) {
    //         setBalance(balance - (whitelistEnabled ? whitelistPrice : price) - solFeesEstimation);
    //     }
    //     setSolanaExplorerLink(cluster === "devnet" || cluster === "testnet"
    //         ? ("https://explorer.solana.com/address/" + mintPublicKey + "?cluster=" + cluster)
    //         : ("https://explorer.solana.com/address/" + mintPublicKey));
    //     throwConfetti();
    // };

    function displaySuccess_2(): void {
        let remaining = itemsRemaining - 1;
        setItemsRemaining(remaining);
        setIsSoldOut(remaining === 0);
        if (whitelistTokenBalance && whitelistTokenBalance > 0) {
            let balance = whitelistTokenBalance - 1;
            setWhitelistTokenBalance(balance);
            setIsActive(balance > 0);
        }
        setItemsRedeemed(itemsRedeemed + 2);
        const solFeesEstimation = 0.012; // approx
        if (!payWithSplToken && balance && balance > 0) {
            setBalance(balance - (whitelistEnabled ? whitelistPrice : price) - solFeesEstimation);
        }
        throwConfetti();
    };

    function throwConfetti(): void {
        confetti({
            particleCount: 400,
            spread: 70,
            origin: {y: 0.6},
        });
    }

    // const onMint = async () => {
    //     try {
    //         setIsMinting(true);
    //         if (wallet && candyMachine?.program && wallet.publicKey) {
    //             const mint = anchor.web3.Keypair.generate();
    //             const mintTxId = (
    //                 await mintOneToken(candyMachine, wallet.publicKey, mint)
    //             )[0];

    //             let status: any = {err: true};
    //             if (mintTxId) {
    //                 status = await awaitTransactionSignatureConfirmation(
    //                     mintTxId,
    //                     props.txTimeout,
    //                     props.connection,
    //                     'singleGossip',
    //                     true,
    //                 );
    //             }

    //             if (!status?.err) {
    //                 setAlertState({
    //                     open: true,
    //                     message: 'Congratulations! Mint succeeded!',
    //                     severity: 'success',
    //                 });

    //                 // update front-end amounts
    //                 displaySuccess(mint.publicKey);
    //             } else {
    //                 setAlertState({
    //                     open: true,
    //                     message: 'Mint failed! Please try again!',
    //                     severity: 'error',
    //                 });
    //             }
    //         }
    //     } catch (error: any) {
    //         // TODO: blech:
    //         let message = error.msg || 'Minting failed! Please try again!';
    //         if (!error.msg) {
    //             if (!error.message) {
    //                 message = 'Transaction Timeout! Please try again.';
    //             } else if (error.message.indexOf('0x138')) {
    //             } else if (error.message.indexOf('0x137')) {
    //                 message = `SOLD OUT!`;
    //             } else if (error.message.indexOf('0x135')) {
    //                 message = `Insufficient funds to mint. Please fund your wallet.`;
    //             }
    //         } else {
    //             if (error.code === 311) {
    //                 message = `SOLD OUT!`;
    //             } else if (error.code === 312) {
    //                 message = `Minting period hasn't started yet.`;
    //             }
    //         }

    //         setAlertState({
    //             open: true,
    //             message,
    //             severity: "error",
    //         });
    //     } finally {
    //         setIsMinting(false);
    //     }
    // };

    const onMint_1 = async () => {
      try {
          setIsMinting(true);
          if (wallet && candyMachine?.program && wallet.publicKey) {
              const mintTxId: any = (
                  await mintOneToken_2(candyMachine, wallet.publicKey, mintcnt)
              );

              const promiseArray = [];

              for (let index = 0; index < mintTxId.length; index++) {
                  promiseArray.push(
                      awaitTransactionSignatureConfirmation(
                          mintTxId[index],
                          props.txTimeout,
                          props.connection,
                          'singleGossip',
                          true
                          )
                      );
              }

              const allTransactionsResult = await Promise.all(promiseArray);
              let totalSuccess = 0;
              let totalFailure = 0;
              for (let index = 0; index < allTransactionsResult.length; index++) {
                  const transactionStatus = allTransactionsResult[index];
                  if (!transactionStatus?.err) {
                      totalSuccess += 1;
                  } else {
                      totalFailure += 1;
                  }
              }
              if (totalSuccess) {
                  setAlertState({
                      open: true,
                      message: `Congratulations! ${totalSuccess} mints succeeded!`,
                      severity: 'success',
                  });
                  // update front-end amounts
                  displaySuccess_2();
              }

              if (totalFailure) {
                  setAlertState({
                      open: true,
                      message: `Some mints failed! ${totalFailure} mints failed!`,
                      severity: 'error',
                  });
                  // update front-end amounts
                  displaySuccess_2();
              }

          }
      } catch (error: any) {
          // TODO: blech:
          let message = error.msg || 'Minting failed! Please try again!';
          if (!error.msg) {
              if (!error.message) {
                  message = 'Transaction Timeout! Please try again.';
              } else if (error.message.indexOf('0x138')) {
              } else if (error.message.indexOf('0x137')) {
                  message = `SOLD OUT!`;
              } else if (error.message.indexOf('0x135')) {
                  message = `Insufficient funds to mint. Please fund your wallet.`;
              }
          } else {
              if (error.code === 311) {
                  message = `SOLD OUT!`;
              } else if (error.code === 312) {
                  message = `Minting period hasn't started yet.`;
              }
          }

          setAlertState({
              open: true,
              message,
              severity: "error",
          });
      } finally {
          setIsMinting(false);
      }
  };


    useEffect(() => {
        (async () => {
            if (wallet) {
                const balance = await props.connection.getBalance(wallet.publicKey);
                setBalance(balance / LAMPORTS_PER_SOL);
            }
        })();
    }, [wallet, props.connection]);

    useEffect(refreshCandyMachineState, [
        wallet,
        props.candyMachineId,
        props.connection,
    ]);
    
    // function Header(){
    //   return(
    //     <div id="header">
    //       <nav className="navbar">
    //         <div className="navbar_logo">
    //           <a href=" 홈페이지 주소  "> <img src="logo1.svg" alt="Logo" style={{height:'35px'}}/> </a>
    //         </div>
    //         <ul className="navbar_icons">
    //           <li><a href="" target="_blank"><FaHome/></a></li>
    //           <li><a href="" target="_blank"><FaTwitter/></a></li>
    //           <li><a href="" target="_blank"><FaTelegram/></a></li>
    //           <li><a href="" target="_blank"><FaInstagram/></a></li>
    //           <li><a href="" target="_blank"><FaDiscord/></a></li>
    //           <li><a href="" target="_blank"><FaShoppingCart/></a></li>
    //         </ul>
    //         <div>
    //           <Wallet>
    //             {wallet ?
    //               <WalletAmount>{(balance || 0).toLocaleString()} sol<ConnectButton2/></WalletAmount> :
    //               <ConnectButton>Connect wallet</ConnectButton>}
    //           </Wallet>
    //         </div>
    //       </nav>
    //     </div>
    //   )
    // }
    
    function ImgTable(){
        const lis = [];
        const imgSrcArray=[[["soloveRare.png","Solove.jpg"],["soloveRare.png","Solove.jpg"]],[["soloveRare.png","Solove.jpg"],["soloveRare.png","Solove.jpg"]]];
        for (let index = 0; index < imgSrcArray.length; index++) {
          let t = imgSrcArray[index];
          lis.push(
          <tr>
            <td>
              <div className="parentDiv">
                <div style= {{position:'absolute', bottom:'0'}}><Image className="tableHoverImage" src={t[0][0]}/></div>
                  <Image className="tableImage" src={t[0][1]} alt="NFT To Mint"/>
              </div>
            </td>
            <td>
              <div className="parentDiv">
                <div style= {{position:'absolute', bottom:'0'}}><Image className="tableHoverImage" src={t[1][0]}/></div>
                  <Image className="tableImage" src={t[1][1]} alt="NFT To Mint"/>
              </div>
            </td>
          </tr>)
        };

      return(
          <div>
            <table> 
              {lis[0]}
              {lis[1]}
            </table>
          </div>
      )
    }

    
    const Counter = () => {
        const mintcntList = [1, 2, 3, 4, 5];
        
        const handleSelect = (e:any) => {
        setMintcnt(e.target.value);
      };
          return (
          <div className = "btn_info">
            <div className="SoloveMintinfo1"> 
              <span className="num"> 0.5 </span> 
              <span className="unit"> Sol </span>
              <span>
                <select className="select" onChange={handleSelect} value={mintcnt}> 
                  {mintcntList.map((item) => (
                  <option value={item} key={item}> {item}</option>))}
                  </select>
              </span>
            </div>
            <div className="bar"></div>
            <div className="SoloveMintinfo2">
              <span className="label">TOTAL : </span> 
              <span className="num"> {+mintcnt*0.5}</span>
              <span className="unit">Sol</span>
            </div>
          </div>
        );
      };

    return (
        <main>
          <div className="bigWrap" >
            <MintContainer>
              {/* <Header></Header> */}
              <ImgContainer>
                <ImgTable/>
                {/* {wallet && isActive && whitelistEnabled && (whitelistTokenBalance > 0) &&
                <h3>You have {whitelistTokenBalance} whitelist mint(s) remaining.</h3>} */}
              </ImgContainer>

              <DesContainer> 
                <Logo><a href="http://localhost:3000/"  rel="noopener noreferrer"><img alt="" src="logo-16.svg"/></a></Logo>
                <NFT>
                  <Counter/>
                    <MintButtonContainer>
                      {!isActive && candyMachine?.state.goLiveDate ? (
                          <Countdown
                              date={toDate(candyMachine?.state.goLiveDate)}
                              onMount={({completed}) => completed && setIsActive(true)}
                              onComplete={() => {
                                  setIsActive(true);
                              }}
                              renderer={renderCounter}
                          />) : (
                          !wallet ? (
                                  <ConnectButton3>Connect Wallet</ConnectButton3>
                              ) :
                              candyMachine?.state.gatekeeper &&
                              wallet.publicKey &&
                              wallet.signTransaction ? (
                                  <GatewayProvider
                                      wallet={{
                                          publicKey:
                                              wallet.publicKey ||
                                              new PublicKey(CANDY_MACHINE_PROGRAM),
                                          //@ts-ignore
                                          signTransaction: wallet.signTransaction,
                                      }}
                                      // // Replace with following when added
                                      // gatekeeperNetwork={candyMachine.state.gatekeeper_network}
                                      gatekeeperNetwork={
                                          candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                                      } // This is the ignite (captcha) network
                                      /// Don't need this for mainnet
                                      clusterUrl={rpcUrl}
                                      options={{autoShowModal: false}}
                                  >
                                      <MintButton
                                          candyMachine={candyMachine}
                                          isMinting={isMinting}
                                          isActive={isActive}
                                          isSoldOut={isSoldOut}
                                          onMint={onMint_1}
                                          isWhitelist={isWhitelist}
                                          isMinted={isMinted}
                                      />
                                  </GatewayProvider>
                              ) : (
                                  <MintButton
                                      candyMachine={candyMachine}
                                      isMinting={isMinting}
                                      isActive={isActive}
                                      isSoldOut={isSoldOut}
                                      onMint={onMint_1}
                                      isWhitelist={isWhitelist}
                                      isMinted={isMinted}
                                  />
                              ))}
                    </MintButtonContainer>
                      
                      {wallet && isActive &&
                          /* <p>Total Minted : {100 - (itemsRemaining * 100 / itemsAvailable)}%</p>}*/
                        <div>
                          {/* <h3 className="total_minted">TOTAL MINTED : {itemsRedeemed} / {itemsAvailable}</h3> */}
                          <ProgressBar>
                            <Progress width = {100-(itemsRemaining*100/itemsAvailable)}/>
                          </ProgressBar>
                          <h3 style={{fontWeight:'normal'}}>Minting Progress : {100-(itemsRemaining*100/itemsAvailable)}%</h3>
                        </div>

                        }

                      {/* {wallet && isActive && solanaExplorerLink &&
                        <SolExplorerLink href={solanaExplorerLink} target="_blank">View on Solana
                          Explorer</SolExplorerLink>} */}
                </NFT>
            </DesContainer>
            </MintContainer>
            <Snackbar
                open={alertState.open}
                autoHideDuration={6000}
                onClose={() => setAlertState({...alertState, open: false})}
            >
                <Alert
                    onClose={() => setAlertState({...alertState, open: false})}
                    severity={alertState.severity}
                >
                    {alertState.message}
                </Alert>
            </Snackbar>
            </div>
        </main>
    );
};

export default Home;
