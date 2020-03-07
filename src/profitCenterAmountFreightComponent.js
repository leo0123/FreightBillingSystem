import React, { Component } from "react";
import ReactTable from "react-table";
import 'react-table/react-table.css';

class ProfitCenterAmountFreightComponent extends Component {
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
        this.renderCheckbox = this.renderCheckbox.bind(this);
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
            Freight: "",
            Tariff: "",
            Inbound: "false",
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

    renderCheckbox(cellInfo){
        parseBool = e => {
            if ((typeof e) == "boolean"){
                return e;
            } else {
                return e=="true";
            }
        }

        return (
            <input type="checkbox" 
                checked={parseBool(this.state.data[cellInfo.index][cellInfo.column.id])}
                onChange={e=>{console.log(e.target.checked);
                    const data = [...this.state.data];
                    let value = e.target.checked;
                    data[cellInfo.index][cellInfo.column.id] = value.toString();
                    this.setState({ data });
                    this.props.onChange(data);    
                }}>
            </input>
        )
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

        editable = (index, column) => {
            if (column == "Tariff")
            {
                return this.state.data[index]["Inbound"];
            }
            return true;
        }

        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable={editable(cellInfo.index, cellInfo.column.id)}
                //contentEditable//={this.state.data[cellInfo.index]["Inbound"]}
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
                    console.log(data);
                    let amount = 0;
                    data.forEach(item => {
                        amount += tryParseFloat(item.Freight)
                            //+ tryParseFloat(item.Tariff)
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
            Header: 'Freight',
            headerStyle: hStyle,
            style: hStyle,
            width: 70,
            accessor: 'Freight', // String-based value accessors!
            Cell: this.renderEditable
        }, {
            Header: 'Tariff',
            headerStyle: hStyle,
            style: hStyle,
            width: 80,
            accessor: 'Tariff', // String-based value accessors!
            Cell: this.renderEditable
        }, {
            Header: 'Inbound',
            headerStyle: hStyle,
            style: hStyle,
            width: 60,
            accessor: 'Inbound', // String-based value accessors!
            Cell: this.renderCheckbox
        }, {
            Header: '',
            headerStyle: hStyle,
            style: hStyle,
            accessor: 'ProfitCenter', // String-based value accessors!
            Cell: this.renderDelete
        }]

        const divStyle = {
            width: 420,
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

export default ProfitCenterAmountFreightComponent;