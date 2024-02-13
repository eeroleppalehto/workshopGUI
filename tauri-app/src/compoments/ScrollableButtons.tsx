import React from 'react';
import { Box, Button, VStack } from '@chakra-ui/react';

const ScrollableButtons: React.FC = () => {
    return (
        <Box
            height="200px" // Adjust height to control how many buttons are visible without scrolling
            overflowY="scroll" // Enables vertical scrolling
            width="100%"
            padding="4"
            boxShadow="base" // Optional: adds a shadow to the Box for better visibility
        >
            <VStack>
                {/* Generate buttons - you can replace these with any content you need */}
                {[1, 2, 3, 4, 5, 6, 7, 8].map((buttonNumber) => (
                    <Button key={buttonNumber}>Button {buttonNumber}</Button>
                ))}
            </VStack>
        </Box>
    );
};

export default ScrollableButtons;
