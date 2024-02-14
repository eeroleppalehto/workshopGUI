const { OPCUAServer, Variant, DataType, StatusCodes } = require("node-opcua");

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

(async () => {
    // Let's create an instance of OPCUAServer
    const server = new OPCUAServer({
        port: 4334, // the port of the listening socket of the server
        resourcePath: "/UA/MyLittleServer", // this path will be added to the endpoint resource name
        buildInfo: {
            productName: "MySampleServer1",
            buildNumber: "7658",
            buildDate: new Date(2014, 5, 2)
        }
    });
    await server.initialize();
    console.log("initialized");

    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace.getOwnNamespace();

    console.log(namespace.index);

    // declare a new object
    const device = namespace.addObject({
        organizedBy: addressSpace.rootFolder.objects,
        browseName: "MyWeldingMachine"
    });

    // add some variables
    // add a variable named MyVariable1 to the newly created folder "MyDevice"
    let portalEnergyConsumption = 1;

    namespace.addVariable({
        componentOf: device,
        nodeId: "s=portalEnergyConsumption", // a string nodeID
        browseName: "PortalEnergyConsumption",
        dataType: "Double",
        value: {
            get: () => new Variant({ dataType: DataType.Double, value: portalEnergyConsumption })
        }
    });

    // add a variable named MyVariable2 to the newly created folder "MyDevice"
    let robotEnergyConsumption = 10.0;

    namespace.addVariable({
        componentOf: device,
        // nodeId: "ns=1;b=1020FFAA", // some opaque NodeId in namespace 4
        nodeId: "s=robotEnergyConsumption", // a string nodeID
        browseName: "RobotEnergyConsumption",
        dataType: "Double",
        minimumSamplingInterval: 1234, // we need to specify a minimumSamplingInterval when using a getter
        value: {
            get: () => new Variant({ dataType: DataType.Double, value: robotEnergyConsumption }),
            set: (variant) => {
                variable2 = parseFloat(variant.value);
                return StatusCodes.Good;
            }
        }
    });


    // add a variable named MyVariable2 to the newly created folder "MyDevice"
    let weldingEnergyConsumption = 7.0;

    namespace.addVariable({
        componentOf: device,
        // nodeId: "ns=1;b=1021FFAA", // some opaque NodeId in namespace 4
        nodeId: "s=weldingEnergyConsumption", // a string nodeID
        browseName: "WeldingEnergyConsumption",
        dataType: "Double",
        minimumSamplingInterval: 1234, // we need to specify a minimumSamplingInterval when using a getter
        value: {
            get: () => new Variant({ dataType: DataType.Double, value: weldingEnergyConsumption }),
            set: (variant) => {
                weldingEnergyConsumption = parseFloat(variant.value);
                return StatusCodes.Good;
            }
        }
    });

    let weldingMachineTemperature = 7.0;

    namespace.addVariable({
        componentOf: device,
        // nodeId: "ns=1;b=1021FFAA", // some opaque NodeId in namespace 4
        nodeId: "s=weldingMachineTemperature", // a string nodeID
        browseName: "WeldingMachineTemperature",
        dataType: "Double",
        minimumSamplingInterval: 1234, // we need to specify a minimumSamplingInterval when using a getter
        value: {
            get: () => new Variant({ dataType: DataType.Double, value: weldingMachineTemperature }),
            set: (variant) => {
                weldingEnergyConsumption = parseFloat(variant.value);
                return StatusCodes.Good;
            }
        }
    });

    // emulate variables changing every 60*1000 ms
    setInterval(() => {
        portalEnergyConsumption = randomNumber(0, 100);
        robotEnergyConsumption = randomNumber(0, 1000);
        weldingEnergyConsumption = randomNumber(0, 5000);
        weldingMachineTemperature = randomNumber(20, 1000);
    }, 60*1000);


    server.start(function () {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);
        const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl);
    });
})();