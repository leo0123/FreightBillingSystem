import React, { Component } from "react";
import ReactTable from "react-table";
import 'react-table/react-table.css';

class ProfitCenterAmountComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // data: [{
            //     ProfitCenter: "PRO0A",
            //     BaseDuty: 100,
            //     TrumpDuty: 200,
            //     MechandiseFee: 300,
            //     WaterwaysFee: 400,
            // }],
            data: props.profitCenterAmounts
        };
        this.renderEditable = this.renderEditable.bind(this);
        this.renderSelect = this.renderSelect.bind(this);
        this.renderDelete = this.renderDelete.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.clearData = this.clearData.bind(this);
    }

    clearData() {
        let data = [];
        this.setState({data});
    }

    handleAdd() {
        let data = this.state.data;
        data.push({
            ProfitCenter: "",
            BaseDuty: 0,
            TrumpDuty: 0,
            MechandiseFee: 0,
            WaterwaysFee: 0,
        });
        this.setState({ data });
    }

    renderDelete(cellInfo) {
        return (
            <input type="button" value="delete" className="ms-ButtonHeightWidth" onClick={e=>{
                const data = [...this.state.data];
                data.splice(cellInfo.index, 1);
                this.setState({ data });
                this.props.onChange(data);
            }}></input>
        );
    }

    renderSelect(cellInfo) {
        return (
            <select value={this.state.data[cellInfo.index][cellInfo.column.id]}
            onChange={e => {
                const data = [...this.state.data];
                data[cellInfo.index][cellInfo.column.id] = e.target.value;
                this.setState({ data });
                this.props.onChange(data);
            }}>
                
                {this.props.profitCenters.filter(item => item.Company == this.props.company.val())
                    .map(item => <option key={item.ProfitCenter}>{item.ProfitCenter}</option>)}
            </select>
        );
    }

    

    renderEditable(cellInfo) {
        // tryParseInt = text => {
        //     let int = parseInt(text);
        //     console.log(int);
        //     return int;
        // };

        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.data];
                    data[cellInfo.index][cellInfo.column.id] = parseInt(e.target.innerHTML);
                    this.setState({ data });
                    this.props.onChange(data);
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.data[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }

    render() {
        const { data } = this.state;

        const hStyle = {
            borderWidth: 1,
            borderColor: 'grey'
        }

        const columns = [{
            Header: 'Profit Center',
            headerStyle: hStyle,
            style: hStyle,
            width: 100,
            accessor: 'ProfitCenter', // String-based value accessors!
            Cell: this.renderSelect
        }, {
            Header: 'Base Duty',
            headerStyle: hStyle,
            style: hStyle,
            width: 70,
            accessor: 'BaseDuty', // String-based value accessors!
            Cell: this.renderEditable
        }, {
            Header: 'Trump Duty',
            headerStyle: hStyle,
            style: hStyle,
            width: 80,
            accessor: 'TrumpDuty', // String-based value accessors!
            Cell: this.renderEditable
        }, {
            Header: 'Mechandise Fee',
            headerStyle: hStyle,
            style: hStyle,
            width: 110,
            accessor: 'MechandiseFee', // String-based value accessors!
            Cell: this.renderEditable
        }, {
            Header: 'Waterways Fee',
            headerStyle: hStyle,
            style: hStyle,
            width: 100,
            accessor: 'WaterwaysFee', // String-based value accessors!
            Cell: this.renderEditable
        }, {
            Header: '',
            headerStyle: hStyle,
            style: hStyle,
            accessor: 'ProfitCenter', // String-based value accessors!
            Cell: this.renderDelete
        }]

        const divStyle = {
            width: 620,
        }

        return (<div style={divStyle}><input type="button" value="add new profit center" onClick={this.handleAdd} className="ms-ButtonHeightWidth"></input>
        < ReactTable
            data={data}
            columns={columns}
            showPagination={false}
            minRows={1}
        /></div>)
    }
}

export default ProfitCenterAmountComponent;