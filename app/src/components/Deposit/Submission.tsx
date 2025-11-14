import { useEffect } from "react";
import { Spinner } from "../Spinner";
import { FaCheckCircle } from "react-icons/fa";
import { useDeposit } from "../../hooks/deposit";
import { parseEther } from "viem";
import { type SuccessData } from "./Success";
import { type FailureData } from "./Failure";

type SubmissionProps = {
  submissionData: { amount: string };
  onSuccess: (data: SuccessData) => void;
  onFailure: (data: FailureData) => void;
};

export const Submission: React.FC<SubmissionProps> = ({
  submissionData,
  onSuccess,
  onFailure,
}) => {

  const {step, deposit} = useDeposit();

  useEffect(() => {
    if(!deposit) return;  
    deposit(parseEther(submissionData.amount))
     .then((data) => {
        setTimeout(() => {
          onSuccess(data);
        }, 1000);
      })
    .catch(onFailure);

  }, [deposit]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="glass rounded-3xl p-8 w-full max-w-md shadow-xl text-center relative">
        
        <h3 className="text-xl font-semibold mb-6 text-gray-900">
          Processing Deposit
        </h3>

        <div className="space-y-5 text-left">
          {/* Firma */}
          <div className="flex items-center justify-between bg-white/60 p-3 rounded-xl">
            <div>
              <p className="font-medium text-gray-800">Waiting for signature</p>
              <p className="text-sm text-gray-600">Confirm transaction in your wallet</p>
            </div>
            {(step === "idle" || step === "signing")
              ? <Spinner className="h-5 w-5" />
              : <FaCheckCircle className="h-5 w-5 text-indigo-600" />}
          </div>

          <div className="flex items-center justify-between bg-white/60 p-3 rounded-xl">
            <div>
              <p className="font-medium text-gray-800">Processing on Ethereum network</p>
              <p className="text-sm text-gray-600">
                {step === "done" ? "The deposit has been sent!" : "Waiting for confirmation..."}
              </p>
            </div>
            {step == "done"
              ? <FaCheckCircle className="h-5 w-5 text-indigo-600" />
              : <Spinner className="h-5 w-5" />}
          </div>
        </div>
      </div>
    </div>
  );
};
