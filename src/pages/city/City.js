import React, { Component } from 'react';
import { NavBar, SearchBar, WhiteSpace, List, Toast, Icon } from 'antd-mobile';
import { SearchMask, IndexNav, Indicator, PositionCity, SearchArea } from '../../components';
import { getLocalCity } from '../../services/locationServices';
import { 
    LASTEST_CITY,
    getAllCities, 
    saveLocalStorageCity, 
    getLocalStorageCity,
    searchCityByName,
    transformCityMenuData
} from '../../services/cityServices';
import { 
    throttle,
    parseSearchToState,
    parseStateToSearch
} from '../../utils';
import './city.css';

const Item = List.Item;
const searchCity = throttle(searchCityByName);

class City extends Component {
    constructor(props) {
        super(props);
        this.state = {
            localCity: '北京',
            hotCity: [],
            latestCity: [],
            city: {},
            labels: [],
            searchCities: [],

            moving: false,
            indicator: '',
            loading: false,
            searchArea: false
        };
    }

    componentDidMount = () => {
        this.setState(() => {
            Toast.loading('Loading...');
            return { loading: true };
        });

        Promise.all([getLocalCity(), getAllCities(), getLocalStorageCity(LASTEST_CITY)]).then(result => {
            const localCity = result[0] && result[0].replace(/市/, '');
            const city = result[1].afterFilterAllCity.allCity;
            const labels = result[1].afterFilterAllCity.validateLetters;
            const hotCity = result[1].hotCity;
            const latestCity = result[2];
            this.setState(() => {
                Toast.hide();
                return {
                    localCity,
                    city,
                    hotCity,
                    labels,
                    latestCity,
                    loading: false
                };
            });
        });
    }

    onSearchInput = async value => {
        if (!value) {
            this.hideMenuDialog();
            return;
        }

        const { labels, city } = this.state;
        const cities = await searchCity(value, labels, city);
        this.setState({  
            searchArea: true, 
            searchCities: transformCityMenuData(cities) 
        });
    }

    hideMenuDialog = () => {
        this.setState({
            searchArea: false,
            searchCities: []
        });
    }

    renderLocalCity = () => {
        const { localCity, latestCity } = this.state;
        return <PositionCity 
            title={ '定位/最近访问' } 
            position 
            positionCity={ localCity } 
            city={ latestCity } 
            onSelectCity={ this.onSelectCity } />
    }

    renderHotCity = () => {
        const { hotCity } = this.state;
        return <PositionCity 
            title={ '热门城市' } 
            position={ false } 
            city={ hotCity } 
            onSelectCity={ this.onSelectCity } />
    }

    renderCities = () => {
        const { city } = this.state;
        return Object.keys(city).map(letter => {
            const cList = city[letter];
            return (
                <div key={ letter } ref={ element => this[`section${letter}`] = element }>
                    <List renderHeader={ () => letter } className="select-city-list">
                        {
                            cList.length > 0 && cList.map(c => {
                                return <Item key={ c.id } onClick={ () => this.onSelectCity(c) }>{ c.city }</Item>
                            })
                        }
                    </List>
                </div>
            );
        });
    }

    renderSearchCity = () => {
        const { searchCities } = this.state;
        return <SearchArea city={ searchCities } onChange={ this.onChangeMenu } />
    }

    onChangeMenu = value => {
        this.hideMenuDialog();
        this.onSelectCity(value[0]);
    }

    onSelectCity = (city) => {
        if (this.state.moving) {
            return;
        }

        const { history, location } = this.props;
        const search = location.search;
        const { cityCode, ...rest } = parseSearchToState(search);
        const backCity = typeof city === 'string' ? city : city.city;

        rest[`city${cityCode}`] = backCity;
        saveLocalStorageCity(LASTEST_CITY, backCity);
        history.push({
            pathname: '/',
            search: parseStateToSearch({ ...rest })
        });
    }

    onNavChange = (nav) => {
        this.setState(() => {
            const label = nav.label ? nav.label : this.state.label;
            const moving = nav.moving ? nav.moving : this.state.moving;
            this[`section${label}`] && this[`section${label}`].scrollIntoView();
            return {
                moving,
                indicator: label
            }
        });
    }

    render() {
        const { labels, indicator, moving, loading, searchArea } = this.state;

        if (loading) {
            return null;
        }

        return (
            <div className="city">
                <div className="city-top">
                    <NavBar
                        className="navbar"
                        mode="dark"
                        icon={ <Icon type="left" /> }
                        leftContent="返回"
                        onLeftClick={ () => this.props.history.goBack() }
                        >选择城市</NavBar>
                    <SearchBar 
                        placeholder="请输入你要选择的城市" 
                        maxLength={ 8 } 
                        onChange={ this.onSearchInput } /> 
                </div>
                <div className="city-list">
                    <div className="city-search-area">
                        { searchArea && this.renderSearchCity() }
                    </div> 
                    <SearchMask show={ searchArea } city={ this.state.searchCities } />
                    <div className="city-list-content">
                        { this.renderLocalCity() }
                        <WhiteSpace size="md" />
                        { this.renderHotCity() }
                        { this.renderCities() }
                        <Indicator indicator={ indicator } />
                    </div>
                    <div className="city-label">
                        <IndexNav labels={ labels } moving={ moving } onNavChange={ this.onNavChange } />
                    </div>
                </div>
            </div>
                
        );
    }
}

export default City;
