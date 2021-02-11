import React, { Component } from 'react';

class Block extends Component
{
	render()
	{
		const { timestamp, hash, data } = this.props.block;

		const hashDisplay = `${hash.substr(0, 15)}...`;
		const stringifyData = JSON.stringify(data);

		const dataDisplay = stringifyData.length > 35 ?
			`${stringifyData.substr(0, 35)}...`:
			stringifyData;



		return (
			<div className="block">
				<div>Timestamp: { new Date(timestamp).toLocaleString() } </div>
				<div>Hash: { hashDisplay } </div>
				<div>Data: { dataDisplay } </div>
			</div>
			);
	}
	
}


export default Block;