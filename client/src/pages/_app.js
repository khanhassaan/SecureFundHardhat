import "../styles/globals.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React,{useState} from 'react';
import Web3 from 'web3';
import NavBar from "../components/Navbar";

export default function App({ Component, pageProps }) {
  // const [address,setAddress] = useState('');
  // const [balance,setBalance] = useState('');

  // const connectToWallet= async()=>{
  //   const accountAdd=await window.ethereum.request({method : "eth_requestAccounts"});

  //   var Eth=require('web3-eth');
  //   var eth = new Eth(Eth.givenProvider);
  //   const balance=Web3.utils.fromWei(await eth.getBalance(accountAdd[0]));

  //   setAddress(accountAdd[0]);
  //   setBalance(balance);
    
 


  return(
    
  <>
   <ChakraProvider>
        
          <NavBar />
          
          <Component {...pageProps} />

      </ChakraProvider>
     
      </>
    
     )
}
