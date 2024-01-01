import { getDocs, collection, query, where, DocumentData, Query, doc, setDoc } from 'firebase/firestore';
import { db } from '../Config/firebase-config';
import { AmortizationMetaData } from '../Domain/AmortizationData';

const amortizationCollectionref = collection(db, "Amortization")

//===== fetch AmartizationData

export const getAmartizationData = async (dbQuery: Query<DocumentData, DocumentData>): Promise<AmortizationMetaData[]> => {
    let amartizationDataList: AmortizationMetaData[] = [] as AmortizationMetaData[];
    try {
        const data = await getDocs(dbQuery);
        amartizationDataList = data.docs
            .map(doc => {
                const { userId,
                    type,
                    loanDetails,
                    interestMap,
                    emiMap,
                    extraPaymentMap,
                } = doc.data();
                const amartizationData: AmortizationMetaData = {
                    emiMap: toMap(emiMap),
                    extraPaymentMap: toMap(extraPaymentMap),
                    interestMap: toMap(interestMap),
                    id: doc.id,
                    loanDetails,
                    type,
                    userId,
                }
                // amartizationDataList.push(amartizationData);
                return amartizationData;
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


export const getAmortizationactualMetaData = async (userId: string): Promise<AmortizationMetaData[]> => {
    const dbQuery = query(amortizationCollectionref,
        where('userId', '==', userId),
        where('type', '==', "actual")
    );
    return await getAmartizationData(dbQuery);
}

// upsert

export const upsertAmortizationData = async (amortizationData: AmortizationMetaData): Promise<void> => {
    const { id, userId, type, loanDetails, emiMap, extraPaymentMap, interestMap } = amortizationData;
    try {
        const docRef = doc(amortizationCollectionref, amortizationData.id);
        const plainObjectData = {
            id: id,
            userId: userId,
            type: type,
            loanDetails: loanDetails,
            emiMap: toJson(emiMap),
            extraPaymentMap: toJson(extraPaymentMap),
            interestMap: toJson(interestMap)

        }; // Convert to plain JavaScript object
        await setDoc(docRef, plainObjectData, { merge: true });
    } catch (error) {
        console.error('Error upserting amortization data:', error);
        throw error;
    }
};



const toJson = (map: Map<number, number>): { [key: number]: number } => {
    return Object.fromEntries([...map]) as { [key: number]: number };
}

const toMap = (json: { [key: number]: number }): Map<number, number> => {

    const myMap = new Map<number, number>();
    Object.entries(json).forEach(([key, value]) => {
        const numericKey: number = parseInt(key, 10); // Convert key to a number if needed
        console.log(`Key: ${numericKey}, Value: ${value}`);
        myMap.set(numericKey,value);
    });
    console.log(json)
    return myMap;

}