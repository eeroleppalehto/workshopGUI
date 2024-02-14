import { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart';
import { getDatabase, ref, onValue } from 'firebase/database';

const TemperatureGauge = () => {
    const [temperature, setTemperature] = useState<number | null>(null);
    const [machineIndex, setMachineIndex] = useState(1);
    {/* @ts-ignore */}
    const [timers, setTimers] = useState(Array(8).fill(0));
    {/* @ts-ignore */}
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const db = getDatabase();
        const temperatureRef = ref(db, `maschines/${machineIndex}/temperature`);

        const unsubscribe = onValue(temperatureRef, (snapshot) => {
            const newTemperature = snapshot.val();
            setTemperature(newTemperature);
        });

        return () => unsubscribe();
    }, [machineIndex]);

    useEffect(() => {
        const startTimers = () => {
            const id = setInterval(() => {
                setTimers((prevTimers) => {
                    let reset = false;
                    const updatedTimers = prevTimers.map((timer, index, arr) => {
                        // Increment the current timer or maintain as is
                        if (index === 0 || arr[index - 1] >= 60) {
                            // Check if the 5th machine's timer exceeds 5 minutes
                            if (index === 4 && timer >= 300) {
                                reset = true;
                                return 0; // Reset the 5th timer immediately
                            }
                            return timer + 1;
                        }
                        return timer;
                    });
                    // Reset and continue the loop from machine 1
                    if (reset) {
                        return Array(5).fill(0);
                    }
                    return updatedTimers;
                });
            }, 1000);

            setIntervalId(id);
        };

        startTimers();

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        // Find the active machine based on the timers
        const activeMachineIndex = timers.findIndex(timer => timer > 0 && timer <= 60);
        let nextMachineIndex = activeMachineIndex + 1;

        // Reset to machine 1 after 5th machine's timer
        if (nextMachineIndex > 5 || timers[4] >= 300) {
            nextMachineIndex = 1;
        }

        setMachineIndex(nextMachineIndex);
    }, [timers]);


    const maxTemperature = 1000;
    const percentage = temperature ? temperature / maxTemperature : 0;

    return (
        <div style={{ position: 'relative', width: '500px', height: '300px', margin: 'auto' }}>
            <GaugeChart
                id="temperature-gauge"
                nrOfLevels={30}
                colors={["#38ff00", "#FDD250", "#F33F3F"]}
                arcWidth={0.2}
                percent={percentage}
                textColor={"#000000"}
                needleColor={"#464A4F"}
                needleBaseColor={"#464A4F"}
            />
            {temperature !== null && (
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    textAlign: 'center',
                    bottom: '20%',
                    fontSize: '22px',
                    color: '#000000',
                    fontWeight: 'bold'
                }}>
                    {temperature}°C
                </div>
            )}
        </div>
    );
};

export default TemperatureGauge;
