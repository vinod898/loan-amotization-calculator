// actions.ts
import { Action } from 'redux';
import { FETCH_AMORTIZATION_ITEMS, UPDATE_AMORTIZATION_ITEM } from './actionTypes';
import { AmortizationScheduleAction, IAmortizationScheduleItemByYear } from '../type'; // Adjust the import path
import { calcAmortizationScheduleItems } from '../utils/utils';
import { LoanDetails } from '../Domain/FormField';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './store';

// Define your AppThunk type
type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AmortizationScheduleAction
>;

export const fetchAmortizationItems = (
  loanDet: LoanDetails
): AppThunk<Promise<void>> => async (dispatch) => {
  const fetchedData: IAmortizationScheduleItemByYear[] =
    calcAmortizationScheduleItems(loanDet);
  dispatch({
    type: FETCH_AMORTIZATION_ITEMS,
    payload: fetchedData,
  });
};

export const updateAmortizationItem = (
  updatedItem: IAmortizationScheduleItemByYear
): AppThunk<Promise<void>> => async (dispatch) => {
  // Implement your logic to update the item here
  // Dispatch an action with the updated item
  dispatch({
    type: UPDATE_AMORTIZATION_ITEM,
    payload: updatedItem,
  });
};
