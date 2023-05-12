import {
  Box, Flex, Text, IconButton, Button, Stack, useColorModeValue, useBreakpointValue, Container,
  Heading, Menu, MenuButton, MenuList, MenuItem,} from "@chakra-ui/react";
// import { useWallet } from "use-wallet";
import NextLink from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";
import { ChevronDownIcon } from "@chakra-ui/icons";
import React, {useState,useEffect} from "react";
import Web3 from 'web3';
import { Router } from "next/router";
export default function NavBar() {
    const [address,setAddress] = useState('');
    const [balance,setBalance] = useState('');
    var Eth=require('web3-eth');
    var eth = new Eth(Eth.givenProvider);
    const connectToWallet= async()=>{
    //   var Eth=require('web3-eth');
    // var eth = new Eth(Eth.givenProvider);
      const accountAdd=await window.ethereum.request({method : "eth_requestAccounts"});
     
      const bal=Web3.utils.fromWei(await eth.getBalance(accountAdd[0]));
      setAddress(accountAdd[0]);
      setBalance(bal);
      
   }
   useEffect(() => {
    
    async function listenMMAccount() {
      const accountAdd=await window.ethereum.request({method : "eth_requestAccounts"});
        setAddress(accountAdd[0]);
        const bal=Web3.utils.fromWei(await eth.getBalance(accountAdd[0]))
        setBalance(bal);
      window.ethereum.on("accountsChanged", async function() {
        // Time to reload your interface with accounts[0]!
        
       
        window.location.reload();
      });
    }
    listenMMAccount();
  }, [])

  return (
    <Box>
      <Flex
        color={useColorModeValue("gray.600", "white")}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
        pos="fixed"
        top="0"
        w={"full"}
        minH={"60px"}
        boxShadow={"sm"}
        zIndex="999"
        justify={"center"}
        css={{
          backdropFilter: "saturate(180%) blur(5px)",
          backgroundColor: useColorModeValue(
            "rgba(255, 255, 255, 0.8)",
            "rgba(26, 32, 44, 0.8)"
          ),
        }}
      >
        <Container as={Flex} maxW={"7xl"} align={"center"}>
          <Flex flex={{ base: 1 }} justify="start" ml={{ base: -2, md: 0 }}>
            <Heading
              textAlign="left"
              fontFamily={"heading"}
              color={useColorModeValue("teal.800", "white")}
              as="h2"
              size="lg"
            >
              <Box
                as={"span"}
                color={useColorModeValue("teal.400", "teal.300")}
                position={"relative"}
                zIndex={10}
                _after={{
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  w: "full",
                  h: "30%",
                  bg: useColorModeValue("teal.100", "teal.900"),
                  zIndex: -1,
                }}
              >
                <NextLink href="/">🤝SecureFunds</NextLink>
              </Box>
            </Heading>
          </Flex>
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={6}
            display={{ base: "none", md: "flex" }}
          >
            <Button
              fontSize={"md"}
              fontWeight={600}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
            >
              <NextLink href="/createcampaign">Create Campaign</NextLink>
            </Button>
            <Button
              fontSize={"md"}
              fontWeight={600}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
            >
              <NextLink href="/#howitworks"> How it Works</NextLink>
            </Button>
            {/* <Button
              fontSize={"md"}
              fontWeight={600}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
            >
              <NextLink href="/">Connect Wallet</NextLink>
            </Button> */}
            {address === '' ? 
            // (
            //   <Menu>
            //     <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            //       {address.substr(0, 10) + "..."}
            //     </MenuButton>
            //     <MenuList>
            //       <MenuItem onClick={() => wallet.reset()}>
            //         {" "}
            //         Disconnect Wallet{" "}
            //       </MenuItem>
            //     </MenuList>
            //   </Menu>
            // )
            (
                <div>
                  <Button
                    display={{ base: "none", md: "inline-flex" }}
                    fontSize={"md"}
                    fontWeight={600}
                    color={"white"}
                    bg={"teal.400"}
                    href={"#"}
                    _hover={{
                      bg: "teal.300",
                    }}
                    onClick={() => connectToWallet()}
                  >
                    Connect Wallet{" "}
                  </Button>
                </div>
              ): 
            (
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    {address.substr(0, 10) + "..."}
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      {" "}
                      Balance: {balance} ETH{" "}
                    </MenuItem>
                    <MenuItem>
                    <NextLink href={"/campaign_created"}>
                    Campaigns Created{" "}
                    </NextLink>
                    </MenuItem>
                    <MenuItem >
                  
                    Campaigns Funded{" "}
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) 
            // (
            //   <div>
            //     <Button
            //       display={{ base: "none", md: "inline-flex" }}
            //       fontSize={"md"}
            //       fontWeight={600}
            //       color={"white"}
            //       bg={"teal.400"}
            //       href={"#"}
            //       _hover={{
            //         bg: "teal.300",
            //       }}
            //       onClick={() => connectToWallet()}
            //     >
            //       Connect Wallet{" "}
            //     </Button>
            //   </div>
            // )
            }

            <DarkModeSwitch />
          </Stack>

          <Flex display={{ base: "flex", md: "none" }}>
            <DarkModeSwitch />
          </Flex>
        </Container>
      </Flex>
    </Box>
  );
}