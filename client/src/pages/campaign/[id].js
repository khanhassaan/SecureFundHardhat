import Head from "next/head";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useWindowSize } from "react-use";

import {
    Box,Flex,Stack,Heading,Text,Container,Input,Button,SimpleGrid,InputRightAddon,InputGroup,FormControl,
    FormLabel,Stat,StatLabel,StatNumber,useColorModeValue,Tooltip,Alert,AlertIcon,AlertDescription,Progress,CloseButton,FormHelperText,Link,
  } from "@chakra-ui/react";
  
import { InfoIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import Confetti from "react-confetti";
import { contributeToProject, getAllFunding, getProjectInformation, walletAddress } from "../../utils/interaction";
import Web3 from "web3";
import { projectDataFormatter } from "../../utils/helper";
import moment from "moment";


  export async function getServerSideProps({ params }) {
    const campaignId = params.id;
    const getWalletAddress=await walletAddress();
    // const getCampaigndetails= await getAllFunding();
    // const formattedData= projectDataFormatter(getCampaigndetails,campaignId); 
    //   console.log(getCampaigndetails[0][0]);
    // const summary = await campaign.methods.getSummary().call();
    // const ETHPrice = await getETHPrice();
    const project=await getProjectInformation(campaignId,getWalletAddress);
    
    // console.log(project.state);
    return {
      props: {
        id: campaignId,
        minimumContribution:project.minContribution,
        balance:project.currentAmount,
        currentUserAddress:getWalletAddress,
        //  getCampaigndetails[4],
        projectState:project.state,
        //  state[getCampaigndetails[2]],
        fundraisingDeadline:project.deadline,
        //  getCampaigndetails[7],
        ProjectTimeline:project.timeline,
        // getCampaigndetails[2],
        manager:project.creator,
        //  getCampaigndetails[0],
        name:project.title,
        //  getCampaigndetails[5],
        description:project.description,
        //  getCampaigndetails[6],
        image: 'https://cdn.shopify.com/s/files/1/0070/7032/files/BestCrowdfundingSites_resized-03.jpg?v=1628129221&width=1024',
        target: project.goalAmount, 
        // getCampaigndetails[3],
      },
    };
}


    function StatsCard(props) {
        const { title, stat, info } = props;
        return (
          <Stat
            px={{ base: 2, md: 4 }}
            py={"5"}
            shadow={"sm"}
            border={"1px solid"}
            borderColor={"gray.500"}
            rounded={"lg"}
            transition={"transform 0.3s ease"}
            _hover={{
              transform: "translateY(-5px)",
            }}
          >
            <Tooltip
              label={info}
              bg={useColorModeValue("white", "gray.700")}
              placement={"top"}
              color={useColorModeValue("gray.800", "white")}
              fontSize={"1em"}
            >
              <Flex justifyContent={"space-between"}>
                <Box pl={{ base: 2, md: 4 }}>
                  <StatLabel fontWeight={"medium"} isTruncated>
                    {title}
                  </StatLabel>
                  <StatNumber
                    fontSize={"base"}
                    fontWeight={"bold"}
                    isTruncated
                    maxW={{ base: "	10rem", sm: "sm" }}
                  >
                    {stat}
                  </StatNumber>
                </Box>
              </Flex>
            </Tooltip>
          </Stat>
        );
  }


  export default function CampaignSingle({
    id,
    minimumContribution,
    balance,
    projectState,
    currentUserAddress,
    manager,
    name,
    description,
    image,
    target,
    fundraisingDeadline,
  }) {
    const { handleSubmit, register, formState, reset, getValues } = useForm({
      mode: "onChange",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [amountInUSD, setAmountInUSD] = useState();

    const router = useRouter();
    const { width, height } = useWindowSize();
    const dateFundRaisingDL=new Date(fundraisingDeadline);
    const deadlineUnixFormat=dateFundRaisingDL.getTime();
    
    
    
    async function onSubmit(data) {
      try {
        // const campaign = Campaign(id);
        // const accounts = currentUserAddress;
        // await campaign.methods.contibute().send({
        //   from: accounts[0],
        //   value: Web3.utils.toWei(data.value, "ether"),
        // });
        const userWalletAdd=await walletAddress();
        const amountInWei=Web3.utils.toWei(data.value, "ether");
        await contributeToProject(id,amountInWei,userWalletAdd);
        router.push(`/campaign/${id}`);
        // setAmountInUSD(null);
        reset("", {
          keepValues: false,
        });
        setIsSubmitted(true);
        setError(false);
      } catch (err) {
        setError(err.message);
        console.log(err);
      }
    }
    // console.log(manager.toLowerCase()!= userWalletAdd);
    // console.log(userWalletAdd);
    return (
        <div top='40px'>
          <Head>
            <title>Campaign Details</title>
            <meta name="description" content="Create a Withdrawal Request" />
            <link rel="icon" href="/logo.svg" />
          </Head>
          {isSubmitted ? <Confetti width={width} height={height} /> : null}
          <main>
            {" "}
            <Box position={"relative"}>
              {isSubmitted ? (
                <Container
                  maxW={"7xl"}
                  columns={{ base: 1, md: 2 }}
                  spacing={{ base: 10, lg: 32 }}
                  py={{ base: 6 }}
                >
                  <Alert status="success" mt="2">
                    <AlertIcon />
                    <AlertDescription mr={2}>
                      {" "}
                      Thank You for your Contribution 🙏
                    </AlertDescription>
                    <CloseButton
                      position="absolute"
                      right="8px"
                      top="8px"
                      onClick={() => setIsSubmitted(false)}
                    />
                  </Alert>
                </Container>
              ) : null}
              <Container
                as={SimpleGrid}
                maxW={"7xl"}
                columns={{ base: 1, md: 2 }}
                spacing={{ base: 10, lg: 32 }}
                py={{ base: 6 }}
              >
                <Stack spacing={{ base: 6 }}>
                  <Heading
                    lineHeight={1.1}
                    fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
                  >
                    {name}
                  </Heading>
                  <Text
                    color={useColorModeValue("gray.500", "gray.200")}
                    fontSize={{ base: "lg" }}
                  >
                    {"Project Description: "}<br/>
                    {description}
                  </Text>
                  
                  <Box mx={"auto"} w={"full"}>
                    <SimpleGrid columns={{ base: 1 }} spacing={{ base: 5 }}>
                      <StatsCard
                        title={"Minimum Contribution"}
                        stat={Web3.utils.fromWei(
                         String(minimumContribution),
                          "ether"
                        )
                        
                    }
                        info={
                          "You must contribute at least this much in Wei ( 1 ETH = 10 ^ 18 Wei) to become an approver"
                        }
                      />
                      <StatsCard
                        title={"Wallet Address of Campaign Creator"}
                        stat={manager}
                        info={
                          "The Campaign Creator created the campaign and can create requests to withdraw money."
                        }
                      />
                      <StatsCard
                        title={"Project State"}
                        stat={projectState}
                        info={
                          "Current State of project"
                        }
                      />
                      <StatsCard
                        title={"Project Deadline"}
                        stat={fundraisingDeadline}
                        info={
                          "Date and time at which fundraising will stop"
                        }
                      />
                      <StatsCard
                        title={"Amount Raised"}
                        stat={balance}
                        info={
                          "Number of people who have already donated to this campaign"
                        }
                        
                      />
                    
                      {/* <StatsCard
                        title={"Timeline for amount withdrawl"}
                        stat={
                          "formattedTimeline"
                          // moment.unix(ProjectTimeline[0]).format('dddd, MMMM Do, YYYY h:mm:ss A')
                          
                          // Date(parseInt(ProjectTimeline[0])*1000).slice(0,24)
                        }
                        info={
                          "Number of people who have already donated to this campaign"
                        }
                        
                      /> */}
                      
                    </SimpleGrid>
                  </Box>
                </Stack>
                
                <Stack spacing={{ base: 4 }}>
                  <Box>
                    <Stat
                      bg={useColorModeValue("white", "gray.700")}
                      boxShadow={"lg"}
                      rounded={"xl"}
                      p={{ base: 4, sm: 6, md: 8 }}
                      spacing={{ base: 8 }}
                    >
                      <StatLabel fontWeight={"medium"}>
                        <Text as="span" isTruncated mr={2}>
                          {" "}
                          Campaign Balance
                        </Text>
                        <Tooltip
                          label="The balance is how much money this campaign has left to
                      spend."
                          bg={useColorModeValue("white", "gray.700")}
                          placement={"top"}
                          color={useColorModeValue("gray.800", "white")}
                          fontSize={"1em"}
                          px="4"
                        >
                          <InfoIcon
                            color={useColorModeValue("teal.800", "white")}
                          />
                        </Tooltip>
                      </StatLabel>
                      <StatNumber>
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
                            {/* (${getWEIPriceInUSD(ETHPrice, balance)}) */}
                          </Text>
                        </Box>
    
                        <Text fontSize={"md"} fontWeight="normal">
                          target of {target} ETH 
                          {/* (${getWEIPriceInUSD(ETHPrice, target)}) */}
                        </Text>
                        <Progress
                          colorScheme="teal"
                          size="sm"
                          value={balance}
                          max={target}
                          mt={4}
                        />
                      </StatNumber>
                    </Stat>
                  </Box>
               
               {(deadlineUnixFormat) > (Date.now()) || projectState!="Successful"?(
                
                manager.toLowerCase()!= walletAddress?
                
                
              ( <Stack
                    bg={useColorModeValue("white", "gray.700")}
                    boxShadow={"lg"}
                    rounded={"xl"}
                    p={{ base: 4, sm: 6, md: 8 }}
                    spacing={{ base: 6 }}
                  >
                    <Heading
                      lineHeight={1.1}
                      fontSize={{ base: "2xl", sm: "3xl" }}
                      color={useColorModeValue("teal.600", "teal.200")}
                    >
                      Contribute Now!
                    </Heading>
    
                    <Box mt={10}>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl id="value">
                          <FormLabel>
                            Amount in Ether you want to contribute
                          </FormLabel>
                          <InputGroup>
                            {" "}
                            <Input
                              {...register("value", { required: true })}
                              type="number"
                              isDisabled={formState.isSubmitting}
                              // onChange={(e) => {
                              //   setAmountInUSD(Math.abs(e.target.value));
                              // }}
                              
                              step="any"
                              min="0"
                            />{" "}
                            <InputRightAddon children="ETH" />
                          </InputGroup>
                          {/* {amountInUSD ? (
                            <FormHelperText>
                              ~$ {getETHPriceInUSD(ETHPrice, amountInUSD)}
                            </FormHelperText>
                          ) : null} */}
                        </FormControl>
    
                        {error ? (
                          <Alert status="error" mt="2">
                            <AlertIcon />
                            <AlertDescription mr={2}> {error} 
                            {console.log(error)}
                            </AlertDescription>
                          </Alert>
                        ) : null}
    
                        {/* <Stack spacing={10}>
                          {currentUserAddress!=manager ? (
                            <Button
                              fontFamily={"heading"}
                              mt={4}
                              w={"full"}
                              bgGradient="linear(to-r, teal.400,green.400)"
                              color={"white"}
                              _hover={{
                                bgGradient: "linear(to-r, teal.400,blue.400)",
                                boxShadow: "xl",
                              }}
                              isLoading={formState.isSubmitting}
                              // isDisabled={amountInUSD ? false : true}
                             
                              type="submit"
                            >
                              Contribute
                            </Button>
                           ) : (
                            <Alert status="warning" mt={4}>
                              <AlertIcon />
                              <AlertDescription mr={2}>
                                Cannot contribute you're project creator
                              </AlertDescription>
                            </Alert>
                          )} 
                        </Stack> */}
                          <Stack spacing={10}>
                            <Button
                                fontFamily={"heading"}
                                mt={4}
                                w={"full"}
                                bgGradient="linear(to-r, teal.400,green.400)"
                                color={"white"}
                                _hover={{
                                  bgGradient: "linear(to-r, teal.400,blue.400)",
                                  boxShadow: "xl",
                                }}
                                isLoading={formState.isSubmitting}
                                // isDisabled={deadlineUnixFormat/1000 > (Date.now()/1000) ? false : true}
                              
                                type="submit"
                              >
                                Contribute
                              </Button>
                          </Stack>
                      </form>
                    </Box>
                  </Stack>):
                 ( <Stack
                  bg={useColorModeValue("white", "gray.700")}
                  boxShadow={"lg"}
                  rounded={"xl"}
                  p={{ base: 4, sm: 6, md: 8 }}
                  spacing={{ base: 6 }}
                  >
                    <Heading
                    size={5}
                    >
                    You are Campaign Creator
                    </Heading>
                  </Stack>)
                  ) 
                 : (  <Stack
                    bg={useColorModeValue("white", "gray.700")}
                    boxShadow={"lg"}
                    rounded={"xl"}
                    p={{ base: 4, sm: 6, md: 8 }}
                    spacing={{ base: 6 }}
                    >
                      <Heading
                      size={5}
                      >
                        The Campaign is Closed
                      </Heading>
                    </Stack>
                  )}
    
                  <Stack
                    bg={useColorModeValue("white", "gray.700")}
                    boxShadow={"lg"}
                    rounded={"xl"}
                    p={{ base: 4, sm: 6, md: 8 }}
                    spacing={4}
                  >
                    <NextLink href={`/campaign/${id}/requests/show_request`}>
                      <Button
                        fontFamily={"heading"}
                        w={"full"}
                        bgGradient="linear(to-r, teal.400,green.400)"
                        color={"white"}
                        _hover={{
                          bgGradient: "linear(to-r, teal.400,blue.400)",
                          boxShadow: "xl",
                        }}
                      >
                        View Withdrawal Requests
                      </Button>
                    </NextLink>
                    <Text fontSize={"sm"}>
                      * You can see where these funds are being used & if you have
                      contributed you can also approve those Withdrawal Requests :)
                    </Text>
                  </Stack>
                </Stack>
              </Container>
            </Box>
          </main>
        </div>
      );
    }