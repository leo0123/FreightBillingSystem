import "babel-polyfill";
import "isomorphic-fetch";
import $ from "jquery";
import React from 'react';
import ReactDOM from 'react-dom';
import ProfitCenterAmountComponent from "./profitCenterAmountComponent.js";
var myUtility = require("my-utility").default;
//import myUtility from "./Utility.js";

var urlFactory = "http://ideltaam.deltaww.com/sites/freight/_api/web/lists/GetByTitle('Factories')/Items";
var urlProfitCenter = "http://ideltaam.deltaww.com/sites/freight/_api/web/lists/GetByTitle('ProfitCenterCostCenter')/Items";
var urlInvoice = "http://ideltaam.deltaww.com/sites/freight/_api/web/lists/GetByTitle('LogisticInvoices')/Items";
var headers = {
  "accept": "application/json;odata=verbose",
};

let getTR = element => {
  return element.parentsUntil("tr").last().parent();
};

$(document).ready(async function () {
  // let amountText = $("[id^='Amount_']");
  let categorySelect = $("[id^='Category_'][type=radio]");
  let profitCenterAmountTr = getTR($("#profitCenterAmountContainer"));
  let taxAmountTr = getTR($("[id^='TaxAmount_']"));
  let companySelect = $("[id^='CompanyCode_']");
  let profitCenterTaxAmountText = $("[id^='ProfitCenterTaxAmount_']");//ProfitCenterTaxAmount_
  let profitCenterTaxAmountTr = getTR(profitCenterTaxAmountText);
  profitCenterTaxAmountText.hide();
  // let customsRadio = getTR($("[id^='Category_'][type=radio][value='Customs']"));//Customs
  //customsRadio.hide();
  let categorySwitch = category => {
    if (category == "Customs") {
      profitCenterAmountTr.hide();
      taxAmountTr.hide();
      profitCenterTaxAmountTr.show();
    } else {
      profitCenterAmountTr.show();
      taxAmountTr.show();
      profitCenterTaxAmountTr.hide();
    }
  };
  categorySwitch(categorySelect.filter(":checked").val());
  categorySelect.change(function () {
    categorySwitch(this.value);
  })

  await profitCenterTaxAmountFunction(profitCenterTaxAmountText, companySelect);

  var path = window.location.pathname;
  var page = path.split("/").pop();
  var id = 0;
  // if (page == "EditForm.aspx") {
  //   id = myUtility.getParam("ID")
  // }
  if (page.indexOf('EditForm.aspx') > -1) {
    id = myUtility.getParam("ID")
  }

  var originalSaveButtonClickHandler;
  var saveButton = $("[name$='diidIOSaveItem']") //gets form save button and ribbon save button
  if (saveButton.length > 0) {
    originalSaveButtonClickHandler = saveButton[0].onclick;  //save original function
  }
  $(saveButton).attr("onclick", "window.myPreSaveAction2('" + id + "')"); //change onclick to execute our custom validation function

  var tbInvoiceDate = $("[id$='_Invoice_x0020_Date']");
  var cbFactory = $("[id^='Charge_x0020_to_x0020_Factory_']");
  var trFactory = cbFactory.parentsUntil("tr").last().parent();
  trFactory.hide();
  var ddlFactory = $("[id^='Factory_']");
  var trDdlFactory = ddlFactory.parentsUntil("tr").last().parent();
  // var txtRemark = $("<span>please enter Factory FI contact person name in Remark</span>");
  // var selectedFactory = ddlFactory.val();

  // ddlFactory.insertAfter(cbFactory);
  // cbFactory.parent().append(txtRemark);
  // ddlFactory.hide();
  // txtRemark.hide();
  // ddlFactory.empty();
  // ddlFactory.append($("<option></option>")
  //   .attr("value", "")
  //   .text(""));

  trDdlFactory.hide();

  // cbFactory.bind('change', function () {
  //   if (this.checked) {
  //     ddlFactory.show();
  //     txtRemark.show();
  //   } else {
  //     ddlFactory.hide();
  //     txtRemark.hide();
  //   }
  // });

  /*fetchFactories()
    .then(d => {
      d.results.forEach(item => {
        ddlFactory.append($("<option></option>")
          .attr("value", item.Title)
          .text(item.Description));
      });
      if (selectedFactory) {
        ddlFactory.val(selectedFactory);
      }
    });*/

  // window.myPreSaveAction3 = () => {
  //   var vendorName = $("#ReactFieldRenderer_InvoiceType > select").val();
  //     var invoiceNumber = $("[id^='Title_'][id$='_$TextField']").val();
  //     var company = $("[id^='CompanyCode_'][id$='_$DropDownChoice']").val();
  //     if (vendorName != null) {
  //       vendorName = vendorName.replace(/'/g, "''");
  //     }
  //     var url = urlInvoice + "?$filter="
  //       + "InvoiceType eq '" + vendorName + "'" //vendor
  //       + " and "
  //       + "Title eq '" + invoiceNumber + "'" // invoice#
  //       + " and "
  //       + "CompanyCode eq '" + company + "'";
  //     console.log(url);
  //     fetchJson(url).then(d => {
  //       console.log(d);
  //       console.log("originalSaveButtonClickHandler3");
  //       originalSaveButtonClickHandler();
  //       console.log("originalSaveButtonClickHandler3e");
  //     });
  // };

  window.myPreSaveAction2 = async id => {
    try {
      let amountText = $("[id^='Amount_']");
      amountText.focus();

      var vendorName = $("#ReactFieldRenderer_InvoiceType > select").val();
      var invoiceNumber = $("[id^='Title_'][id$='_$TextField']").val();
      var company = $("[id^='CompanyCode_'][id$='_$DropDownChoice']").val();
      if (vendorName != null) {
        vendorName = vendorName.replace(/'/g, "''");
      }
      var url = urlInvoice + "?$filter="
        + "InvoiceType eq '" + vendorName + "'" //vendor
        + " and "
        + "Title eq '" + invoiceNumber + "'" // invoice#
        + " and "
        + "CompanyCode eq '" + company + "'";
      if (id != "0") {
        url += " and ID ne " + id;
      }
      console.log(url);
      //if (id == "0") {
      var d = await fetchJson(url);
      if (d.results.length > 0) {
        alert("[" + vendorName + "][" + invoiceNumber + "][" + company + "] already exist");
        return false;
      }
      //}
      if (profitCenterTaxAmountValidation(categorySelect, amountText, profitCenterTaxAmountText) == false) {
        return false;
      }
    }
    catch (ex) {
      console.log(ex);
      return false;
    }
    // if (cbFactory.prop("checked") == true && ddlFactory.val() == "") {
    //   alert("Charge to Factory, please select Factory");
    //   return false;
    // }
    var today = new Date();
    var invoiceDate = Date.parse(tbInvoiceDate.val());
    if (isNaN(invoiceDate) || invoiceDate > today) {
      alert("invoice date not correct");
      return false;
    }
    console.log("original Save");
    var callOriginalSaveButtonClickHandler = setInterval(function () {
      console.log("original Save2");
      originalSaveButtonClickHandler();
      clearInterval(callOriginalSaveButtonClickHandler);
    }, 100);
    //originalSaveButtonClickHandler();
    return true;
  };
});

function profitCenterTaxAmountValidation(categorySelect, amountText, profitCenterTaxAmountText) {
  let customsMsg = $("#customsMsg");
  customsMsg.text("");
  if (categorySelect.filter(":checked").val() != "Customs") {//Customs
    return true;
  }
  let text = profitCenterTaxAmountText.val();
  if (text == '') {
    customsMsg.text("ProfitCenterTaxAmount can't be empty");
    return false;
  }
  let ProfitCenterTaxAmounts = JSON.parse(text);
  if (ProfitCenterTaxAmounts.length == 0) {
    customsMsg.text("ProfitCenterTaxAmount can't be empty");
    return false;
  }
  let isValid = true;
  let amount = 0;
  let tryParseFloat = text => {
    if (text == "") {
      text = "0";
    }
    return parseFloat(text);
  };
  ProfitCenterTaxAmounts.forEach(item => {
    if (item.ProfitCenter == "") {
      customsMsg.text("ProfitCenterTaxAmount ProfitCenter can't be empty");
      isValid = false;
    }
    amount += tryParseFloat(item.BaseDuty)
      + tryParseFloat(item.TrumpDuty)
      + tryParseFloat(item.MechandiseFee)
      + tryParseFloat(item.WaterwaysFee)
      + tryParseFloat(item.EntryFee);
  });
  let invoiceAmount = amountText.val();
  // console.log(Math.round(parseFloat(invoiceAmount) * 100));
  // console.log(Math.round(amount * 100));
  if (Math.round(parseFloat(invoiceAmount) * 100) != Math.round(amount * 100)) {
    customsMsg.text(`InvoiceAmount: ${invoiceAmount} and ProfitCenterTaxAmount: ${amount.toFixed(2)} not match`);
    isValid = false;
  }
  if (isValid) {
    customsMsg.text("");
  }
  return isValid;
}

async function profitCenterTaxAmountFunction(profitCenterTaxAmountText, companySelect) {
  //profitCenterTaxAmountText.hide();
  //let companySelect = $("[id^='CompanyCode_']");
  let customsContainer = $("<div id='customsContainer'></div>");
  profitCenterTaxAmountText.after(customsContainer);
  profitCenterTaxAmountText.after($("<div id='customsMsg' style='color:red'></div>"));
  let profitCenters;
  await fetchProfitCenters()
    .then(d => {
      profitCenters = d.results.map(item => {
        return {
          ProfitCenter: item.Title,
          Company: item.Company
        }
      });
    });
  let ProfitCenterTaxAmounts = [];
  console.log(profitCenterTaxAmountText.val());
  if (profitCenterTaxAmountText.val() != "") {
    ProfitCenterTaxAmounts = JSON.parse(profitCenterTaxAmountText.val());
  }
  let updateProfitCenterTaxAmounts = ProfitCenterTaxAmounts => {
    profitCenterTaxAmountText.val(JSON.stringify(ProfitCenterTaxAmounts));
  };
  let customsComponent = ReactDOM.render(
    <ProfitCenterAmountComponent
      profitCenters={profitCenters}
      company={companySelect}
      profitCenterAmounts={ProfitCenterTaxAmounts}
      onChange={updateProfitCenterTaxAmounts} />, customsContainer[0]
  );
  companySelect.change(() => {
    updateProfitCenterTaxAmounts([]);
    customsComponent.clearData();
    customsComponent.forceUpdate();
  });
}

async function fetchFactories() {
  return await fetchJson(urlFactory);
  // return await fetch(url, { credentials: "same-origin", headers: { "Accept": "application/json; odata=verbose" } })
  //   .then(response => {
  //     return response.json();
  //   });
}

async function fetchProfitCenters() {
  let now = new Date();
  let today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  return await fetchJson(urlProfitCenter + `?$top=999&$orderby=Title&$filter=DateFrom lt '${today}' and DateTo gt '${today}'`);
}

function fetchJson(url) {
  console.log(url);
  return fetch(url, {
    credentials: 'same-origin',
    headers: headers
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data.d;
    });
}


