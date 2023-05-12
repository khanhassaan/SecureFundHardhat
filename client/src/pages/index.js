import React from 'react';
import Head from "next/head";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import {
  Heading,useBreakpointValue,useColorModeValue,Text,Button,Flex,Container,SimpleGrid,Box,
  Divider,Skeleton,Img,Icon,chakra,Tooltip,Link,SkeletonCircle,HStack,Stack,Progress, IconButton, filter,
} from "@chakra-ui/react";
import moment from 'moment';
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { FaFilter, FaFunnelDollar, FaHandshake } from "react-icons/fa";
import { FcShare, FcDonate, FcMoneyTransfer, FcLightAtTheEndOfTunnel } from "react-icons/fc";
import { getAllFunding, loadCrowdFundingContract } from '../utils/interaction';
import Web3 from 'web3';

export async function getServerSideProps(context) {
  const contractAddress=await loadCrowdFundingContract();
  const campaigns = await contractAddress.methods.getTotalProjects().call();
  const getCampaigndetails= await getAllFunding();
  // // console.log(campaigns);
  // console.log(getCampaigndetails);

  return {
    props: { campaigns },
  };
}

//Cards and features
const Feature = ({ title, text, icon }) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"white"}
        rounded={"full"}
        bg={useColorModeValue("gray.100", "gray.700")}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={useColorModeValue("gray.500", "gray.200")}>{text}</Text>
    </Stack>
  );
};

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
    <NextLink href={`/campaign/${id}`}>
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
        <Box height="12em">
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
        <Box p="4">
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
              label="Contribute"
              bg={useColorModeValue("white", "gray.700")}
              placement={"top"}
              color={useColorModeValue("gray.800", "white")}
              fontSize={"1.2em"}
            >
              <chakra.a display={"flex"}>
                <Icon
                  as={FaHandshake}
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
                    // Web3.utils.fromWei(balance, "ether")
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
                target of {target} ETH ($
                {/* {getWEIPriceInUSD(ethPrice, target)} */}
                )
              </Text>
              <Progress
                colorScheme="teal"
                size="sm"
                value={balance}
                max={target}
                mt="2"
              />
            </Box>{" "}
          </Flex>
        </Box>
      </Box>
    </NextLink>
  );
}




