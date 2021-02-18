import React from 'react'
import { render } from 'react-dom'
import { Router, Switch, Route } from 'react-router-dom';
import Blocks from './components/Blocks';
import history from './history';
import App from './components/App'
import conductTransaction from './components/ConductTransaction';
import transactionPool from './components/TransactionPool';

import './index.css'

render(
		<Router history={history}>
			<Switch>
				<Route exact path='/' component={App} />
				<Route path='/blocks' component={Blocks} />
				<Route path='/conduct-transaction' component={conductTransaction} />
				<Route path='/transaction-pool' component={transactionPool} />
			</Switch>
		</Router>,
		document.getElementById('root')
		);
