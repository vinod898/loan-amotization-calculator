// reducer.ts
import {
  GET_AMORTIZATION_ITEMS,
  UPDATE_AMORTIZATION_ITEM,
  UPDATE_LOAN_DETAILS
} from './actionTypes';
import {
  AmortizationScheduleAction,
  IAmortizationScheduleItem,
  IAmortizationScheduleItemByYear,
  State
} from '../type'; // Adjust the import path
import { calcAmortizationScheduleItems } from '../utils/utils';
import { LoanDetails } from '../Domain/FormField';



const initialState: State = {
  amortizationScheduleItems: [],
  showTable: false,
  interestMap: new Map<number, number>(),
  emiMap: new Map<number, number>(),
  extraPaymentMap: new Map<number, number>(),
  loanDet: {} as LoanDetails,
};

const reducer = (state: State = initialState, action: AmortizationScheduleAction) => {

  let amortizationScheduleItems: IAmortizationScheduleItemByYear[] = [];
  switch (action.type) {
    case UPDATE_LOAN_DETAILS:
      console.log('in UPDATE_LOAN_DETAILS reducer')
      const loanDet = action.payload as LoanDetails;
      return {
        ...state,
        loanDet
      };
    case GET_AMORTIZATION_ITEMS:
      amortizationScheduleItems = calcAmortizationScheduleItems(state);
      console.log('in GET_AMORTIZATION_ITEMS reducer')
      return {
        ...state,
        amortizationScheduleItems,
        showTable: true,
      };
    case UPDATE_AMORTIZATION_ITEM:
      const { id, extraPayment, payment, interestRateMnth } = (action.payload as IAmortizationScheduleItem)
      // update map values
      let matchFound = false;
      state.amortizationScheduleItems
        .forEach((yearItem: IAmortizationScheduleItemByYear) => {
          yearItem.monthHistory.forEach(
            (monthItem: IAmortizationScheduleItem) => {
              const { id: mid,
                extraPayment: mExtraPayment,
                payment: mPayment,
                interestRateMnth: mInterestRateMnth
              } = monthItem;
              const condition = matchFound === true ||
                (id === mid &&
                  (mExtraPayment !== extraPayment ||
                    mPayment !== payment ||
                    mInterestRateMnth !== interestRateMnth))
              if (condition) {
                // update map values
                state.emiMap.set(mid, payment);
                state.interestMap.set(mid, interestRateMnth);
                if (matchFound === false)
                  state.extraPaymentMap.set(id, extraPayment);
                matchFound = true;
                console.log('map values changed...')
              }

            }
          )
        })
      amortizationScheduleItems = [];
      return {
        ...state,
        amortizationScheduleItems,
      };
    default:
      return state;
  }
};

export default reducer;
