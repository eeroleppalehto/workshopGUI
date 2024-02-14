import React from 'react';
import productionData from '../ProductionData.json'; // Make sure the path is correct


const MachineList: React.FC = () => {
    return (
        <div className="machine-list">
            <div className="header">Produkt</div>
            <div className="header">Time</div>
            <div className="header">EC</div>
            {productionData.map((machine, index) => (
                <React.Fragment key={index}>
                    <div>{machine.name}</div>
                    <div>{machine.weldingTime}</div>
                    <div>{machine.energyConsumption}</div>
                </React.Fragment>
            ))}
        </div>
    );
};

export default MachineList;
