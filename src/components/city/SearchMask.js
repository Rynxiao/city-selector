import React from 'react';

const SearchMask = ({ show, city }) => {
    if (!(show && city.length > 0)) {
        return null;
    }

    return <div className="city-menu-mask"></div>;
}

export default SearchMask;