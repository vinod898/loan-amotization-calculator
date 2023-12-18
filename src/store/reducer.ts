// reducer.ts
import {
  GET_AMORTIZATION_ITEMS,
  GET_STATE,
  RESET_AMORTIZATION,
  SET_STATE,
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
      const loanDet = action.payload as LoanDetails;
      return {
        ...state,
        loanDet
      };
    case GET_AMORTIZATION_ITEMS:
      amortizationScheduleItems = calcAmortizationScheduleItems(state);
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
              }

            }
          )
        })
      amortizationScheduleItems = [];
      state = {
        ...state,
        amortizationScheduleItems,
      }
      return state;
    case SET_STATE:
     console.log(state)
      return state;
    case GET_STATE:
      return state;
    case RESET_AMORTIZATION:
      return {
        ...state,
        amortizationScheduleItems: [],
        showTable: false,
        interestMap: new Map<number, number>(),
        emiMap: new Map<number, number>(),
        extraPaymentMap: new Map<number, number>(),
        loanDet: {}
      };
    default:
      return state;
  }
};

export default reducer;
// Serialize a Map to a JSON-safe object
const serializeMap = (map: Map<number, number>) => {
  // Convert the Map to an array of key-value pairs
  const serializedMap = Array.from(map);
  return JSON.stringify(serializedMap);
}

// Deserialize a JSON-safe object back to a Map
const deserializeMap = (serializedStr: string): Map<number, number> => {
  const serializedMap = JSON.parse(serializedStr);
  return new Map<number, number>(serializedMap);
};

