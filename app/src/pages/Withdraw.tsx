import { Claims } from "../components/Withdraw/Claims";
import { WithdrawForm } from "../components/Withdraw/Form";

export const Withdraw: React.FC = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-15">
      <WithdrawForm />
      <Claims />
    </div>
  );
};
