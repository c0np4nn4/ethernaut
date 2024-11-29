
// import React, { useState } from "react";
// import { ConnectButton, useAccounts, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
// import { Box, Container, Flex, Heading, Button, Text, Grid, Card, Code } from "@radix-ui/themes";
// import { Transaction } from "@mysten/sui/transactions";

// function App() {
//   const accounts = useAccounts(); // 현재 연결된 계정 가져오기
//   const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction(); // 트랜잭션 서명 및 실행
//   const [counterId, setCounterId] = useState<string | null>(null);
//   const [count, setCount] = useState<number | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

//   const createCounter = async () => {
//     if (!accounts || accounts.length === 0) {
//       setMessage("Please connect your wallet.");
//       return;
//     }

//     try {
//       const tx = new Transaction();
//       tx.moveCall({
//         target: `0x53fb0bdca605ba3883d72f012ffd07022501c9db0f58376829918a7317c12f1b::Counter::create_object`,
//         arguments: [],
//       });

//       const result = await signAndExecuteTransaction({
//         transaction: tx,
//         chain: 'sui:localnet',
//       });

//       const newCounterId = result.effects?.created?.[0]?.reference?.objectId;

//       if (newCounterId) {
//         setCounterId(newCounterId);
//         setMessage(`Counter created successfully! ID: ${newCounterId}`);
//       } else {
//         setMessage("Failed to create Counter.");
//       }
//     } catch (error) {
//       console.error("Error creating Counter:", error);
//       setMessage("Transaction failed.");
//     }
//   };

//   const incrementCounter = async () => {
//     if (!counterId) {
//       setMessage("No Counter ID found. Create a Counter first.");
//       return;
//     }

//     try {
//       const tx = new Transaction();
//       tx.moveCall({
//         target: `0x53fb0bdca605ba3883d72f012ffd07022501c9db0f58376829918a7317c12f1b::Counter::increment`,
//         arguments: [tx.object(counterId)],
//       });

//       await signAndExecuteTransaction({
//         transaction: tx,
//         options: { showEffects: true, showEvents: true },
//       });

//       setMessage("Counter incremented successfully!");
//     } catch (error) {
//       console.error("Error incrementing Counter:", error);
//       setMessage("Transaction failed.");
//     }
//   };

//   const getCounter = async () => {
//     if (!counterId) {
//       setMessage("No Counter ID found. Create a Counter first.");
//       return;
//     }

//     try {
//       const tx = new Transaction();
//       tx.moveCall({
//         target: `0x53fb0bdca605ba3883d72f012ffd07022501c9db0f58376829918a7317c12f1b::Counter::get_count`,
//         arguments: [tx.object(counterId)],
//       });

//       const result = await signAndExecuteTransaction({
//         transaction: tx,
//         options: { showEffects: true, showEvents: true },
//       });

//       const currentCount = result.effects?.events?.[0]?.parsedJson?.value || null;
//       setCount(currentCount);
//       setMessage(`Counter value: ${currentCount}`);
//     } catch (error) {
//       console.error("Error fetching Counter value:", error);
//       setMessage("Error fetching Counter value.");
//     }
//   };

//   return (
//     <>
//       <Flex
//         position="sticky"
//         px="4"
//         py="2"
//         justify="between"
//         style={{
//           borderBottom: "1px solid var(--gray-a2)",
//         }}
//       >
//         <Box>
//           <Heading>Counter Challenge</Heading>
//         </Box>

//         <Box>
//           <ConnectButton />
//         </Box>
//       </Flex>
//       <Container>
//         <Grid columns="1" gap="6" width="100%">
//           <Card variant="outline">
//             <Heading align="center" size="3">
//               Problem: Counter Management
//             </Heading>
//             <Text align="center" mt="2">
//               Your task is to create a counter, increment it, and fetch its value. Below is the Sui Move module for reference:
//             </Text>
//             <Code as="pre" style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}>
//               {`module 0x0::Counter {
//     use sui::object::{Self, UID};
//     use sui::tx_context::{Self, TxContext};
//     use sui::transfer;
//     use sui::event;

//     struct Counter has key {
//         id: UID,
//         count: u64,
//     }

//     struct CountEvent has copy, drop {
//         value: u64,
//     }

//     entry fun increment(counter: &mut Counter) {
//         counter.count = counter.count + 1;
//     }

//     entry fun get_count(counter: &Counter, _ctx: &TxContext) {
//         event::emit(CountEvent { value: counter.count });
//     }

//     entry fun create_object(ctx: &mut TxContext) {
//         let counter = Counter {
//             id: object::new(ctx),
//             count: 0,
//         };
//         transfer::transfer(counter, tx_context::sender(ctx));
//     }
// }`}
//             </Code>
//           </Card>

//           <Card variant="ghost">
//             <Flex direction="row" align="center" justify="center" gap="4">
//               <Button onClick={createCounter}>Create Counter</Button>
//               <Button onClick={incrementCounter} disabled={!counterId}>
//                 Increment Counter
//               </Button>
//               <Button onClick={getCounter} disabled={!counterId}>
//                 Get Counter Value
//               </Button>
//             </Flex>
//           </Card>

//           <Card variant="surface" mt="4">
//             <Heading size="4">Output:</Heading>
//             {message && <Text>{message}</Text>}
//             {count !== null && <Text>Current Count: {count}</Text>}
//           </Card>
//         </Grid>
//       </Container>
//     </>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Challenge_1 from "./Challenge_1";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/challenge_1" element={<Challenge_1 />} />
      </Routes>
    </Router>
  );
}

export default App;

