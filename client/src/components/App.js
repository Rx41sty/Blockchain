import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

class App extends Component
{
	state = {walletInfo: {}};

	componentDidMount()
	{
		fetch(`${document.location.origin}/api/wallet-info`)
		.then(response => response.json())
		.then(json => this.setState({ walletInfo : json }));
	}

	render()
	{
		const {address, balance} = this.state.walletInfo;
		return (
			<div className="App">
				<img className="logo" src={logo}></img>
				<br />
				<div>
					Welcome to the Blockchain
				</div>
				<br />
				<div><Link to='/blocks'>Blocks</Link></div>
				<div><Link to='/conduct-transaction'>Transact</Link></div>
				<div><Link to='/transaction-pool'>Pool</Link></div>
				<div className = "WalletInfo">
					<div>Address: {address}</div>
					<div>Balance: {balance}</div>
				</div>
			<br />
			</div>
		);
	}	
}


export default App;