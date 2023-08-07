interface IAmortizationScheduleItem {
  id : number;
  month: string;
  beginingBalance:string;
  endingBalance:string;
  payment: string;
  principalPaid: string;
  interestPaid: string;
  extraPayment: string;
  interestRateMnth: string;
}

type AmortizationScheduleItemState = {
  amortizationScheduleItems: IAmortizationScheduleItem[];
};

type AmortizationScheduleAction = {
  type: string;
  article: IAmortizationScheduleItem;
};

type DispatchType = (args: AmortizationScheduleAction) => AmortizationScheduleAction;
