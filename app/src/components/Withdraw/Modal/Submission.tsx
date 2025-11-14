import React, { useEffect } from "react";
import { FailureData, SubmissionData, SuccessData } from "../Modal";
import { Spinner } from "../../Spinner";
import { parseEther } from "viem";
import { useWithdraw, WithdrawStep } from "../../../hooks/withdraw";
import { FaCheckCircle } from "react-icons/fa";

export type SubmissionModalProps = {
  onSuccess: (data: SuccessData) => void;
  onFailure: (data: FailureData) => void;
  submissionData: SubmissionData;
  closeModal: () => void;
};

export const Submission: React.FC<SubmissionModalProps> = ({
  onSuccess,
  onFailure,
  submissionData,
}: SubmissionModalProps) => {
  const { withdraw, step } = useWithdraw();

  function loadingIcon(loadingSteps: WithdrawStep[]) {
    if (loadingSteps.includes(step)) return <Spinner className="w-6 h-6" />;
    return <FaCheckCircle className="h-5 w-5 text-indigo-600" />;
  }

  useEffect(() => {
    if (!withdraw) return;

    withdraw(parseEther(submissionData.amount))
      .then((data) => {
        setTimeout(() => {
          onSuccess(data as SuccessData);
        }, 1000);
      })
      .catch(onFailure);
  }, [withdraw, submissionData, onSuccess, onFailure]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="glass rounded-3xl p-8 w-full max-w-md shadow-xl text-center relative">
        <h3 className="text-xl font-semibold mb-6 text-gray-900">
          Processing Withdrawal
        </h3>

        <div className="space-y-5 text-left">
          <div className="flex items-center justify-between bg-white/60 p-3 rounded-xl">
            <div>
              <p className="font-medium text-gray-800">Waiting for signature</p>
              <p className="text-sm text-gray-600">
                Confirm transaction in your wallet
              </p>
            </div>

            {loadingIcon(["init"])}
          </div>

          <div className="flex items-center justify-between bg-white/60 p-3 rounded-xl">
            <div>
              <p className="font-medium text-gray-800">
                Waiting for confirmation
              </p>
              <p className="text-sm text-gray-600">
                Processing on Ethrex L2 network
              </p>
            </div>

            {loadingIcon(["init", "waiting-receipt"])}
          </div>
        </div>

        <div className="mt-8 text-gray-600 text-sm">
          <p>Do not close this window until the transaction completes.</p>
        </div>
      </div>
    </div>
  );
};
