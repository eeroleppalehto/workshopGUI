import React, { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart';

const TemperatureGauge: React.FC = () => {
    const [temperature, setTemperature] = useState<number | null>(null);

    useEffect(() => {
        // Define the function to fetch temperature
        const fetchTemperature = async () => {
            try {
                const response = await fetch('http://localhost:3001/temperature');
                const data = await response.json();
                setTemperature(data.temperature);
            } catch (error) {
                console.error("Failed to fetch temperature:", error);
                // Handle error case, e.g., set temperature to a default value or show an error message
            }
        };

        fetchTemperature();
        // Optionally, set an interval to fetch the temperature periodically, e.g., every 5 seconds
        const intervalId = setInterval(fetchTemperature, 5000); // 5000 ms = 5 seconds

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array means this effect runs once on component mount and sets up an interval

    // Assuming the temperature range is 0 to 500
    const maxTemperature = 500;
    // Calculate the percentage for the gauge
    const percentage = temperature ? temperature / maxTemperature : 0;

    return (
        <div style={{
            position: 'relative',
            width: '500px', // Increase the width as needed
            height: '300px', // Increase the height as needed
            margin: 'auto'
        }}>
            <GaugeChart id="temperature-gauge"
                        nrOfLevels={30} // Adjust the number of levels/colors as needed
                        colors={["#38ff00", "#FDD250", "#F33F3F"]}
                        arcWidth={0.2}
                        percent={percentage}
                        textColor={"#000000"}
                        needleColor={"#464A4F"}
                        needleBaseColor={"#464A4F"} />
            {temperature !== null && (
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    textAlign: 'center',
                    bottom: '20%', // Adjust based on the new size
                    fontSize: '22px', // Adjust as needed
                    color: '#000000', // Match your design
                    fontWeight: 'bold' // Optional: makes the text easier to read
                }}>
                    {temperature}°C
                </div>
            )}
        </div>
    );
};

export default TemperatureGauge;
