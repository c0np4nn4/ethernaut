import { bcs, fromBase64 } from "@mysten/bcs";

// BCS에서 사용하는 Transaction 구조체 정의
const UID = bcs.fixedArray(32, bcs.u8());

export const TransactionBCS = bcs.struct("Transaction", {
  digest: bcs.string(),
  transaction: bcs.struct("TransactionData", {
    data: bcs.struct("Data", {
      messageVersion: bcs.string(),
      transaction: bcs.struct("ProgrammableTransaction", {
        kind: bcs.string(),
        inputs: bcs.vector(bcs.string()),
        transactions: bcs.vector(
          bcs.struct("MoveCall", {
            package: bcs.string(),
            module: bcs.string(),
            function: bcs.string(),
          })
        ),
      }),
      sender: bcs.string(),
      gasData: bcs.struct("GasData", {
        payment: bcs.vector(
          bcs.struct("Payment", {
            objectId: bcs.string(),
            version: bcs.u64(),
            digest: bcs.string(),
          })
        ),
        owner: bcs.string(),
        price: bcs.string(),
        budget: bcs.string(),
      }),
    }),
    txSignatures: bcs.vector(bcs.string()),
  }),
  effects: bcs.struct("TransactionEffects", {
    messageVersion: bcs.string(),
    status: bcs.struct("Status", {
      status: bcs.string(),
    }),
    executedEpoch: bcs.string(),
    gasUsed: bcs.struct("GasUsed", {
      computationCost: bcs.u64(),
      storageCost: bcs.u64(),
      storageRebate: bcs.u64(),
      nonRefundableStorageFee: bcs.u64(),
    }),
    modifiedAtVersions: bcs.vector(
      bcs.struct("ModifiedAtVersion", {
        objectId: UID,
        sequenceNumber: bcs.string(),
      })
    ),
    transactionDigest: bcs.string(),
    created: bcs.vector(
      bcs.struct("Created", {
        owner: bcs.struct("Owner", {
          AddressOwner: bcs.string(),
        }),
        reference: bcs.struct("Reference", {
          objectId: UID,
          version: bcs.u64(),
          digest: bcs.string(),
        }),
      })
    ),
    mutated: bcs.vector(
      bcs.struct("Mutated", {
        owner: bcs.struct("Owner", {
          AddressOwner: bcs.string(),
        }),
        reference: bcs.struct("Reference", {
          objectId: UID,
          version: bcs.u64(),
          digest: bcs.string(),
        }),
      })
    ),
    gasObject: bcs.struct("GasObject", {
      owner: bcs.struct("Owner", {
        AddressOwner: bcs.string(),
      }),
      reference: bcs.struct("Reference", {
        objectId: UID,
        version: bcs.u64(),
        digest: bcs.string(),
      }),
    }),
    dependencies: bcs.vector(bcs.string()),
  }),
});

// Base64 디코딩 및 BCS 디코딩 로직
export function decodeTransactionFromBytes(base64Bytes: string) {
  try {
    // 1. Base64 디코딩
    const decodedBytes = fromBase64(base64Bytes);
    console.log("Decoded Base64 Bytes:", decodedBytes);

    // 2. BCS 역직렬화
    const decodedTransaction = TransactionBCS.parse(decodedBytes);
    console.log("Decoded Transaction Object:", decodedTransaction);

    return decodedTransaction;
  } catch (error) {
    console.error("Error decoding transaction:", error);
    return null;
  }
}

// 테스트용 직렬화 함수
export function encodeTransactionToBytes(transaction: any) {
  try {
    const encodedBytes = TransactionBCS.serialize(transaction).toBytes();
    console.log("Encoded Transaction Bytes:", encodedBytes);

    return encodedBytes;
  } catch (error) {
    console.error("Error encoding transaction:", error);
    return null;
  }
}

