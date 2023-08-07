import moment from 'moment';
import { LoanDetails } from "../Domain/FormField";

export const calcAmortizationScheduleItems = (loanDet: LoanDetails) => {

    const amortizationScheduleItems: IAmortizationScheduleItem[] = [];
    const principal = loanDet.principal as number;
    const interestRate = loanDet.interestRate as number;
    const tenure = loanDet.tenure as number;
    const startDate = loanDet.startDate as Date;
    let extraPaymentForThisInstallment = loanDet.extraPaymentForThisInstallment as number ?? 0;

    const currentDate = moment(startDate);
    let endingBalance: number = principal as number;

    for (let index = 1; endingBalance > 0; index++) {
        const date: string = currentDate.add(1, 'M').format('MM-YYYY');
        let emi: number = calculateEmi(interestRate, tenure, principal);
        const beginingBalance: number = endingBalance;
        // calculate roi
        const roi = interestRate / 12 / 100;
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
            emi = calculateEmi(interestRate, tenure, principal);
            principleAmount = emi - interestAmount;
        }
        endingBalance = beginingBalance - (principleAmount + extraPaymentForThisInstallment);

        // check pay for last installment
        if (endingBalance < 0) {
            extraPaymentForThisInstallment = (beginingBalance - principleAmount);
            endingBalance = 0;
        }
        const item: IAmortizationScheduleItem = {
            id : index,
            month: date,
            beginingBalance: AMOUNT_FORMAT.format(Math.round(beginingBalance)) ,
            endingBalance: AMOUNT_FORMAT.format(Math.round(endingBalance)),
            payment:AMOUNT_FORMAT.format(Math.round(emi)) ,
            principalPaid: AMOUNT_FORMAT.format(Math.round(principleAmount)) ,
            interestPaid: AMOUNT_FORMAT.format(Math.round(interestAmount)),
            extraPayment: AMOUNT_FORMAT.format(Math.round(extraPaymentForThisInstallment)),
            interestRateMnth:INTERESTRATE_FORMAT.format(interestRate) 
        }
        amortizationScheduleItems.push(item)
    }
    return amortizationScheduleItems;
}


// const calculateAmortization = () => {
//     let { loanAmount, interestRate, loanPeriod, emiStartDate } = loanDetailsFormData;
//     let { emi, totalInterest, amortization, totalEarlyPayments, totalPrinciple, optionArray } = loanOutputDetails;
//     const selectedYear = $('#myselect').val();
//     let emiDate = emiStartDate != 0 ? new Date(emiStartDate) : new Date();

//     emi = calculateEmi(interestRate, loanPeriod, loanAmount)

//     let endingBalance = loanAmount;
//     // for (let i = 0; endingBalance > emi; i++) {
//     for (let i = 0; endinegBalanc > 0; i++) {

//         emiDate = new Date(emiDate.setMonth(emiDate.getMonth() + 1));
//         const currentYear = emiDate.getFullYear();
//         const value = emiDate.getMonth() < 3 ? `${currentYear - 1}-${currentYear}` : `${currentYear}-${currentYear + 1}`;
//         const option = `<option value="${value}" ${selectedYear == value ? 'selected' : ''}> ${value}</option>`;
//         if (!optionArray.includes(option)) optionArray.push(option);
//         let { extraPaymentForThisInstallment, interestRateforThisMonth, emiThisMonth } = getValue(i, interestRate, emi);

//         //assing new values of emi, interestRate
//         emi = emiThisMonth;
//         interestRate = interestRateforThisMonth;
//         const beginingBalance = endingBalance;

//         // calculate roi
//         const roi = interestRate / 12 / 100;
//         // calculate interest_amount
//         const interestAmount = (beginingBalance - extraPaymentForThisInstallment) * roi;
//         if(endingBalance+interestAmount < emi){
//             emi = endingBalance+interestAmount;
//         }
//         // calculate principle_amount
//         let principleAmount = emi - interestAmount;
//         // check interest is morethan emi and adjust
//         if (principleAmount < 0) {
//             // adjust emi
//             emi = calculateEmi(interestRate, loanPeriod, loanAmount);
//             principleAmount = emi - interestAmount;
//         }
//         endingBalance = beginingBalance - (principleAmount + extraPaymentForThisInstallment);

//         // check pay for last installment
//         if (endingBalance < 0) {
//             extraPaymentForThisInstallment = (beginingBalance - principleAmount);
//             endingBalance = 0;
//         }
//         totalPayMent = extraPaymentForThisInstallment + emi;
//         if (selectedYear == 'select year' || validateDate(emiDate, selectedYear)) {
//             totalInterest += interestAmount;
//             totalPrinciple += principleAmount;
//             totalEarlyPayments += extraPaymentForThisInstallment;

//             totalPayMentString = extraPaymentForThisInstallment > 0 ?
//                 `${AMOUNT_FORMAT.format(Math.round(emi))} + ${AMOUNT_FORMAT.format(Math.round(extraPaymentForThisInstallment))}` :
//                 AMOUNT_FORMAT.format(Math.round(emi));

//             amortization.push({
//                 id: i,
//                 month: i + 1,
//                 emiDate: emiDate.toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                 }),
//                 beginingBalance: AMOUNT_FORMAT.format(Math.round(beginingBalance)),
//                 endingBalance: AMOUNT_FORMAT.format(Math.round(endingBalance)),
//                 totalPayMent: totalPayMentString,
//                 principleAmount: AMOUNT_FORMAT.format(Math.round(principleAmount)),
//                 interestAmount: AMOUNT_FORMAT.format(Math.round(interestAmount)),
//                 extraPayment: AMOUNT_FORMAT.format(Math.round(extraPaymentForThisInstallment)),
//                 interestRate: INTERESTRATE_FORMAT.format(interestRate),
//                 emi: AMOUNT_FORMAT.format(Math.round(emi))
//             });
//         }

//     }
//     loanOutputDetails = {
//         ...loanOutputDetails,
//         emi,
//         totalInterest: AMOUNT_FORMAT.format(Math.round(totalInterest)),
//         totalEarlyPayments: AMOUNT_FORMAT.format(Math.round(totalEarlyPayments)),
//         totalPrinciple: AMOUNT_FORMAT.format(Math.round(totalPrinciple) + Math.round(endingBalance))
//     }
//     renderChart(Math.round(totalPrinciple + (selectedYear == 'select year' ? endingBalance: 0) + totalEarlyPayments), totalInterest);

//     console.log(loanOutputDetails)

// }

const calculateEmi = (interestRate: number, loanPeriod: number, loanAmount: number) => {
    const roi: number = interestRate / 12 / 100;
    const nom: number = 12 * loanPeriod;
    const rateVariable: number = Math.pow(1 + roi, nom);
    return Math.round(
        loanAmount * roi * (rateVariable / (rateVariable - 1))
    );
}

const AMOUNT_FORMAT = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const INTERESTRATE_FORMAT = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});


