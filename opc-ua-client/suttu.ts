import { db } from "./firebaseStore";

const energyConsumption = db.collection('energyConsumptionData');


export async function getEnergyConsumptionData(machinePart: 'Robot' | 'Welder' | 'Portal') {
    const query = energyConsumption
        .where('machinePartId', '==', machinePart)
        .orderBy('timestamp', 'desc')
        .limit(10);

    const querySnapshot = await query.get();
    const data = querySnapshot.docs.map(doc => doc.data());
    return data;
}

export async function getTemperatureData() {
    const temperatureData = db.collection('temperatureData');
    const query = temperatureData
        .orderBy('timestamp', 'desc')
        .limit(1);

    const querySnapshot = await query.get();
    const data = querySnapshot.docs.map(doc => doc.data());
    return data;
}

getTemperatureData().then(data => console.log(data));