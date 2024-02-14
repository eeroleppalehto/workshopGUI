import {
    OPCUAClient,
    MessageSecurityMode,
    SecurityPolicy,
    AttributeIds,
    makeBrowsePath,
    ClientSubscription,
    TimestampsToReturn,
    MonitoringParametersOptions,
    ReadValueIdOptions,
    ClientMonitoredItem,
    DataValue
} from "node-opcua";

import { v4 as uuidv4 } from 'uuid';

import { db } from "./firebaseStore";

const connectionStrategy = {
    initialDelay: 1000,
    maxRetry: 1
};
const client = OPCUAClient.create({
    applicationName: "MyClient",
    connectionStrategy: connectionStrategy,
    securityMode: MessageSecurityMode.None,
    securityPolicy: SecurityPolicy.None,
    endpointMustExist: false
});
//const endpointUrl = "opc.tcp://opcuademo.sterfive.com:26543";
const endpointUrl = "opc.tcp://" + require("os").hostname() + ":4334/UA/MyLittleServer";

async function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
    try {
        // step 1 : connect to
        await client.connect(endpointUrl);
        console.log("connected !");

        // step 2 : createSession
        const session = await client.createSession();
        console.log("session created !");

        // step 3 : browse
        const browseResult = await session.browse("RootFolder");

        console.log("references of RootFolder :");

        if (!browseResult.references) throw new Error("No reference found");

        for (const reference of browseResult.references) {
            console.log("   -> ", reference.browseName.toString());
        }


        // step 4' : read a variable with read
        // const maxAge = 0;
        // const nodeToRead = {
        //     // nodeId: "ns=3;s=Scalar_Simulation_String",
        //     nodeId: "ns=1;s=weldingEnergyConsumption",
        //     attributeId: AttributeIds.Value
        // };
        // const dataValue = await session.read(nodeToRead, maxAge);
        // console.log(" value ", dataValue.toString());

        // step 5: install a subscription and install a monitored item for 10 seconds
        const subscription = ClientSubscription.create(session, {
            requestedPublishingInterval: 1000,
            requestedLifetimeCount: 100,
            requestedMaxKeepAliveCount: 10,
            maxNotificationsPerPublish: 100,
            publishingEnabled: true,
            priority: 10
        });

        subscription
            .on("started", function () {
                console.log("subscription started for 2 seconds - subscriptionId=", subscription.subscriptionId);
            })
            .on("keepalive", function () {
                console.log("keepalive");
            })
            .on("terminated", function () {
                console.log("terminated");
            });

        // install monitored items
        const itemToMonitor: ReadValueIdOptions = {
            nodeId: "ns=1;s=portalEnergyConsumption",
            attributeId: AttributeIds.Value
        };
        const parameters: MonitoringParametersOptions = {
            samplingInterval: 1000,
            discardOldest: true,
            queueSize: 10
        };

        const monitoredItem = ClientMonitoredItem.create(subscription, itemToMonitor, parameters, TimestampsToReturn.Both);

        monitoredItem.on("changed", (dataValue: DataValue) => {
            console.log(" Portal value has changed : ", dataValue.value.toString());
            db.collection('energyConsumptionData').doc(uuidv4()).set({
                energyConsumption: Number(dataValue.value.value),
                timestamp: new Date(),
                machinePartId: 'Portal'
            }).then((ts) => console.log('portalEnergyConsumption set', ts));
        });

        const itemToMonitor2: ReadValueIdOptions = {
            nodeId: "ns=1;s=robotEnergyConsumption",
            attributeId: AttributeIds.Value
        };
        const monitoredItem2 = ClientMonitoredItem.create(subscription, itemToMonitor2, parameters, TimestampsToReturn.Both);

        monitoredItem2.on("changed", (dataValue: DataValue) => {
            console.log(" Robot value has changed : ", dataValue.value.toString());
            db.collection('energyConsumptionData').doc(uuidv4()).set({
                energyConsumption: Number(dataValue.value.value),
                timestamp: new Date(),
                machinePartId: 'Robot'
            }).then((ts) => console.log('weldingEnergyConsumption set', ts));
        });

        const itemToMonitor3: ReadValueIdOptions = {
            nodeId: "ns=1;s=weldingEnergyConsumption",
            attributeId: AttributeIds.Value
        };
        const monitoredItem3 = ClientMonitoredItem.create(subscription, itemToMonitor3, parameters, TimestampsToReturn.Both);

        monitoredItem3.on("changed", (dataValue: DataValue) => {
            console.log(" Welding value has changed : ", dataValue.value.toString());
            db.collection('energyConsumptionData').doc(uuidv4()).set({
                energyConsumption: Number(dataValue.value.value),
                timestamp: new Date(),
                machinePartId: 'Welder'
            }).then((ts) => console.log('weldingEnergyConsumption set', ts));
        });

        const itemToMonitor4: ReadValueIdOptions = {
            nodeId: "ns=1;s=weldingMachineTemperature",
            attributeId: AttributeIds.Value
        };
        const monitoredItem4 = ClientMonitoredItem.create(subscription, itemToMonitor4, parameters, TimestampsToReturn.Both);

        monitoredItem4.on("changed", (dataValue: DataValue) => {
            console.log(" Welding Machine Temperature value has changed : ", dataValue.value.toString());
            db.collection('temperatureData').doc(uuidv4()).set({
                temperature: Number(dataValue.value.value),
                machinePartId: 'Welder',
                timestamp: new Date()
            }).then((ts) => console.log('weldingMachineTemperature set', ts));
        });


        // await timeout(10000);
/* 
        console.log("now terminating subscription");
        await subscription.terminate();

        // step 6: finding the nodeId of a node by Browse name
        const browsePath = makeBrowsePath("RootFolder", "/Objects/Server.ServerStatus.BuildInfo.ProductName");

        const result = await session.translateBrowsePath(browsePath);

        if (!result.targets) throw new Error("No targets found!");
        const productNameNodeId = result.targets[0].targetId;

        console.log(" Product Name nodeId = ", productNameNodeId.toString());

        // // close session
        await session.close();

        // // disconnecting
        await client.disconnect();
        console.log("done !"); */
    } catch (err) {
        console.log("An error has occurred : ", err);
    }
}
main();