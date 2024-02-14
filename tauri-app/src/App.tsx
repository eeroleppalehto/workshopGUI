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
    const [activeTemperature, setActiveTemperature] = useState(0);

    const temperatureData: ChartData<'line'> = {
        labels: ['9:00', '10:00', '11:00', '13:00', '15:00', '16:00'],
        datasets: [
            {
                label: 'Machine 1',
                data: [290, 187, 143, 252, 383],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Machine 2',
                data: [160, 398, 262, 206, 315],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Machine 3',
                data: [272, 164, 420, 253, 181],
                borderColor: 'rgb(190,53,235)',
                backgroundColor: 'rgb(190,53,235)',
            },
            {
                label: 'Machine 4',
                data: [419, 263, 205, 372, 230],
                borderColor: 'rgb(53,235,62)',
                backgroundColor: 'rgb(53,235,62)',
            },
            {
                label: 'Machine 5',
                data: [456, 412, 496, 398, 212],
                borderColor: 'rgb(235,177,53)',
                backgroundColor: 'rgb(235,177,53)',
            },
            // Add more datasets as needed
        ],
    };

    return (
        <ChakraProvider>
            <Grid
                templateRows="repeat(2, 1fr)"
                templateColumns="repeat(2, 1fr)"
                gap={4}
                className="container"
                h="100vh"
            >
                {/* MachineList - top left, now passing onActiveTemperatureChange */}
                <GridItem rowSpan={1} colSpan={1} bg="white" p={4}>
                    <MachineList onActiveTemperatureChange={setActiveTemperature} />
                </GridItem>

                {/* TemperatureGauge - top right, dynamically displaying active temperature */}
                <GridItem rowSpan={1} colSpan={1} bg="white" p={4}>
                    <TemperatureGauge temperature={activeTemperature} />
                </GridItem>

                {/* TemperatureGraph and ScrollableButtons remain unchanged */}
                <GridItem rowSpan={1} colSpan={1} bg="white" p={4}>
                    <TemperatureGraph data={temperatureData} />
                </GridItem>
                <GridItem rowSpan={1} colSpan={1} bg="white" p={4}>
                    <ScrollableButtons />
                </GridItem>
            </Grid>
        </ChakraProvider>
    );
}

export default App;

