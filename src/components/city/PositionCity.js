import React from 'react';

const PositionCity = ({ title, position, city, positionCity = '', ...rest }) => {
    return (
        <div className={ `city-local ${rest.className ? rest.className : ''}` }>
            <p>{ title }</p>
            <ul>
                { 
                    position && 
                    <li className="city-item" onClick={ () => rest.onSelectCity(positionCity) }>
                        <span className="city-location" />
                        <span className="city-local-text">{ positionCity }</span>
                    </li> 
                }
                {
                    city && city.map(l => {
                        if (typeof l === 'string') {
                            l = { id: l, city: l };
                        }
                        return l.city !== positionCity && (
                            <li key={ l.id } className="city-item" onClick={ () => rest.onSelectCity(l.city) }>
                                <span className="city-local-text">{ l.city }</span>
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
}

export default PositionCity;