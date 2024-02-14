import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, TableCaption } from "@chakra-ui/react";
import app from '../firebaseConfig';

type MachineData = {
    name: string;
    temperature: number;
    runningTime: number; // Add running time to machine data
    energyConsumption: number; // Add energy consumption to machine data
};

const MachineList: React.FC = () => {
    const database = getDatabase(app);
    const [machines, setMachines] = useState<MachineData[]>([]);
    const [timers, setTimers] = useState<number[]>(Array(8).fill(0)); // Initialize timers for 8 machines
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const machinesRef = ref(database, 'maschines');
        const unsubscribe = onValue(machinesRef, (snapshot) => {
            const machineData: MachineData[] = [];
            snapshot.forEach((childSnapshot) => {
                const name = childSnapshot.key;
                const temperature = childSnapshot.child('temperature').val() || 0;
                const energyConsumption = childSnapshot.child('ec1').val() || 0;
                if (name) {
                    machineData.push({
                        name,
                        temperature,
                        energyConsumption,
                        runningTime: 0, // Initialize running time
                    });
                }
            });
            setMachines(machineData);
        });
        return () => unsubscribe();
    }, [database]);

    useEffect(() => {
        // Start the timer for the first machine immediately
        const startTimers = () => {
            const id = setInterval(() => {
                setTimers((prevTimers) => {
                    const updatedTimers = prevTimers.map((timer, index) => {
                        // Start next timer after the current one reaches 60 seconds
                        if (index > 0 && prevTimers[index - 1] >= 60) {
                            return timer + 1;
                        }
                        // Continue current timer if it has started
                        if (timer > 0) {
                            return timer + 1;
                        }
                        // Start first timer immediately
                        return index === 0 ? timer + 1 : timer;
                    });

                    // Reset all timers if Machine 8's timer reaches 5 minutes (300 seconds)
                    if (updatedTimers[7] >= 300) {
                        return Array(8).fill(0);
                    }
                    return updatedTimers;
                });
            }, 1000); // Update every second
            setIntervalId(id);
        };

        startTimers();

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    // Update machine running times based on timers
    useEffect(() => {
        setMachines((prevMachines) =>
            prevMachines.map((machine, index) => ({
                ...machine,
                runningTime: timers[index] || 0,
            }))
        );
    }, [timers]);

    return (
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th>Product</Th>
                        <Th>Temperature</Th>
                        <Th>Running</Th> {/* Add Running header */}
                        <Th isNumeric>Energy Consumption</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {machines.slice(0, 5).map((machine, index) => ( // Only display the first 5 machines
                        <Tr key={index}>
                            <Td>{machine.name}</Td>
                            <Td>{machine.temperature}°C</Td>
                            <Td>{Math.floor(machine.runningTime / 60)}m {machine.runningTime % 60}s</Td>
                            <Td isNumeric>{machine.energyConsumption}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export default MachineList;