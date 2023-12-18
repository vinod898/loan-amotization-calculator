import { LoanDetails } from "./FormField";

export interface AmortizationData {
    id: string;
    userId: string;
    type: string;
    loanDetails: LoanDetails;
    interestMap: Map<number, number>,
    emiMap: Map<number, number>,
    extraPaymentMap: Map<number, number>,
}
