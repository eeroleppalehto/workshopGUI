import { ChakraProvider, Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";
import productionData from "./ProductionData.json";
import TemperatureGraph from "./compoments/TemperatureGraph";
import MachineList from "./compoments/MachineList.tsx";
import TemperatureGauge from "./compoments/GaugeChart.tsx";
import ScrollableButtons from "./compoments/ScrollableButtons"; // Ensure this is imported correctly
import { ChartData } from 'chart.js';
import "./App.css";

function App() {

    // define style props of grid item
    // @ts-ignore
    const firstItemTemperature = parseInt(productionData[0].temperature, 10);

    const [machines] = useState([
        { name: 'A', weldingTime: '1:20', energyConsumption: '1:20' },
        { name: 'B', weldingTime: '3:20', energyConsumption: '3:20' },
        { name: 'C', weldingTime: '4:40', energyConsumption: '4:40' },
        // Add more machines as needed
    ]);

    const temperatureData: ChartData<'line'> = {
        labels: ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
        datasets: [
            {
                label: 'Temperature Sensor 1',
                data: [22, 19, 27, 23, 25, 29, 31],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Temperature Sensor 2',
                data: [20, 21, 25, 26, 28, 30, 32],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            // Add more datasets as needed
        ],
    };

    return (
        <ChakraProvider>
            <Grid
                templateRows="repeat(2, 1fr)" // Defines 2 rows
                templateColumns="repeat(2, 1fr)" // Defines 2 columns
                gap={4}
                className="container"
                h="100vh"
            >
                {/* MachineList - top left */}
                <GridItem rowSpan={1} colSpan={1} bg="white" p={4}>
                    <MachineList machines={machines} />
                </GridItem>

                {/* TemperatureGauge - top right, make it smaller by using less rows */}
                <GridItem rowSpan={1} colSpan={1} bg="white" p={4}>
                    <TemperatureGauge temperature={firstItemTemperature} />
                </GridItem>

                {/* TemperatureGraph - bottom left */}
                <GridItem rowSpan={1} colSpan={1} bg="white" p={4}>
                    <TemperatureGraph data={temperatureData} />
                </GridItem>

                {/* ScrollableButtons - bottom right */}
                <GridItem rowSpan={1} colSpan={1} bg="white" p={4}>
                    <ScrollableButtons />
                </GridItem>
            </Grid>
        </ChakraProvider>

    );
}


export default App;
