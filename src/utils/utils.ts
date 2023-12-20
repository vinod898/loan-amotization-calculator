import moment from 'moment';
import { IAmortizationScheduleItemByYear, IAmortizationScheduleItem } from '../type';
import { AmortizationMetaData } from '../Domain/AmortizationData';
export const calcAmortizationScheduleItems = (amortizationMetaData: AmortizationMetaData): IAmortizationScheduleItemByYear[] => {

    const { emiMap, extraPaymentMap, interestMap, loanDetails } = amortizationMetaData;
    const amortizationScheduleItemsByYear: IAmortizationScheduleItemByYear[] = [];
    const principal = loanDetails.principal as number;
    const interestRate = loanDetails.interestRate as number;
    const tenure = loanDetails.tenure as number;
    const startDate = loanDetails.startDate as Date;
    let initialEmi = calculateEmi(interestRate, tenure, principal)


    let currentDate = moment(startDate);
    let endingBalance: number = principal as number;



    for (let index = 1; endingBalance > 0; index++) {

        let extraPaymentForThisInstallment: number = extraPaymentMap.get(index) ?? 0;
        let interestRateMnth: number = interestMap?.get(index) ?? interestRate;
        let emi: number = emiMap?.get(index) ?? initialEmi;


        const month: string = currentDate.add(1, 'M').format('MMM-YYYY');
        const beginingBalance: number = endingBalance;
        // calculate roi  
        const roi = interestRateMnth / 12 / 100;
        // calculate interest_amount
        const interestAmount = (beginingBalance - extraPaymentForThisInstallment) * roi;
        if (endingBalance + interestAmount < emi) {
            emi = endingBalance + interestAmount;
        }
        // calculate principle_amount
        let principleAmount = emi - interestAmount;
        // check interest is morethan emi and adjust
        if (principleAmount < 0) {
            // adjust emi
            emi = calculateEmi(interestRateMnth, tenure, principal);
            principleAmount = emi - interestAmount;
        }
        endingBalance = beginingBalance - (principleAmount + extraPaymentForThisInstallment);

        // check pay for last installment
        if (endingBalance < 0) {
            extraPaymentForThisInstallment = (beginingBalance - principleAmount);
            endingBalance = 0;
        }

        const item: IAmortizationScheduleItem = {
            id: index,
            month: month,
            currentDate: currentDate,
            beginingBalance: Math.round(beginingBalance),
            endingBalance: Math.round(endingBalance),
            payment: Math.round(emi),
            principalPaid: Math.round(principleAmount),
            interestPaid: Math.round(interestAmount),
            extraPayment: Math.round(extraPaymentForThisInstallment),
            interestRateMnth: interestRateMnth
        }
        reArrangeSchedule(item, amortizationScheduleItemsByYear)
    }
    return amortizationScheduleItemsByYear;
}




const calculateEmi = (interestRate: number, loanPeriod: number, loanAmount: number) => {
    const roi: number = interestRate / 12 / 100;
    const nom: number = 12 * loanPeriod;
    const rateVariable: number = Math.pow(1 + roi, nom);
    return Math.round(
        loanAmount * roi * (rateVariable / (rateVariable - 1))
    );
}
// eslint-disable-next-line
const AMOUNT_FORMAT = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});
// eslint-disable-next-line
const INTERESTRATE_FORMAT = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});


const reArrangeSchedule = (
    item: IAmortizationScheduleItem,
    amortizationScheduleItemsByYear: IAmortizationScheduleItemByYear[]
) => {
    const {
        beginingBalance,
        endingBalance,
        extraPayment,
        principalPaid,
        payment,
        currentDate,
        interestPaid
    } = item;
    const currentYear = currentDate.get('M') < 3 ? currentDate.get('year') - 1 : currentDate.get('year');
    const finacialYear = `${currentYear} - ${currentYear + 1}`
    const index = amortizationScheduleItemsByYear.findIndex(item => item.year === currentYear);
    let yearItem: IAmortizationScheduleItemByYear = {} as IAmortizationScheduleItemByYear;

    if (index > -1) {
        // get month hiostory list
        yearItem = amortizationScheduleItemsByYear[index];
        // aggregate year values
        yearItem.endingBalance = endingBalance;
        yearItem.totalEmiPayMent += payment;
        yearItem.totalExtraPayment += extraPayment
        yearItem.totalPrincipalPaid += principalPaid;
        yearItem.totalInterestPaid += interestPaid;
        yearItem.finacialYear = finacialYear;
        yearItem.monthHistory.push(item);
    } else {
        yearItem.year = currentYear;
        yearItem.endingBalance = endingBalance;
        yearItem.beginingBalance = beginingBalance;
        yearItem.totalEmiPayMent = payment;
        yearItem.totalExtraPayment = extraPayment;
        yearItem.totalPrincipalPaid = principalPaid;
        yearItem.totalInterestPaid = interestPaid;
        yearItem.finacialYear = finacialYear;
        yearItem.monthHistory = [item];
        amortizationScheduleItemsByYear.push(yearItem)
    }
}


