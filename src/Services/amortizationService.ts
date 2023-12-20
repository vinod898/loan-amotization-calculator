import { getDocs, collection, query, where, DocumentData, Query } from 'firebase/firestore';
import { db } from '../Config/firebase-config';
import { AmortizationMetaData } from '../Domain/AmortizationData';
import { User } from '../Domain/user';

const amortizationCollectionref = collection(db, "Amortization")

export const getAmartizationData = async (dbQuery: Query<DocumentData, DocumentData>): Promise<AmortizationMetaData[]> => {
    let amartizationDataList: AmortizationMetaData[] = [] as AmortizationMetaData[];
    try {
        const data = await getDocs(dbQuery);
        data.docs
            .map(doc => {
                const { userId, type, loanDetails, interestMap, emiMap, extraPaymentMap } = doc.data();
                const amartizationData: AmortizationMetaData = {
                    emiMap, extraPaymentMap, id: doc.id, interestMap, loanDetails, type, userId
                }
                amartizationDataList.push(amartizationData);
            });
    } catch (error) {
        console.log(error)
    }
    return amartizationDataList;
}
export const getAmartizationForeCastDataByUserId = async (userId: string): Promise<AmortizationMetaData[]> => {
    const dbQuery = query(amortizationCollectionref,
        where('userId', '==', userId),
        where('type', '==', "foreCast")
    );
    return await getAmartizationData(dbQuery)
}


export const getAmortizationactualMetaData = async (person: User): Promise<AmortizationMetaData[]> => {

   
    const dbQuery = query(amortizationCollectionref,
        where('userId', '==', person.id),
        where('type', '==', "actual"));
    return await getAmartizationData(dbQuery);
    }