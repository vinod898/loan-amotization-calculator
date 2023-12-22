import moment from 'moment';
import { IAmortizationScheduleItemByYear, IAmortizationScheduleItem } from '../type';
import { AmortizationMetaData } from '../Domain/AmortizationData';
export const calcAmortizationScheduleItems = (amortizationMetaData: AmortizationMetaData): AmortizationMetaData => {

    const { emiMap, extraPaymentMap, interestMap, loanDetails: { interestRate, principal, startDate, tenure } } = amortizationMetaData;
    let initialEmi = calculateEmi(interestRate, tenure, principal)
    let currentDate = moment(startDate);
    let endingBalance: number = principal;
    const amortizationScheduleItemsByYearMap: Map<string, IAmortizationScheduleItem[]> = new Map();

    for (let index = 1; endingBalance > 0; index++) {
        let extraPaymentForThisInstallment: number = extraPaymentMap?.get(index) ?? 0;
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
        const currentYear = currentDate.get('M') < 3 ? currentDate.get('year') - 1 : currentDate.get('year');
        const finacialYear = `${currentYear} - ${currentYear + 1}`;


        if (!amortizationScheduleItemsByYearMap.has(finacialYear)) {
            amortizationScheduleItemsByYearMap.set(finacialYear, []);
        }
        const amortizationScheduleItems: IAmortizationScheduleItem[] = amortizationScheduleItemsByYearMap.get(finacialYear) || [];
        amortizationScheduleItems.push(item);
        amortizationScheduleItemsByYearMap.set(finacialYear, amortizationScheduleItems);
        // reArrangeSchedule(item, amortizationMetaData)
    }
    let yearIndex = 1;
    /// calculate yearly aggregations
    if (!amortizationMetaData?.amortizationScheduleItemsByYear) {
        amortizationMetaData.amortizationScheduleItemsByYear = []
    }
    for (const [finacialYear, amortizationScheduleItems] of amortizationScheduleItemsByYearMap) {

        let beginingBalance = 0;
        let endingBalance = 0;
        let totalEmiPayMentByYear = 0;
        let totalPrincipalPaidByYear = 0;
        let totalInterestPaidByYear = 0;
        let totalExtraPayPaidByYear = 0;


        amortizationScheduleItems.forEach((item, i) => {
            if (i === 0) {
                beginingBalance = item.beginingBalance
            }
            if (i === (amortizationScheduleItems.length - 1)) {
                endingBalance = item.endingBalance
            }
            totalEmiPayMentByYear += item.payment;
            totalPrincipalPaidByYear += item.principalPaid;
            totalInterestPaidByYear += item.interestPaid;
            totalExtraPayPaidByYear += item.extraPayment;

        })
        let yearItem: IAmortizationScheduleItemByYear = {
            id: yearIndex,
            year: 0,
            beginingBalance: beginingBalance,
            endingBalance: endingBalance,
            totalEmiPayMent: totalEmiPayMentByYear,
            totalPrincipalPaid: totalPrincipalPaidByYear,
            totalInterestPaid: totalInterestPaidByYear,
            totalExtraPayment: totalExtraPayPaidByYear,
            finacialYear: finacialYear,
            monthHistory: amortizationScheduleItems
        }
        amortizationMetaData.amortizationScheduleItemsByYear.push(yearItem);

        yearIndex++;

    }

    // calculate graph details
    if (!amortizationMetaData?.graphDetails) {
        amortizationMetaData.graphDetails = {
            completedMonths: 0,
            remainingMonths: 0,
            interest: 0,
            principal: 0
        };
    }

    let totalMonths = 0;
    let totalInterest = 0;
    const emiPaidMonths: number = moment().diff(moment(amortizationMetaData.loanDetails.startDate), 'months');

    amortizationMetaData.amortizationScheduleItemsByYear.forEach(yearItem => {
        totalInterest += yearItem.totalInterestPaid;
        totalMonths += yearItem.monthHistory.length
    })
    const remaining = (totalMonths - emiPaidMonths);
    const completed = (amortizationMetaData.loanDetails.tenure * 12) - remaining;

    amortizationMetaData.graphDetails = {
        ...amortizationMetaData.graphDetails,
        completedMonths: completed,
        interest: totalInterest,
        principal: amortizationMetaData.loanDetails.principal,
        remainingMonths: remaining
    }



    return amortizationMetaData;
}




const calculateEmi = (interestRate: number, loanPeriod: number, loanAmount: number) => {
    const roi: number = interestRate / 12 / 100;
    const nom: number = 12 * loanPeriod;
    const rateVariable: number = Math.pow(1 + roi, nom);
    return Math.round(
        loanAmount * roi * (rateVariable / (rateVariable - 1))
    );
}





