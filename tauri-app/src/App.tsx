import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { ChakraProvider, Box } from "@chakra-ui/react";
import TemperatureGraph from "./compoments/TemperatureGraph"; // Adjust the path as necessary
import { ChartData } from 'chart.js';
import "./App.css";

function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");

    async function greet() {
        setGreetMsg(await invoke("greet", { name }));
    }

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
        ],
    };

    return (
        <ChakraProvider>
            <div className="container">
                {/* Existing content */}
                <Box display="flex" justifyContent="left">
                    <div style={{ width: '50%', height: 'auto', padding: 20 }}>
                        <TemperatureGraph data={temperatureData} />
                    </div>
                </Box>
            </div>
        </ChakraProvider>
    );
}

export default App;
