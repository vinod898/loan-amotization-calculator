import { Moment } from "moment";
import { User } from "./Domain/user";
import { AmortizationMetaData } from "./Domain/AmortizationData";

interface IAmortizationScheduleItemByYear {
  id: number;
  beginingBalance: number;
  endingBalance: number;
  totalEmiPayMent: number;
  totalPrincipalPaid: number;
  totalInterestPaid: number;
  totalExtraPayment: number;
  finacialYear: string;
  monthHistory: IAmortizationScheduleItem[]
}

interface IAmortizationScheduleItem {
  id: number;
  month: string;
  currentDate: Moment;
  beginingBalance: number;
  endingBalance: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  extraPayment: number;
  interestRateMnth: number;
}

type GraphDetails = {
  completedMonths : number;
  remainingMonths : number;
  interest: number;
  principal: number;
}


type RootState  = {
  amortizationMetaData: AmortizationMetaData,
  person: User
}


type AmortizationScheduleItemState = {
  amortizationScheduleItems: IAmortizationScheduleItemByYear[];
};

type AmortizationScheduleAction = {
  type: string;
  payload: User | AmortizationMetaData;
};

type DispatchType = (args: AmortizationScheduleAction) => AmortizationScheduleAction;
