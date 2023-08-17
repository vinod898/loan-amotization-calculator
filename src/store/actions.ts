// actions.ts
import {
  GET_AMORTIZATION_ITEMS,
  UPDATE_AMORTIZATION_ITEM,
  UPDATE_LOAN_DETAILS
} from './actionTypes';
import { AmortizationScheduleAction, IAmortizationScheduleItem } from '../type'; // Adjust the import path
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

export const getAmortizationItems = (): AppThunk<Promise<void>> => async (dispatch) => {
  dispatch({
    type:GET_AMORTIZATION_ITEMS ,
    payload: [],
  });
};


export const updateLoadDetails = (
  loanDet: LoanDetails
): AppThunk<Promise<void>> => async (dispatch) => {
  dispatch({
    type: UPDATE_LOAN_DETAILS,
    payload: loanDet,
  });
};

export const updateAmortizationItem = (
  updatedItem: IAmortizationScheduleItem
): AppThunk<Promise<void>> => async (dispatch) => {
  dispatch({
    type: UPDATE_AMORTIZATION_ITEM,
    payload: updatedItem,
  });
};
