import React from 'react';

const Indicator = ({ indicator }) => {
    if (!indicator) {
        return null;
    }

    return <div className="city-indicator">{ indicator }</div>;
}

export default Indicator;