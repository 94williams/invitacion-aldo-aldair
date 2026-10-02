function doPost(e) {
  const parameters = e && e.parameter ? e.parameter : {};
  const requestId = String(parameters.requestId || "");
  let result;

  try {
    const name = String(parameters.name || "").trim().replace(/\s+/g, " ");
    const count = Number(parameters.count);

    if (!/^[\w-]{1,100}$/.test(requestId)) throw new Error("Solicitud inválida.");
    if (!name || name.length > 120) throw new Error("Nombre inválido.");
    if (!Number.isInteger(count) || count < 1 || count > 6) throw new Error("Cantidad de asistentes inválida.");

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) throw new Error("El proyecto debe estar vinculado a una hoja de cálculo.");

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const confirmations = spreadsheet.getSheetByName("Confirmaciones") || spreadsheet.insertSheet("Confirmaciones");
      if (confirmations.getLastRow() === 0) {
        confirmations.appendRow(["Familia", "Asistentes", "Última actualización"]);
        confirmations.setFrozenRows(1);
      }

      const summary = spreadsheet.getSheetByName("Resumen") || spreadsheet.insertSheet("Resumen");
      summary.getRange("A1:B3").setValues([
        ["Resumen de confirmaciones", ""],
        ["Familias confirmadas", ""],
        ["Asistentes confirmados", ""]
      ]);
      summary.getRange("B2").setFormula("=COUNTA(Confirmaciones!A2:A)");
      summary.getRange("B3").setFormula("=SUM(Confirmaciones!B2:B)");

      const normalizedName = name.toLowerCase();
      const lastRow = confirmations.getLastRow();
      const existingNames = lastRow > 1
        ? confirmations.getRange(2, 1, lastRow - 1, 1).getDisplayValues()
        : [];
      const existingIndex = existingNames.findIndex((row) => row[0].trim().replace(/\s+/g, " ").toLowerCase() === normalizedName);
      const rowNumber = existingIndex >= 0 ? existingIndex + 2 : lastRow + 1;

      confirmations.getRange(rowNumber, 1, 1, 3).setValues([[name, count, new Date()]]);
      confirmations.getRange(rowNumber, 3).setNumberFormat("dd/mm/yyyy hh:mm");
      summary.autoResizeColumns(1, 2);
      SpreadsheetApp.flush();
      result = { type: "rsvp-result", requestId: requestId, ok: true };
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error(error);
    result = { type: "rsvp-result", requestId: requestId, ok: false };
  }

  const safeResult = JSON.stringify(result).replace(/</g, "\\u003c");
  return HtmlService.createHtmlOutput("<script>window.parent.postMessage(" + safeResult + ", '*');</script>")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
