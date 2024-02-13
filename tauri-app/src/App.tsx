import { ChakraProvider, Box, Flex } from "@chakra-ui/react";
import TemperatureGraph from "./compoments/TemperatureGraph";
import ScrollableButtons from "./compoments/ScrollableButtons"; // Ensure this is imported correctly
import { ChartData } from 'chart.js';
import "./App.css";

function App() {

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
            <div className="container">
                <Flex direction="row" justify="space-between" align="start" className="container">
                    <Box flex="1" minWidth="0" maxWidth="60%" padding="20px">
                        <TemperatureGraph data={temperatureData} />
                    </Box>
                    <Box flex="1" minWidth="0" maxWidth="40%" padding="20px" height="200px" overflowY="auto">
                        <ScrollableButtons />
                    </Box>
                </Flex>
            </div>
        </ChakraProvider>
    );
}


export default App;
