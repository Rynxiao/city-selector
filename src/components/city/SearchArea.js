import React from 'react';
import { Menu } from 'antd-mobile';

const SearchArea = ({ city, onChange }) => {
    return <Menu
            className="city-search-menu"
            data={ city }
            level={ 1 }
            onChange={ onChange }
            height={ city.length === 0 ? 0 : document.documentElement.clientHeight * 0.6 }
        />;
}

export default SearchArea;