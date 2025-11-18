// Code.gs - Apps Script
const SPREADSHEET_ID = "1Gp1vAQ8o5jD0dfNvlr7R4oKzaLtnXiqUk7nxWXdVQgk"; // e.g. "1AbcDeFG..."
// optional: sheet name
const SHEET_NAME = "Orders";

function doPost(e) {
  try {
    // parse JSON
    const body = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if(!sheet){
      sheet = ss.insertSheet(SHEET_NAME);
      // header row
      sheet.appendRow([
        "Timestamp","Customer Name","Email","Phone",
        "Door","Street","Locality","Landmark","City","State","Country","Pincode",
        "Chicken_weight","Chicken_qty","Chicken_price","Chicken_total",
        "Mutton_weight","Mutton_qty","Mutton_price","Mutton_total",
        "Fish_weight","Fish_qty","Fish_price","Fish_total",
        "Prawns_weight","Prawns_qty","Prawns_price","Prawns_total",
        "GrandTotal","RawPayload"
      ]);
    }

    // build row
    const c = body.customer || {};
    const items = body.items || {};
    const row = [
      new Date(),
      c.name || "",
      c.email || "",
      c.phone || "",
      (c.address && c.address.door) || "",
      (c.address && c.address.street) || "",
      (c.address && c.address.locality) || "",
      (c.address && c.address.landmark) || "",
      (c.address && c.address.city) || "",
      (c.address && c.address.state) || "",
      (c.address && c.address.country) || "",
      (c.address && c.address.pincode) || "",
      (items.chicken && items.chicken.weightText) || "",
      (items.chicken && items.chicken.qty) || 0,
      (items.chicken && items.chicken.weightValue) || 0,
      (items.chicken && items.chicken.lineTotal) || 0,
      (items.mutton && items.mutton.weightText) || "",
      (items.mutton && items.mutton.qty) || 0,
      (items.mutton && items.mutton.weightValue) || 0,
      (items.mutton && items.mutton.lineTotal) || 0,
      (items.fish && items.fish.weightText) || "",
      (items.fish && items.fish.qty) || 0,
      (items.fish && items.fish.weightValue) || 0,
      (items.fish && items.fish.lineTotal) || 0,
      (items.prawns && items.prawns.weightText) || "",
      (items.prawns && items.prawns.qty) || 0,
      (items.prawns && items.prawns.weightValue) || 0,
      (items.prawns && items.prawns.lineTotal) || 0,
      body.grandTotal || 0,
      JSON.stringify(body)
    ];

    sheet.appendRow(row);

    // return success
    return ContentService
      .createTextOutput(JSON.stringify({result:"ok"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err){
    return ContentService
      .createTextOutput(JSON.stringify({result:"error", message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
