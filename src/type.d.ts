import { Moment } from "moment";

interface IAmortizationScheduleItemByYear {
  id: number;
  year: number;
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

type AmortizationScheduleItemState = {
  amortizationScheduleItems: IAmortizationScheduleItemByYear[];
};

type AmortizationScheduleAction = {
  type: string;
  payload?:  LoanDetails | IAmortizationScheduleItem;
};

type DispatchType = (args: AmortizationScheduleAction) => AmortizationScheduleAction;

interface State {
  amortizationScheduleItems: IAmortizationScheduleItemByYear[];
  showTable: boolean;
  interestMap: Map<number, number>;
  emiMap: Map<number, number>;
  extraPaymentMap: Map<number, number>;
  loanDet: LoanDetails
}