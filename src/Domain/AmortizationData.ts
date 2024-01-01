import { GraphDetails, IAmortizationScheduleItemByYear } from "../type";
import { LoanDetails } from "./FormField";

export interface AmortizationMetaData {
    id: string;
    userId: string;
    type: string;
    loanDetails: LoanDetails;
    interestMap: Map<number, number>,
    emiMap: Map<number, number>,
    extraPaymentMap: Map<number, number>,
}

export interface EnrichedMetaData extends AmortizationMetaData {

    amortizationScheduleItemsByYear ?: IAmortizationScheduleItemByYear[],
    graphDetails ?: GraphDetails,

}
