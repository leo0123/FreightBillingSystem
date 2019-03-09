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
            data: props.profitCenterAmounts,
            msg: ""
        };
        this.renderEditable = this.renderEditable.bind(this);
        this.renderSelect = this.renderSelect.bind(this);
        this.renderDelete = this.renderDelete.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.clearData = this.clearData.bind(this);
    }

    clearData() {
        let data = [];
        this.setState({ data });
    }

    handleAdd() {
        let data = this.state.data;
        data.push({
            ProfitCenter: "",
            BaseDuty: "",
            TrumpDuty: "",
            MechandiseFee: "",
            WaterwaysFee: "",
        });
        this.setState({ data });
    }

    renderDelete(cellInfo) {
        return (
            <input type="button" value="delete" className="ms-ButtonHeightWidth" onClick={e => {
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
                    let value = e.target.value;
                    if (value == "-select-") {
                        value = "";
                    }
                    data[cellInfo.index][cellInfo.column.id] = value;
                    this.setState({ data });
                    this.props.onChange(data);
                }}>
                <option key="">-select-</option>
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
        tryParseFloat = text => {
            if (text == "") {
                text = "0";
            }
            return parseFloat(text);
        };

        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.data];
                    //const regexp = /^(\d*\.)?\d+$/;
                    const regexp = /^\d+(\.\d\d?)?$/;
                    if (e.target.innerHTML == "" || regexp.test(e.target.innerHTML) == true) {
                        data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    } else {
                        alert(e.target.innerHTML + " is not valid number format");
                        e.target.innerHTML = "";
                        data[cellInfo.index][cellInfo.column.id] = "";
                        e.target.focus();
                    }
                    console.log("test:" + data[cellInfo.index][cellInfo.column.id]);
                    let amount = 0;
                    data.forEach(item => {
                        amount += tryParseFloat(item.BaseDuty)
                            + tryParseFloat(item.TrumpDuty)
                            + tryParseFloat(item.MechandiseFee)
                            + tryParseFloat(item.WaterwaysFee);
                    })
                    let msg = "Total amount:" + amount.toFixed(2);
                    this.setState({ data, msg });
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
            <div>{this.state.msg}</div>
            < ReactTable
                data={data}
                columns={columns}
                showPagination={false}
                minRows={1}
            /></div>)
    }
}

export default ProfitCenterAmountComponent;