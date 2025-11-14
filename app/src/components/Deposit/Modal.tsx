
import { useState } from "react";
import { Submission } from "./Submission";
import { Success, type SuccessData } from "./Success";
import { Failure, type FailureData } from "./Failure";

export type SubmissionData = {
  amount: string;
};

export type DepositModalProps = {
  submissionData: SubmissionData;
  closeModal: () => void;
};

export const DepositModal: React.FC<DepositModalProps> = ({
  submissionData,
  closeModal,
}: DepositModalProps) => {

  const [successData, setSuccessData] = useState<SuccessData | undefined>();
  const [failureData, setFailureData] = useState<FailureData | undefined>();

  const onSuccess = (data: SuccessData) => {
    setSuccessData(data);
  };
  const onFailure = (data: FailureData) => {
    setFailureData(data);
  };

  if (successData) return <Success closeModal={closeModal} successData={successData} />;
  if (failureData) return <Failure closeModal={closeModal} failureData={failureData} />

  return (
    <Submission
      submissionData={submissionData}
      onSuccess={onSuccess}
      onFailure={onFailure}
    />
  );
};


