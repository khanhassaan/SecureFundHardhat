import React from 'react';
import Head from "next/head";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import {
  Heading,useBreakpointValue,useColorModeValue,Text,Button,Flex,Container,SimpleGrid,Box,
  Divider,Skeleton,Img,Icon,chakra,Tooltip,Link,SkeletonCircle,HStack,Stack,Progress,
} from "@chakra-ui/react";

import { ExternalLinkIcon } from "@chakra-ui/icons";
import { FaHandshake, FaPlusSquare } from "react-icons/fa";
import { FcShare, FcDonate, FcMoneyTransfer } from "react-icons/fc";
import Web3 from 'web3';
import { getAllFunding, walletAddress } from '../utils/interaction';
export default function CampaignCreated  () {


  function CampaignCard({
    name,
    description,
    creatorId,
    imageURL,
    id,
    balance,
    target,
    ethPrice,
  }) {
    return (
      <NextLink href={`/campaign/${id}/requests/create_withdraw_request`}>
        <Box
          bg={useColorModeValue("white", "gray.800")}
          maxW={{ md: "sm" }}
          borderWidth="1px"
          rounded="lg"
          shadow="lg"
          position="relative"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          transition={"transform 0.3s ease"}
          _hover={{
            transform: "translateY(-8px)",
          }}
        >
          <Box height="18em">
            <Img
              src={imageURL}
              alt={`Picture of ${name}`}
              roundedTop="lg"
              objectFit="cover"
              w="full"
              h="full"
              display="block"
            />
          </Box>
          <Box p="6">
            <Flex
              mt="1"
              justifyContent="space-between"
              alignContent="center"
              py={2}
            >
              <Box
                fontSize="2xl"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                isTruncated
              >
                {name}
              </Box>
  
              <Tooltip
                label="Request Funds"
                bg={useColorModeValue("white", "gray.700")}
                placement={"top"}
                color={useColorModeValue("gray.800", "white")}
                fontSize={"1.2em"}
              >
                <chakra.a display={"flex"}>
                  <Icon
                    as={FaPlusSquare  }
                    h={7}
                    w={7}
                    alignSelf={"center"}
                    color={"teal.400"}
                  />{" "}
                </chakra.a>
              </Tooltip>
            </Flex>
            <Flex alignContent="center" py={2}>
              {" "}
              <Text color={"gray.500"} pr={2}>
                by
              </Text>{" "}
              <Heading size="base" isTruncated>
                {creatorId}
              </Heading>
            </Flex>
            <Flex direction="row" py={2}>
              <Box w="full">
                <Box
                  fontSize={"2xl"}
                  isTruncated
                  maxW={{ base: "	15rem", sm: "sm" }}
                  pt="2"
                >
                  <Text as="span" fontWeight={"bold"}>
                    {balance > 0
                      ? balance
                      : "0, Become a Donor 😄"}
                  </Text>
                  <Text
                    as="span"
                    display={balance > 0 ? "inline" : "none"}
                    pr={2}
                    fontWeight={"bold"}
                  >
                    {" "}
                    ETH
                  </Text>
                  <Text
                    as="span"
                    fontSize="lg"
                    display={balance > 0 ? "inline" : "none"}
                    fontWeight={"normal"}
                    color={useColorModeValue("gray.500", "gray.200")}
                  >
                    {/* (${getWEIPriceInUSD(ethPrice, balance)}) */}
                  </Text>
                </Box>
  
                <Text fontSize={"md"} fontWeight="normal">
                  target of {target} 
                  {/* {Web3.utils.fromWei(target, "ether")} */}
                   ETH ($
                  {/* {getWEIPriceInUSD(ethPrice, target)} */}
                  )
                </Text>
                <Progress
                  colorScheme="teal"
                  size="sm"
                  value={balance}
                  // {Web3.utils.fromWei(balance, "ether")}
                  max={target}
                  // {Web3.utils.fromWei(target, "ether")}
                  mt="2"
                />
              </Box>{" "}
            </Flex>
          </Box>
        </Box>
      </NextLink>
    );
  }
  
  



  async function getCampaigns() {
    try {
      const getCampaigndetails= await getAllFunding();
      const userAddress=await walletAddress();
      console.log(getCampaigndetails);
      // console.log(getCampaigndetails);
      // const ETHPrice = await getETHPrice();
      // updateEthPrice(ETHPrice);
      // if (getCampaigndetails.creatorId) {
        
      // }
      // console.log(userAddress);
      getCampaigndetails.map((el,i)=>{
        if (el.creator==userAddress) {
          setCampaignList(getCampaigndetails);    
        }
      })
      
      

      return getCampaigndetails;
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    
    getCampaigns();
    
  }, [])
  
  
  const [campaignList, setCampaignList] = useState([]);
  return (
    <div>
      <main className={styles.main}>
      <Head>
      <title>Created Campaigns</title>
      <meta
        name="description"
        content="Transparent Crowdfunding in Blockchain"
      />
      {/* <link rel="icon" href="/logo.svg" /> */}
    </Head>
    <Container py={{ base: "4", md: "12" }} maxW={"7xl"}>
        <HStack spacing={2}>
          <SkeletonCircle size="4" />
          <Heading as="h2" size="lg">
            Created Campaigns
          </Heading>
        </HStack>

        <Divider marginTop="4" />

        {campaignList.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
            {campaignList.map((el, i) => {
              return (
                <div key={i}>
                  <CampaignCard
                    name={el.title}
                    description={el.description}
                    creatorId={el.creator}
                    imageURL={'https://cdn.shopify.com/s/files/1/0070/7032/files/BestCrowdfundingSites_resized-03.jpg?v=1628129221&width=1024'}
                    id={el.address}
                      // campaigns[i]}
                    target={el.goalAmount}
                    balance={el.currentAmount}
                    // ethPrice={ethPrice}
                  />
                </div>
              );
            })}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
            <Skeleton height="25rem" />
            <Skeleton height="25rem" />
            <Skeleton height="25rem" />
          </SimpleGrid>
        )}
      </Container>
      </main>
      </div>
  )
}
