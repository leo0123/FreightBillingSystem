import "babel-polyfill";
import "isomorphic-fetch";
import $ from "jquery";

var urlFactory = "http://ideltaam.deltaww.com/sites/freight/_api/web/lists/GetByTitle('Factories')/Items";
var urlInvoice = "http://ideltaam.deltaww.com/sites/freight/_api/web/lists/GetByTitle('LogisticInvoices')/Items";
var headers = {
  "accept": "application/json;odata=verbose",
};

$(document).ready(function () {
  var tbInvoiceDate = $("[id$='_Invoice_x0020_Date']");

  var cbFactory = $("[id^='Charge_x0020_to_x0020_Factory_']");
  var trFactory = cbFactory.parentsUntil("tr").last().parent();
  trFactory.hide();
  var ddlFactory = $("[id^='Factory_']");
  var trDdlFactory = ddlFactory.parentsUntil("tr").last().parent();
  var txtRemark = $("<span>please enter Factory FI contact person name in Remark</span>");
  var selectedFactory = ddlFactory.val();

  //cbFactory.parent().append(ddlFactory);
  ddlFactory.insertAfter(cbFactory);
  cbFactory.parent().append(txtRemark);
  ddlFactory.hide();
  txtRemark.hide();
  ddlFactory.empty();//.children().remove();
  ddlFactory.append($("<option></option>")
    .attr("value", "")
    .text(""));

  trDdlFactory.hide();

  cbFactory.bind('change', function () {
    if (this.checked) {
      ddlFactory.show();
      txtRemark.show();
    } else {
      ddlFactory.hide();
      txtRemark.hide();
    }
  });

  fetchFactories()
    .then(d => {
      d.results.forEach(item => {
        ddlFactory.append($("<option></option>")
          .attr("value", item.Title)
          .text(item.Description));
      });
      if (selectedFactory) {
        ddlFactory.val(selectedFactory);
      }
    });

  window.myPreSaveAction = async () => {
    try {
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
      console.log(url);
      var d = await fetchJson(url);
      if (d.results.length > 0) {
        alert("[" + vendorName + "][" + invoiceNumber + "][" + company + "] already exist");
        return false;
      }
    }
    catch (ex) {
      return false;
    }
    if (cbFactory.prop("checked") == true && ddlFactory.val() == "") {
      alert("Charge to Factory, please select Factory");
      return false;
    }
    var today = new Date();
    var invoiceDate = Date.parse(tbInvoiceDate.val());
    if (invoiceDate > today) {
      return false;
    }
    return true;
  }
});

async function fetchFactories() {
  return await fetchJson(urlFactory);
  // return await fetch(url, { credentials: "same-origin", headers: { "Accept": "application/json; odata=verbose" } })
  //   .then(response => {
  //     return response.json();
  //   });
}

function fetchJson(url) {
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