export default function Home({campaigns}) {
  const [campaignList, setCampaignList] = useState([]);
  const date=new Date();

  async function getSummary() {
    try {
      const getCampaigndetails= await getAllFunding();
      
      // console.log(getCampaigndetails);
      // const ETHPrice = await getETHPrice();
      // updateEthPrice(ETHPrice);
      
      setCampaignList(getCampaigndetails);

      return getCampaigndetails;
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getSummary();
  }, []);

  return (
    <div>
    <Head>
      <title>Secure Funds</title>
      <meta
        name="description"
        content="Transparent Crowdfunding in Blockchain"
      />
      <link rel="icon" href="/logo.svg" />
    </Head>
    <main className={styles.main}>
      <Container py={{ base: "4", md: "12" }} maxW={"7xl"} align={"left"}>
        {" "}
        <Heading
          textAlign={useBreakpointValue({ base: "left" })}
          fontFamily={"heading"}
          color={useColorModeValue("gray.800", "white")}
          as="h1"
          py={4}
        >
          Crowdfunding using the powers of <br /> Crypto & Blockchain 😄{" "}
        </Heading>
        <NextLink href="/createcampaign">
          <Button
            display={{ sm: "inline-flex" }}
            fontSize={"md"}
            fontWeight={600}
            color={"white"}
            bg={"teal.400"}
            _hover={{
              bg: "teal.300",
            }}
          >
            Create Campaign
          </Button>
        </NextLink>
      </Container>
      <Container py={{ base: "4", md: "12" }} maxW={"7xl"}>
        <HStack spacing={2}>
          <SkeletonCircle size="4" bgColor={'green'}/>
          <Heading as="h2" size="lg">
            Open Campaigns

            
          </Heading>
          <Icon
            as={FaFilter}
            height={5}
            width={6}
            />
        </HStack>

        <Divider marginTop="4" />

        {campaignList.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10} py={8}>
            {campaignList.map((el, i) => {
               const fundraisingDl=moment(el.deadline).unix();
               
              if(parseInt(el.goalAmount)>parseInt(el.currentAmount) && (Date.now()/1000)<fundraisingDl){
                // el.goalAmount<=el.currentAmount && date.getTime()<=fundraisingDl
                return (
                <div key={i}>
                  <CampaignCard
                    name={el.title}
                    description={el.description}
                    creatorId={el.creator}
                    imageURL={'https://cdn.shopify.com/s/files/1/0070/7032/files/BestCrowdfundingSites_resized-03.jpg?v=1628129221&width=1024'}
                    id={el.address}
                    target={el.goalAmount}
                    balance={el.currentAmount}
                    // ethPrice={ethPrice}
                  />
                </div>
              );
            }
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
        
      
      <Container py={{ base: "4", md: "12" }} maxW={"7xl"}>
        <HStack spacing={2}>
          <SkeletonCircle size="4" />
          <Heading as="h2" size="lg">
            Successful Campaigns
          </Heading>
        </HStack>

        <Divider marginTop="4" />
        {campaignList.length > 0  ? (
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10} py={8}>
            {campaignList.map((el, i) => {
              
              if (el.state==="Successful" ) {
                return (
                  <div key={i}>
                    <CampaignCard
                      name={el.title}
                      description={el.description}
                      creatorId={el.creator}
                      imageURL={'https://cdn.shopify.com/s/files/1/0070/7032/files/BestCrowdfundingSites_resized-03.jpg?v=1628129221&width=1024'}
                      id={el.address}
                      target={el.goalAmount}
                      balance={el.currentAmount}
                      // ethPrice={ethPrice}
                    />
                  </div>
                );
              }
           
            })}
          </SimpleGrid>
        ) : (
          <Skeleton height="5px"></Skeleton>         
        )
        }
        </Container>


      <Container py={{ base: "4", md: "12" }} maxW={"7xl"}>
        <HStack spacing={2}>
          <SkeletonCircle size="4" />
          <Heading as="h2" size="lg">
            Closed Campaigns
          </Heading>
        </HStack>
        <Divider marginTop="4" />

        {campaignList.length > 0  ? (
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10} py={8}>
            {campaignList.map((el, i) => {
              const fundraisingDl=moment(el.deadline).unix();
              
              if (parseInt(el.goalAmount)>parseInt(el.currentAmount) &&(Date.now()/1000) > fundraisingDl && el.state!="Successful") {
                
                return (
                  <div key={i}>
                    <CampaignCard
                      name={el.title}
                      description={el.description}
                      creatorId={el.creator}
                      imageURL={'https://cdn.shopify.com/s/files/1/0070/7032/files/BestCrowdfundingSites_resized-03.jpg?v=1628129221&width=1024'}
                      id={el.address}
                      target={el.goalAmount}
                      balance={el.currentAmount}
                      // ethPrice={ethPrice}
                    />
                  </div>
                );
              }
           
            })}
          </SimpleGrid>
        ) : (
          <Skeleton height="5px"></Skeleton>         
        )
        }




        </Container>
      <Container py={{ base: "4", md: "12" }} maxW={"7xl"} id="howitworks">
        <HStack spacing={2}>
          <SkeletonCircle size="4" />
          <Heading as="h2" size="lg">
            How Secure Funds Works
          </Heading>
        </HStack>
        <Divider marginTop="4" />
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
          <Feature
            icon={<Icon as={FcDonate} w={10} h={10} />}
            title={"Create a Campaign for Fundraising"}
            text={
              "It’ll take only 2 minutes. Just enter a few details about the funds you are raising for."
            }
          />
          <Feature
            icon={<Icon as={FcShare} w={10} h={10} />}
            title={"Share your Campaign"}
            text={
              "All you need to do is share the Campaign with your friends, family and others. In no time, support will start pouring in."
            }
          />
          <Feature
            icon={<Icon as={FcMoneyTransfer} w={10} h={10} />}
            title={"Request and Withdraw Funds"}
            text={
              "The funds raised can be withdrawn directly to the recipient when 50% of the contributors approve of the Withdrawal Request."
            }
          />
        </SimpleGrid>
        
        <Divider marginTop="4" />
      </Container>
   
    </main>
  </div>
  )
}
