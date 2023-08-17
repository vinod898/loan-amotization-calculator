// store.ts
import { createStore, applyMiddleware, combineReducers, Store } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import reducer from './reducer';
import { AmortizationScheduleAction, IAmortizationScheduleItemByYear } from '../type'; // Adjust the import path
import { LoanDetails } from '../Domain/FormField';

export interface RootState {
  amortization: {
    amortizationScheduleItems: IAmortizationScheduleItemByYear[];
    showTable: boolean;
    interestMap : Map<number, number>;
    emiMap : Map<number, number>;
    extraPaymentMap : Map<number, number>;
    loanDet: LoanDetails;
  };
}

const rootReducer = combineReducers({
  amortization: reducer,
});

const store: Store<
  RootState,
  AmortizationScheduleAction
> & {
  dispatch: ThunkDispatch<RootState, any, AmortizationScheduleAction>;
} = createStore(rootReducer, applyMiddleware(thunk));

export default store;