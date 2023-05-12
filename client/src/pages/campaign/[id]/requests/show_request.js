import React, { useState, useEffect } from "react";
import Head from "next/head";
import NextLink from "next/link";
import NextImage from "next/image";
import { useRouter } from "next/router";

import {
  Heading,useBreakpointValue,useColorModeValue,Text,Button,Flex,Container,SimpleGrid,Box,Spacer,Table,Thead,Tbody,Tooltip,Tr,Th,
  Td,
  TableCaption,
  Skeleton,
  Alert,
  AlertIcon,
  AlertDescription,
  HStack,
  Stack,
  Link,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  InfoIcon,
  CheckCircleIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import Web3 from "web3";
import { getAllWithdrawRequest, getProjectInformation, getRequestCount, getVoteCount, loadProjectContract, voteWithdrawRequest,withdrawFundsFromContract  } from "../../../../utils/interaction";



export async function getServerSideProps({ params }) {
  const campaignId = params.id;
  const ProjectInformation=await getProjectInformation(campaignId);
  const requestCount=await getRequestCount(campaignId);
  const totalNumberOfVoter=await getVoteCount(campaignId);
  return {
    props: {
      campaignId,
      requestCount,
      totalNumberOfVoter,
      balance: ProjectInformation.currentAmount,
      name: ProjectInformation.title,
    },
  };
}


const RequestRow = ({
  index,
  id,
  request,
  approversCount,
  campaignId,
  disabled,
}) => {
  const router = useRouter();
  const readyToFinalize = request.totalVote  > approversCount / 2;
  const [errorMessageApprove, setErrorMessageApprove] = useState();
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [errorMessageFinalize, setErrorMessageFinalize] = useState();
  const [loadingFinalize, setLoadingFinalize] = useState(false);


  // Approve For Funds
  const onApprove = async () => {
    setLoadingApprove(true);
    try {
      const accountAdd=await window.ethereum.request({method : "eth_requestAccounts"});
      await voteWithdrawRequest(campaignId,id,accountAdd[0])
      router.reload();
    } catch (err) {
      setErrorMessageApprove(err.message);
    } finally {
      setLoadingApprove(false);
    }
  };

  const onFinalize = async () => {
    setLoadingFinalize(true);
    try { // console.log(results);
      // const campaign = Campaign(campaignId);
      // const accounts = await web3.eth.getAccounts();
      // await campaign.methods.  (id).send({
      //   from: accounts[0],
      // });
      const accountAdd=await window.ethereum.request({method : "eth_requestAccounts"});
      await withdrawFundsFromContract(campaignId,id,accountAdd[0]);
      router.reload();
    } catch (err) {
      setErrorMessageFinalize(err.message);
    } finally {
      setLoadingFinalize(false);
    }
  };

  return (
    <Tr
      bg={
        readyToFinalize && !request.isCompleted
          ? useColorModeValue("teal.100", "teal.700")
          : useColorModeValue("gray.100", "gray.700")
      }
      opacity={request.isCompleted ? "0.4" : "1"}
    >
      <Td>{id} </Td>
      <Td>{request.desc}</Td>
      <Td isNumeric>
        {/* {request.amount} */}
        {Web3.utils.fromWei(request.amount, "ether")}ETH 
      </Td>
      <Td>
        <Link
          color="teal.500"
          href={`${request.ipfslink }`}
          isExternal
        >
          {" "}
          {request.ipfslink.substr(0, 20) + "..."}
        </Link>
        {/* <a href={`${request.ipfslink }`}>{`${request.ipfslink }`}</a> */}
      </Td>
      <Td>
        {request.totalVote}/{parseFloat(approversCount)}
      </Td>
      <Td>
        <HStack spacing={2}>
          <Tooltip
            label={errorMessageApprove}
            bg={useColorModeValue("white", "gray.700")}
            placement={"top"}
            color={useColorModeValue("gray.800", "white")}
            fontSize={"1em"}
          >
            <WarningIcon
              color={useColorModeValue("red.600", "red.300")}
              display={errorMessageApprove ? "inline-block" : "none"}
            />
          </Tooltip>
          {request.isCompleted ? (
            <Tooltip
              label="This Request has been finalized & withdrawn to the recipient,it may then have less no of approvers"
              bg={useColorModeValue("white", "gray.700")}
              placement={"top"}
              color={useColorModeValue("gray.800", "white")}
              fontSize={"1em"}
            >
              <CheckCircleIcon
                color={useColorModeValue("green.600", "green.300")}
              />
            </Tooltip>
          ) : (
            <Button
              colorScheme="yellow"
              variant="outline"
              _hover={{
                bg: "yellow.600",
                color: "white",
              }}
              onClick={onApprove}
              isDisabled={disabled || request.totalVote== approversCount}
              isLoading={loadingApprove}
            >
              Approve
            </Button>
          )}
        </HStack>
      </Td>
      <Td>
        <Tooltip
          label={errorMessageFinalize}
          bg={useColorModeValue("white", "gray.700")}
          placement={"top"}
          color={useColorModeValue("gray.800", "white")}
          fontSize={"1em"}
        >
          <WarningIcon
            color={useColorModeValue("red.600", "red.300")}
            display={errorMessageFinalize ? "inline-block" : "none"}
            mr="2"
          />
        </Tooltip>
        {request.isCompleted ? (
          <Tooltip
              label="This Request has been finalized & withdrawn to the recipient,it may then have less no of approvers"
            bg={useColorModeValue("white", "gray.700")}
            placement={"top"}
            color={useColorModeValue("gray.800", "white")}
            fontSize={"1em"}
          >
            <CheckCircleIcon
              color={useColorModeValue("green.600", "green.300")}
            />
          </Tooltip>
        ) : (
          <HStack spacing={2}>
            <Button
              colorScheme="green"
              variant="outline"
              _hover={{
                bg: "green.600",
                color: "white",
              }}
              isDisabled={disabled || (!request.isCompleted && !readyToFinalize)}
              onClick={onFinalize}
              isLoading={loadingFinalize}
            >
              Finalize
            </Button>

            <Tooltip
              label="This Request is ready to be Finalized because it has been approved by 50% Approvers"
              bg={useColorModeValue("white", "gray.700")}
              placement={"top"}
              color={useColorModeValue("gray.800", "white")}
              fontSize={"1.2em"}
            >
              <InfoIcon
                as="span"
                color={useColorModeValue("teal.800", "white")}
                display={
                  readyToFinalize && !request.isCompleted ? "inline-block" : "none"
                }
              />
            </Tooltip>
          </HStack>
        )}
      </Td>
    </Tr>
  );
};






export default function ShowWithdrawlRequest (
  {
    campaignId,
    requestCount,
    totalNumberOfVoter,
    balance,
    name,
  }
) {



  const [requestsList, setRequestsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [FundNotAvailable, setFundNotAvailable] = useState(false);
  // const campaign = Campaign(campaignId);

  async function getRequests() {
    try {
      const requests=await getAllWithdrawRequest(campaignId);
      setRequestsList(requests)
      setIsLoading(false);
      return requests;
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (balance == 0) {
      setFundNotAvailable(true);
    }
    getRequests();
  }, []);



  return (
    <div>
      <Head>
        <title>Campaign Withdrawal Requests</title>
        <meta name="description" content="Create a Withdrawal Request" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <main>
        <Container px={{ base: "4", md: "12" }} maxW={"7xl"} align={"left"}>
          <Flex flexDirection={{ base: "column", md: "row" }} py={4}>
            <Box py="4">
              <Text fontSize={"lg"} color={"teal.400"}>
                <ArrowBackIcon mr={2} />
                <NextLink href={`/campaign/${campaignId}`}>
                  Back to Campaign
                </NextLink>
              </Text>
            </Box>
            <Spacer />
            <Box py="4">
              Campaign Balance :{" "}
              <Text as="span" fontWeight={"bold"} fontSize="lg">
                {balance > 0
                  ? balance
                  : "0, Become a Donor 😄"} ETH
              </Text>
            </Box>
          </Flex>
          {FundNotAvailable ? (
            <Alert status="error" my={4}>
              <AlertIcon />
              <AlertDescription>
                The Current Balance of the Campaign is 0, Please Contribute to
                approve and finalize Requests.
              </AlertDescription>
            </Alert>
          ) : null}
        </Container>
        {requestsList.length > 0 ? (
          <Container px={{ base: "4", md: "12" }} maxW={"7xl"} align={"left"}>
            <Flex flexDirection={{ base: "column", lg: "row" }} py={4}>
              <Box py="2" pr="2">
                <Heading
                  textAlign={useBreakpointValue({ base: "left" })}
                  fontFamily={"heading"}
                  color={useColorModeValue("gray.800", "white")}
                  as="h3"
                  isTruncated
                  maxW={"3xl"}
                >
                  Withdrawal Requests for {name} Campaign
                </Heading>
              </Box>
              {/* <Spacer />
              <Box py="2">
                <NextLink href={`/campaign/${campaignId}/requests/new`}>
                  <Button
                    display={{ sm: "inline-flex" }}
                    justify={"flex-end"}
                    fontSize={"md"}
                    fontWeight={600}
                    color={"white"}
                    bg={"teal.400"}
                    href={"#"}
                    _hover={{
                      bg: "teal.300",
                    }}
                  >
                    Add Withdrawal Request
                  </Button>
                </NextLink>
              </Box> */}
            </Flex>{" "}
            <Box overflowX="auto">
              <Table>
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th w="30%">Description</Th>
                    <Th isNumeric>Amount</Th>
                    <Th maxW="12%" isTruncated>
                      IPFS FILE LINK
                    </Th>
                    <Th>Approval Count </Th>
                    <Th>Approve </Th>
                    <Th>Finalize </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {requestsList.map((request, index) => {
                    console.log(request)
                    return (
                      
                      <RequestRow
                        key={index}
                        id={index}
                        request={request}
                        approversCount={totalNumberOfVoter}
                        campaignId={campaignId}
                        disabled={FundNotAvailable}
                      />
                    );
                  })}
                </Tbody>
                <TableCaption textAlign="left" ml="-2">
                  Found {requestCount} Requests
                </TableCaption>
              </Table>
            </Box>
          </Container>
        ) : (
          <div>
            <Container
              px={{ base: "4", md: "12" }}
              maxW={"7xl"}
              align={"left"}
              display={isLoading ? "block" : "none"}
            >
              <SimpleGrid rows={{ base: 3 }} spacing={2}>
                <Skeleton height="2rem" />
                <Skeleton height="5rem" />
                <Skeleton height="5rem" />
                <Skeleton height="5rem" />
              </SimpleGrid>
            </Container>
            <Container
              maxW={"lg"}
              align={"center"}
              display={
                requestsList.length === 0 && !isLoading ? "block" : "none"
              }
            >
              <SimpleGrid row spacing={2} align="center">
                <Stack align="center">
                  <NextImage
                    src="/static/no-requests.png"
                    alt="no-request"
                    width="150"
                    height="150"
                  />
                </Stack>
                <Heading
                  textAlign={"center"}
                  color={useColorModeValue("gray.800", "white")}
                  as="h4"
                  size="md"
                >
                  No Requests yet for {name} Campaign
                </Heading>
                <Text
                  textAlign={useBreakpointValue({ base: "center" })}
                  color={useColorModeValue("gray.600", "gray.300")}
                  fontSize="sm"
                >
                  Create a Withdrawal Request to Withdraw funds from the
                  Campaign😄
                </Text>

                <Button
                  fontSize={"md"}
                  fontWeight={600}
                  color={"white"}
                  bg={"teal.400"}
                  _hover={{
                    bg: "teal.300",
                  }}
                >
                  {/* <NextLink href={`/campaign/${campaignId}/requests/new`}>
                    Create Withdrawal Request
                  </NextLink> */}
                </Button>

                <Button
                  fontSize={"md"}
                  fontWeight={600}
                  color={"white"}
                  bg={"gray.400"}
                  _hover={{
                    bg: "gray.300",
                  }}
                >
                  <NextLink href={`/campaign/${campaignId}/`}>
                    Go to Campaign
                  </NextLink>
                </Button>
              </SimpleGrid>
            </Container>
          </div>
        )}
      </main>
    </div>
  )
}

