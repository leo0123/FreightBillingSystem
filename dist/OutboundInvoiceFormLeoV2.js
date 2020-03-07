/// <reference path="../../tsd/jquery.d.ts" />
var Common;
(function (Common) {
    var SPHelper = (function () {
        function SPHelper() {
        }
        SPHelper.getListItems = function (options) {
            var selectFields = options.fields.join(',');
            var topQuery = options.top ? '&$top=' + options.top : '';
            var filterQuery = options.filter ? "&$filter=" + options.filter : '';
            var queryUrl = _spPageContextInfo.webServerRelativeUrl + ("/_api/web/lists/GetByTitle('" + options.title + "')/items?$select=" + selectFields + topQuery + filterQuery);
            return jQuery.ajax({
                url: queryUrl,
                method: 'GET',
                // accepts: 'application/json;odata=verbose',
                headers: {
                    'Accept': 'application/json;odata=verbose'
                }
            });
        };
        return SPHelper;
    })();
    Common.SPHelper = SPHelper;
    function assign(target) {
        var source = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            source[_i - 1] = arguments[_i];
        }
        source.forEach(function (s) {
            for (var p in s) {
                target[p] = s[p];
            }
        });
        return target;
    }
    Common.assign = assign;
})(Common || (Common = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../Common/SPHelper.ts" />
/// <reference path="../../tsd/SharePoint.d.ts" />
/// <reference path="../../tsd/react-global.d.ts" />
var Common;
(function (Common) {
    var HtmlSelect = (function (_super) {
        __extends(HtmlSelect, _super);
        function HtmlSelect(props) {
            _super.call(this, props);
        }
        HtmlSelect.prototype.render = function () {
            var options = this.props.options.slice();
            var sortedOptions = options.sort(function (op1, op2) {
                return op1.label > op2.label ? 1 : -1;
            });
            var options = sortedOptions.map(function (op) {
                return React.createElement("option", {"value": op.value, "key": op.value}, op.label);
            });
            return React.createElement("select", {"value": this.props.value, "onChange": this.onChange.bind(this)}, React.createElement("option", {"disabled": true, "value": ""}, "-select from list-"), options);
        };
        HtmlSelect.prototype.onChange = function (event) {
            if (this.props.onChange) {
                this.props.onChange(event.target.value);
            }
        };
        return HtmlSelect;
    })(React.Component);
    Common.HtmlSelect = HtmlSelect;
})(Common || (Common = {}));
/// <reference path="../Common/SPHelper.ts" />
/// <reference path="../../tsd/SharePoint.d.ts" />
/// <reference path="../../tsd/react-global.d.ts" />
var Common;
(function (Common) {
    var ReactFieldRenderer = (function () {
        function ReactFieldRenderer(ctx, component) {
            var _this = this;
            this.component = component;
            var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
            this.formCtx = formCtx;
            this.props = {
                value: formCtx.fieldValue,
                onChange: this.onChange.bind(this)
            };
            this.hostElementId = 'ReactFieldRenderer_' + formCtx.fieldName;
            formCtx.registerGetValueCallback(formCtx.fieldName, function () {
                return _this.props.value;
            });
            var self = this;
            formCtx.registerInitCallback(formCtx.fieldName, function () {
                self.onReady();
            });
            formCtx.registerValidationErrorCallback(formCtx.fieldName, function (error) {
                $get(self.hostElementId + '_error').innerHTML = error.errorMessage;
            });
        }
        ReactFieldRenderer.prototype.render = function (props) {
            var _props = Common.assign(this.props, props);
            this.formCtx.updateControlValue(this.formCtx.fieldName, this.props.value);
            this._render(_props);
        };
        ReactFieldRenderer.prototype._render = function (props) {
            var element = React.createElement(this.component, props, null);
            ReactDOM.render(element, document.getElementById(this.hostElementId));
        };
        ReactFieldRenderer.prototype.getHostNode = function () {
            return "<div id=\"" + this.hostElementId + "\"></div>\n     <span class=\"ms-formvalidation ms-csrformvalidation\" id=\"" + this.hostElementId + "_error\"></span>";
        };
        ReactFieldRenderer.prototype.onChange = function (value) {
            this.props.value = value;
            this._render(Common.assign(this.props, { value: value }));
        };
        return ReactFieldRenderer;
    })();
    Common.ReactFieldRenderer = ReactFieldRenderer;
})(Common || (Common = {}));
/// <reference path="../Common/SPHelper.ts" />
/// <reference path="../Common/Components.tsx" />
/// <reference path="../Common/ReactFieldRenderer.tsx" />
/// <reference path="../../tsd/SharePoint.d.ts" />
/// <reference path="../../tsd/react-global.d.ts" />
var Freight;
(function (Freight) {
    var ProfitCenterAmountItem = (function (_super) {
        __extends(ProfitCenterAmountItem, _super);
        function ProfitCenterAmountItem(props) {
            _super.call(this, props);
        }
        ProfitCenterAmountItem.prototype.render = function () {
            var self = this;
            return React.createElement("div", null, this.profitCenterSelect(), React.createElement("span", null, " $ "), React.createElement("input", {"placeholder": "Type amount here", "type": "number", "value": this.props.datum.amount, "onChange": this.onChangeAmount.bind(this)}), React.createElement("input", {"type": "button", "title": this.props.tooltip, "value": this.props.buttonText, "onClick": this.onClick.bind(this)}));
        };
        ProfitCenterAmountItem.prototype.profitCenterSelect = function () {
            var fake = React.createElement("option", {"disabled": true, "value": ""}, " --Select from list - ");
            var pcTitles = this.props.profitCenters.map(function (pc) { return pc.Title; });
            pcTitles.sort();
            var options = pcTitles.map(function (pct) {
                return React.createElement("option", {"value": pct, "key": pct}, pct);
            });
            return React.createElement("select", {"value": this.props.datum.profitCenter, "onChange": this.onChangeProfitCenter.bind(this)}, fake, options);
        };
        ProfitCenterAmountItem.prototype.onChangeProfitCenter = function (event) {
            var newDatum = {
                profitCenter: event.target.value,
                amount: this.props.datum.amount,
            };
            this.props.onChange(newDatum);
        };
        ProfitCenterAmountItem.prototype.onChangeAmount = function (event) {
            var newDatum = {
                profitCenter: this.props.datum.profitCenter,
                amount: event.target.value
            };
            this.props.onChange(newDatum);
        };
        ProfitCenterAmountItem.prototype.onClick = function (event) {
            this.props.onClick(this.props.datum);
        };
        return ProfitCenterAmountItem;
    })(React.Component);
    var ProfitCenterAmountField = (function (_super) {
        __extends(ProfitCenterAmountField, _super);
        function ProfitCenterAmountField(props) {
            _super.call(this, props);
            var data = this.parse(this.props.value);
            var newDatum = { profitCenter: '', amount: null };
            this.state = { data: data, newDatum: newDatum, adding: false };
        }
        ProfitCenterAmountField.prototype.render = function () {
            var _this = this;
            var self = this;
            var curProfitCenters = this.props.profitCenters; //.filter(p=> p.Company === this.props.company);
            var rows = this.state.data.map(function (datum, index) {
                return React.createElement(ProfitCenterAmountItem, {"onChange": _this.onItemChange.bind(_this, index), "profitCenters": curProfitCenters, "datum": datum, "key": index, "onClick": _this.remove.bind(_this, index), "buttonText": "Remove", "tooltip": "Remove this entry"});
            });
            var newButton = React.createElement("input", {"type": "button", "onClick": this.add.bind(this), "value": "Add New Entry"});
            var amountValidation = React.createElement("span", {"className": "ms-formvalidation", "id": "amountValidation"});
            return React.createElement("div", null, rows, newButton, " ", amountValidation);
        };
        ProfitCenterAmountField.prototype.onItemChange = function (index, datum) {
            var newData = this.state.data.slice();
            newData[index] = datum;
            this.setState({ data: newData });
            this.fireStateChange(newData);
        };
        ProfitCenterAmountField.prototype.fireStateChange = function (newData) {
            if (this.props.onChange) {
                var totalAmount = newData.map(function (d) { return d.amount; }).reduce(function (a, b) { return parseFloat(a) + parseFloat(b); }, 0);
                this.props.onChange(this.stringify(newData), totalAmount);
            }
        };
        ProfitCenterAmountField.prototype.add = function (datum) {
            var newData = this.state.data.slice();
            newData.push({ profitCenter: '', amount: null });
            // this.setState({ newDatum: { profitCenter: '', amount: null }, adding: false });
            this.setState({ data: newData });
            this.fireStateChange(newData);
        };
        ProfitCenterAmountField.prototype.remove = function (index) {
            var newData = this.state.data.slice();
            newData.splice(index, 1);
            this.setState({ data: newData });
            this.fireStateChange(newData);
        };
        ProfitCenterAmountField.prototype.stringify = function (data) {
            var arr = data.map(function (datum) { return (datum.profitCenter + ":" + datum.amount); });
            return arr.join(';');
        };
        ProfitCenterAmountField.prototype.parse = function (stringValue) {
            if (!stringValue) {
                return [];
            }
            var arr = stringValue.split(';');
            return arr.map(function (item) { var arr0 = item.split(':'); return { profitCenter: arr0[0], amount: arr0[1] }; });
        };
        return ProfitCenterAmountField;
    })(React.Component);
    function getProfitCenterOptions() {
        var nowString = (new Date()).toISOString();
        return Common.SPHelper.getListItems({
            title: 'ProfitCenterCostCenter',
            fields: ['Title', 'Company'],
            top: 5000,
            filter: encodeURIComponent("DateFrom le datetime'" + nowString + "' and DateTo gt datetime'" + nowString + "'"),
        });
        // http://sp2013portal.delta-corp.com/sites/freight/_api/web/lists/GetByTitle('ProfitCenterCostCenter')/items?$filter=DateFrom le datetime'2016-01-22T08:33:27.249Z' and DateTo gt datetime'2016-01-22T08:33:27.249Z'
    }
    var ProfitCenterAmountValidator = (function () {
        function ProfitCenterAmountValidator(isNewForm) {
            this.isNewForm = isNewForm;
        }
        ProfitCenterAmountValidator.prototype.Validate = function (value) {
            var customs = document.getElementById("Category_ed28b2c4-7ed2-4f59-b641-5594ca3a5ce5_$RadioButtonChoiceField2");
            if (customs.checked) {
                return new SPClientForms.ClientValidation.ValidationResult(false, '');
            }
            var purposeValue = document.getElementById('Purpose_771984a5-d2e4-4ffc-8acc-f497b74f253c_$DropDownChoice').value;
            if (purposeValue === 'freight import/export') {
                return new SPClientForms.ClientValidation.ValidationResult(false, '');
            }
            if (!value) {
                if (this.isNewForm) {
                    return new SPClientForms.ClientValidation.ValidationResult(true, "You can't leave this blank.");
                }
                var detailFieldRawValue = document.getElementById('Detail_54164cca-eca4-4c29-92e3-2c405828bb84_$UrlFieldUrl').value;
                var detailFieldHasValue = detailFieldRawValue && detailFieldRawValue !== "" && detailFieldRawValue !== "http://";
                if (!detailFieldHasValue) {
                    return new SPClientForms.ClientValidation.ValidationResult(true, "You can't leave this blank.");
                }
            }
            //match such pattern: AMD0A8:100;ASD0A:20;CES0A8:90
            var pattern = /^.+:-?[\d\.]+$/;
            var array = (value || '').split(';');
            for (var _i = 0; _i < array.length; _i++) {
                var item = array[_i];
                if (item.length === 0)
                    continue;
                var hasError = item.match(pattern) ? false : true;
                if (hasError) {
                    var message = 'You have some invalid data: ' + item;
                    return new SPClientForms.ClientValidation.ValidationResult(true, message);
                }
            }
            return new SPClientForms.ClientValidation.ValidationResult(false, '');
        };
        return ProfitCenterAmountValidator;
    })();
    Freight.ProfitCenterAmountValidator = ProfitCenterAmountValidator;
    Freight.ProfitCenterAmountEditField = function (ctx) {
        // const hasDetail = !!ctx.CurrentItem.Detail;
        var isNewForm = ctx.ControlMode === SPClientTemplates.ClientControlMode.NewForm;
        var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
        var fieldValue = formCtx.fieldValue;
        formCtx.registerGetValueCallback(formCtx.fieldName, function () {
            return fieldValue;
        });
        var validtors = new SPClientForms.ClientValidation.ValidatorSet();
        validtors.RegisterValidator(new ProfitCenterAmountValidator(isNewForm));
        formCtx.registerClientValidator(formCtx.fieldName, validtors);
        formCtx.registerValidationErrorCallback(formCtx.fieldName, function (error) {
            var control = document.getElementById('pcaError');
            control.innerHTML = error.errorMessage;
        });
        var companyControlID = 'CompanyCode_4c014a87-22c9-435e-a640-309c9608a9aa_$DropDownChoice';
        var companyControl = document.getElementById(companyControlID);
        function renderField(value, profitCenters) {
            var reactField = React.createElement(ProfitCenterAmountField, {"profitCenters": profitCenters, "value": value, "onChange": function (value, totalAmount) {
                fieldValue = value;
                showAmountValidation(totalAmount);
            }});
            ReactDOM.render(reactField, document.getElementById('profitCenterAmountContainer'));
        }
        getProfitCenterOptions().then(function (response) {
            // companyControl.addEventListener('change', (event) =>
            //     renderField(fieldValue, event.target.value, response.d.results)
            // );
            renderField(fieldValue, response.d.results);
        });
        function showAmountValidation(totalAmount) {
            if (!totalAmount) {
                return null;
            }
            var displayControl = document.getElementById('amountValidation');
            var amountControl = document.getElementById('Amount_08bfa0f1-1b7d-4b24-862d-eb8482fcfd32_$CurrencyField');
            var targetAmountString = amountControl.value.replace(',', '');
            var targetAmount = parseFloat(targetAmountString);
            var equal = Math.round(targetAmount * 100) === Math.round(totalAmount * 100) ? true : false;
            var totalAmountFixed = totalAmount.toFixed(2);
            displayControl.innerHTML = "<span style=\"color:" + (equal ? 'green' : 'red') + "\">Current Amount sum: " + totalAmountFixed + ", target amount: " + targetAmount + "</span>";
        }
        return '<div id="profitCenterAmountContainer"></div><span role="alert" class="ms-formvalidation" id="pcaError"/>';
    };
    Freight.ProfitCenterAmountDisplayField = function (ctx) {
        function stripPrefix(source, prefix) {
            if (!source) {
                return '';
            }
            if (source.indexOf(prefix) === 0) {
                return source.substring(prefix.length);
            }
            else {
                return source;
            }
        }
        function stripSuffix(source, suffix) {
            if (!source) {
                return '';
            }
            var sourceLen = source.length;
            var suffixLen = suffix.length;
            if (source.indexOf(suffix) === sourceLen - suffixLen) {
                return source.substring(0, sourceLen - suffixLen);
            }
            return source;
        }
        var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
        var value = formCtx.fieldValue;
        var striped = stripPrefix(value, "<div dir=\"\">");
        striped = stripSuffix(striped, "</div>");
        var arrString = striped ? striped.split(';') : [];
        var arr = arrString.map(function (a) { var pa = a.split(':'); return pa; });
        var body = arr.map(function (a) { return ("<tr><td>" + a[0] + "</td><td>" + a[1] + "</td></tr>"); });
        var bodyHtml = body.join('');
        var table = "<table><thead><tr><th><strong>Profit Center</strong></th><th><strong>Amount</strong></th></tr></thead><tbody>" + bodyHtml + "</tbody></table>";
        return table;
    };
    Freight.VendorNameEditField = function (ctx) {
        var categorySelector = 'input:radio[name="Category_ed28b2c4-7ed2-4f59-b641-5594ca3a5ce5_$RadioButtonChoiceField"]';
        if (location.host.indexOf('dev') > -1) {
            categorySelector = 'input:radio[name="Category_3745a2d2-2c07-423d-8adf-7336afe114d1_$RadioButtonChoiceField"]';
        }
        function findCheckCategory() {
            var checkedEles = jQuery(categorySelector).filter(function (index, radio) {
                return radio.checked;
            });
            return checkedEles[0].value;
        }
        var carrierMappingOptions = {
            title: 'CarrierMapping',
            fields: ['Carrier', 'Category'],
            top: 5000
        };
        var renderer = new Common.ReactFieldRenderer(ctx, Common.HtmlSelect);
        renderer.onReady = function () {
            Common.SPHelper.getListItems(carrierMappingOptions).then(function (res) {
                var vendors = {};
                res.d.results.forEach(function (v) { return vendors[v.Carrier + v.Category] = { Carrier: v.Carrier, Category: v.Category }; });
                var vendorArray = Object.keys(vendors).map(function (v) { return { value: vendors[v].Carrier, label: vendors[v].Carrier, category: vendors[v].Category }; });
                var curCategory = findCheckCategory();
                var curVendors = vendorArray.filter(function (v) { return v.category === curCategory; });
                jQuery(categorySelector).change(function () {
                    var _curCategory = findCheckCategory();
                    var _curVendors = vendorArray.filter(function (v) { return v.category === _curCategory; });
                    renderer.render({ value: '', options: _curVendors });
                });
                renderer.render({ options: curVendors });
            });
        };
        return renderer.getHostNode();
    };
})(Freight || (Freight = {}));
SPClientTemplates.TemplateManager.RegisterTemplateOverrides({
    Templates: {
        Fields: {
            'ProfitCenterAmount': {
                //NewForm: Freight.ProfitCenterAmountEditField,
                //EditForm: Freight.ProfitCenterAmountEditField,
                DisplayForm: Freight.ProfitCenterAmountDisplayField
            },
            'InvoiceType': {
                NewForm: Freight.VendorNameEditField,
                EditForm: Freight.VendorNameEditField
            }
        }
    }
});
_spBodyOnLoadFunctions.push(FreightInvoiceFormEnhance);
function FreightInvoiceFormEnhance() {
    var isInEditForm = _spPageContextInfo.serverRequestPath.indexOf('EditForm.aspx') > -1;
    var isInNewForm = _spPageContextInfo.serverRequestPath.indexOf('NewForm.aspx') > -1;
    var remarkId = 'Remark_246ee27e-e698-4eb9-99c6-866f3ca7d429_$TextField';
    var remarkElement = document.getElementById(remarkId);
    var statusID = 'Status_1ac4d3c1-8b26-45b3-84f5-05c0f417fbcf_$TextField';
    var statusElment = document.getElementById(statusID);
    statusElment.setAttribute('disabled', 'disabled');
    window.PreSaveAction = function () {
        if (isInNewForm && !hasAttachments()) {
            alert("Please add an attachment!");
            return false;
        }
        if (isInEditForm && !hasValue(document.getElementById('Remark_246ee27e-e698-4eb9-99c6-866f3ca7d429_$TextField').value)) {
            alert('Remark field is required in Edit mode');
            remarkElement.style.borderColor = 'red';
            return false;
        }
        return true;
    };
    function hasValue(v) {
        if (v) {
            return v.trim();
        }
        return false;
    }
    // function addRequiredForRemark(){
    //     const remarkNobr= remarkElement.parentNode.parentNode.parentNode.querySelector('nobr')
    //     remarkNobr.innerHTML = 'Remark <span class="ms-accentText" title="This is a required field."> *</span>';
    // }
    function hasAttachments() {
        var attachmentsTable = document.getElementById("idAttachmentsTable");
        var rows = attachmentsTable.getElementsByTagName("tr");
        if (rows.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
}
