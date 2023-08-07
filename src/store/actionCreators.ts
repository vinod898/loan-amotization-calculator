import * as actionTypes from "./actionTypes";

export function addArticle(article: IAmortizationScheduleItem) {
  const action: AmortizationScheduleAction = {
    type: actionTypes.ADD_ARTICLE,
    article
  };

  return simulateHttpRequest(action);
}

export function removeArticle(article: IAmortizationScheduleItem) {
  const action: AmortizationScheduleAction = {
    type: actionTypes.REMOVE_ARTICLE,
    article
  };
  return simulateHttpRequest(action);
}

export function simulateHttpRequest(action: AmortizationScheduleAction) {
  return (dispatch: DispatchType) => {
    setTimeout(() => {
      dispatch(action);
    }, 500);
  };
}
