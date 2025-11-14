import React, { useState } from "react";
import { Submission } from "./Modal/Submission";
import { Success } from "./Modal/Success";
import { WaitForTransactionReceiptReturnType } from "viem";
import { Failure } from "./Modal/Failure";

export type SuccessData = {
  amount: bigint;
  receipt: WaitForTransactionReceiptReturnType;
};

export type FailureData = {
  amount: bigint;
  receipt?: WaitForTransactionReceiptReturnType;
  message: string;
};

export type SubmissionData = {
  amount: string;
};

export type WithdrawModalProps = {
  closeModal: () => void;
  submissionData: SubmissionData;
};

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  closeModal,
  submissionData,
}: WithdrawModalProps) => {
  const [successData, setSuccessData] = useState<SuccessData | undefined>();
  const [failureData, setFailureData] = useState<FailureData | undefined>();

  const onSuccess = (data: SuccessData) => {
    setSuccessData(data);
  };

  const onFailure = (data: FailureData) => {
    setFailureData(data);
  };

  if (successData) {
    return <Success closeModal={closeModal} data={successData} />;
  }

  if (failureData) {
    return <Failure data={failureData} closeModal={closeModal} />;
  }

  return (
    <Submission
      onSuccess={onSuccess}
      onFailure={onFailure}
      closeModal={closeModal}
      submissionData={submissionData}
    />
  );
};
