// reducer.ts
import { FETCH_AMORTIZATION_ITEMS, UPDATE_AMORTIZATION_ITEM } from './actionTypes';
import { IAmortizationScheduleItemByYear } from '../type'; // Adjust the import path

interface State {
  amortizationScheduleItems: IAmortizationScheduleItemByYear[];
  showTable: boolean;
}

const initialState: State = {
  amortizationScheduleItems: [],
  showTable: false,
};

const reducer = (state: State = initialState, action: any) => {
  switch (action.type) {
    case FETCH_AMORTIZATION_ITEMS:
      console.log('hi.....')
      return {
        ...state,
        amortizationScheduleItems: action.payload,
        showTable: true,
      };
    case UPDATE_AMORTIZATION_ITEM:
      const updatedItems = state.amortizationScheduleItems.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
      return {
        ...state,
        amortizationScheduleItems: updatedItems
      };
    default:
      return state;
  }
};

export default reducer;
