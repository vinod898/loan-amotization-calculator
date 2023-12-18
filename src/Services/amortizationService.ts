import { getDocs, collection, query, where, and, DocumentData, Query } from 'firebase/firestore';
import { db } from '../Config/firebase-config';
import { AmortizationData } from '../Domain/AmortizationData';

const amortizationCollectionref = collection(db, "Amortization")

export const getAmartizationData = async (dbQuery: Query<DocumentData, DocumentData>): Promise<AmortizationData[]> => {
    let amartizationDataList: AmortizationData[] = [] as AmortizationData[];
    try {
        const data = await getDocs(dbQuery);
        data.docs
            .map(doc => {
                const { userId, type, loanDetails, interestMap, emiMap, extraPaymentMap } = doc.data();
                const amartizationData: AmortizationData = {
                    emiMap, extraPaymentMap, id: doc.id, interestMap, loanDetails, type, userId
                }
                amartizationDataList.push(amartizationData);
            });
    } catch (error) {
        console.log(error)
    }
    return amartizationDataList;
}

export const getAmartizationActualDataByUserId = async (userId: string): Promise<AmortizationData[]> => {
    console.log({ userId })
    const dbQuery = query(amortizationCollectionref,
        where('userId', '==', userId),
        where('type', '==', "actual")
    );
    return await getAmartizationData(dbQuery)
}

export const getAmartizationForeCastDataByUserId = async (userId: string): Promise<AmortizationData[]> => {
    const dbQuery = query(amortizationCollectionref,
        where('userId', '==', userId),
        where('type', '==', "foreCast")
    );
    return await getAmartizationData(dbQuery)
}
