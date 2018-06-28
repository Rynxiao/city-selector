import React, { Component } from 'react';
import { NavBar, List } from 'antd-mobile';
import { parseSearchToState, parseStateToSearch } from '../../utils';
import './App.css';

const Item = List.Item;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city1: '',
      city2: ''
    };
  }

  componentDidMount = () => {
    const { location } = this.props;
    const search = location && location.search;
    const searchState = parseSearchToState(search);
    searchState && this.setState(searchState);
  }

  gotoChooseCity = (cityCode) => {
    const { history } = this.props;
    history.push({
      pathname: '/city',
      search: parseStateToSearch({ cityCode, ...this.state })
    });
  }

  render() {
    const { city1, city2 } = this.state;

    return (
      <div className="App">
        <NavBar mode="dark" className="navbar">城市选择</NavBar>
        <List renderHeader={ () => '选择城市demo' } className="select-city-list">
          <Item extra={ city1 } arrow="horizontal" onClick={ () => this.gotoChooseCity('1') }>城市选择1</Item>
          <Item extra={ city2 } arrow="horizontal" onClick={ () => this.gotoChooseCity('2') }>城市选择2</Item>
        </List>
      </div>
    );
  }
}

export default App;
