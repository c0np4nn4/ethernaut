// import React, { useState } from "react";
// import { ConnectButton, useAccounts, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
// import { Box, Container, Flex, Heading, Button, Text, Card, Code } from "@radix-ui/themes";
// import { Transaction } from "@mysten/sui/transactions";

// function Challenge_1() {
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
//     <Container>
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
//           <Heading>Challenge 1: Counter Management</Heading>
//         </Box>
//         <Box>
//           <ConnectButton />
//         </Box>
//       </Flex>
//       <Container mt="5" pt="2" px="4">
//         <Card variant="outline" mb="4">
//           <Heading size="3">Problem Description</Heading>
//           <Code as="pre" style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}>
//             {`module 0x0::Counter {
//     use sui::object::{Self, UID};
//     use sui::tx_context::{Self, TxContext};
//     use sui::transfer;
//     use sui::event;

//     struct Counter has key {
//         id: UID,
//         count: u64,
//     }

//     entry fun increment(counter: &mut Counter) {
//         counter.count = counter.count + 1;
//     }

//     entry fun create_object(ctx: &mut TxContext) {
//         let counter = Counter {
//             id: object::new(ctx),
//             count: 0,
//         };
//         transfer::transfer(counter, tx_context::sender(ctx));
//     }
// }`}
//           </Code>
//         </Card>

//         <Flex direction="row" align="center" justify="center" gap="4">
//           <Button onClick={createCounter}>Create Counter</Button>
//           <Button onClick={incrementCounter} disabled={!counterId}>
//             Increment Counter
//           </Button>
//           <Button onClick={getCounter} disabled={!counterId}>
//             Get Counter Value
//           </Button>
//         </Flex>

//         <Box mt="4">
//           {message && <Text>{message}</Text>}
//           {count !== null && <Text>Current Count: {count}</Text>}
//         </Box>
//       </Container>
//     </Container>
//   );
// }

// export default Challenge_1;

import React, { useState } from "react";
import { useSignAndExecuteTransaction, useAccounts } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { decodeTransactionFromBytes } from "./utils";

function Challenge_1() {
  const accounts = useAccounts();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [message, setMessage] = useState<string | null>(null);

  const PACKAGE = "0x53fb0bdca605ba3883d72f012ffd07022501c9db0f58376829918a7317c12f1b";

  const createCounter = async () => {
    if (!accounts || accounts.length === 0) {
      setMessage("Please connect your wallet.");
      return;
    }

    const base64Data = "AAAAAQBT+wvcpgW6OIPXLwEv/QcCJQHJ2w9YN2gpkYpzF8EvGwdDb3VudGVyDWNyZWF0ZV9vYmplY3QAALMIeYehdp+oU/XSvd6tZBTKSw9/F8H4kyk373QQ3LvFAQf0uSCJorZZ+oCYNwZSaGKHd0LCM1JSKPCBfihPLFjbHgAAAAAAAAAg4JOHSbi0D5c00ShJZ1ScE+yNCilLRSbfAqiIzPBmDbKzCHmHoXafqFP10r3erWQUyksPfxfB+JMpN+90ENy7xegDAAAAAAAA8FlCAAAAAAAA";

    const decodedTransaction = decodeTransactionFromBytes(base64Data);
    console.log("Decoded Transaction:", decodedTransaction);

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE}::Counter::create_object`,
        arguments: [],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
        chain: "sui:localnet",
      });

      console.log(result);

      const newCounterId = result.effects?.created?.[0]?.reference?.objectId;

      setMessage(
        newCounterId
          ? `Counter created successfully! ID: ${newCounterId} `
          : "Failed to create Counter."
      );
    } catch (error) {
      setMessage("Transaction failed.");
      console.error(error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "#FFFFFF",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#FFF" }}>
        🔢 Challenge 1: Counter Management
      </h1>

      <pre
        style={{
          backgroundColor: "#1E1E2F",
          padding: "1.5rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "800px",
          lineHeight: "1.6",
          overflowX: "auto",
          fontFamily: "'Fira Code', monospace",
          color: "#AAB2D0",
          fontSize: "12px"
        }}
      >
        {
          `
    module 0x0::Counter {
    use sui:: object:: { Self, UID };
    use sui:: tx_context:: { Self, TxContext };
    use sui:: transfer;
    use sui:: event;

    /// Counter Struct
    struct Counter has key {
        id: UID,
          count: u64,
    }

    /// Event to emit the counter value
    struct CountEvent has copy, drop {
        value: u64,
    }

    /// Increment the counter
    entry fun increment(counter: & mut Counter) {
        counter.count = counter.count + 1;
      }

    /// Get the current counter value (emit an event)
    entry fun get_count(counter: & Counter, _ctx: & TxContext) {
        event:: emit(CountEvent { value: counter.count });
      }

    /// Event emitted for validation success
    struct ValidationEvent has copy, drop {
        message: vector<u8>, // Example message like "pass"
    }

    /// Create a new Counter object and transfer ownership to the sender
    entry fun create_object(ctx: & mut TxContext) {
        let counter = Counter {
          id: object:: new(ctx),
            count: 0,
        };
      transfer:: transfer(counter, tx_context:: sender(ctx));
    }

    /// Validate the Counter object
    entry fun validate_object(counter: & Counter, _ctx: & TxContext) {
      if (counter.count > 5) {
        event:: emit(ValidationEvent { message: b"pass" });
      } else {
        event:: emit(ValidationEvent { message: b"fail, count must be greater than 5" });
        /*
        abort 1 // Validation failed
        */
      }
    }
  }
  `
        }
      </pre>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button
          onClick={createCounter}
          style={{
            backgroundColor: "#6C63FF",
            color: "#FFF",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            fontWeight: "600",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          Create Counter
        </button>
      </div>

      {message && (
        <div
          style={{
            marginTop: "2rem",
            backgroundColor: "#1E1E2F",
            color: message.includes("successfully") ? "#A3E635" : "#F7768E",
            padding: "1rem",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: "500",
            maxWidth: "800px",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default Challenge_1;

