import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction'

class Block extends Component
{
	state = {displayTransaction: false};

	toggleTransaction = () => {
		this.setState({ displayTransaction: !this.state.displayTransaction });
	}

	get displayTransaction(){

		const { data } = this.props.block;

		const stringifyData = JSON.stringify(data);

		const dataDisplay = stringifyData.length > 35 ?
			`${stringifyData.substr(0, 35)}...`:
			stringifyData;

		if (this.state.displayTransaction)
		{
			return (
				<div>
			          {
			            data.map(transaction => (
			              <div key={transaction.id}>
			                <hr />
			                <Transaction transaction={transaction} />
			              </div>
			            ))
			          }
			          <br />
			          <Button
			            bsStyle="danger"
			            bsSize="small"
			            onClick={this.toggleTransaction}
			          >
			            Show Less
			          </Button>
				</div>
			)
		}
		
		return (
			<div>
				<div>Data: {dataDisplay}</div>
				<Button bsStyle="danger"
						bssize="small"
						onClick={this.toggleTransaction}
				>
				Show More
				</Button>
			</div>
			)
	}
	render()
	{
		const { timestamp, hash, data } = this.props.block;

		const hashDisplay = `${hash.substr(0, 15)}...`;
		

		return (
			<div className="block">
				<div>Timestamp: { new Date(timestamp).toLocaleString() } </div>
				<div>Hash: { hashDisplay } </div>
				{this.displayTransaction}
			</div>
			);
	}
	
}


export default Block;