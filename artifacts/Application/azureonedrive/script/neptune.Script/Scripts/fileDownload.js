function downloadFile(fileObj) {
    //console.log(fileObj);
    if (fileObj.downloadUrl) {
        //sap.ui.core.BusyIndicator.show(0);
        oLabel.setText(`File: ${fileObj.name}`);
        oProgressIndicator.setPercentValue(0);
        oProgressIndicator.setDisplayValue();
        oDialog.setTitle("Downloading File...");
        oDialog.setIcon("sap-icon://download-from-cloud");
        oButtonAbort.setText("Abort download");
        oDialog.open();
        var endpoint = fileObj.downloadUrl;
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open("GET", endpoint, true);
        xmlHTTP.responseType = "blob";
        xmlHTTP.onload = function (e) {
            oDialog.close();
            const filename = fileObj.name;
            const data = xmlHTTP.response;
            const url = URL.createObjectURL(data);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            sap.ui.core.BusyIndicator.hide();
            URL.revokeObjectURL(data);
        };
        xmlHTTP.onloadstart = function () {
            var funcAbort = function (e) {
                xmlHTTP.abort();
                sap.m.MessageToast.show("Aborting download...");
                fUpload.setValue("");
                setTimeout(() => {
                    oDialog.close();
                    oLabel.setText();
                    oProgressIndicator.setDisplayValue();
                    oProgressIndicator.setPercentValue(0);
                    sap.m.MessageToast.show("Download aborted !");
                }, 500);
                console.log("Aborted");
                oButtonAbort.detachPress(funcAbort);
            };
            oButtonAbort.attachPress(funcAbort);
        };

        xmlHTTP.onprogress = function (pr) {
            //console.log(pr.loaded, pr.total);
            const percent = (pr.loaded / pr.total) * 100;
            oProgressIndicator.setPercentValue(percent);
            oProgressIndicator.setDisplayValue(
                `${oFileSizeFormat.format(pr.loaded)} of ${oFileSizeFormat.format(pr.total)} (${percent.toFixed(2)}%)`
            );
        };
        xmlHTTP.onerror = (event) => {
            console.log(event);
            oDialog.close();
            //sap.ui.core.BusyIndicator.hide();
            console.error(`Error downloading file: ${xmlHTTP.responseJSON.error.message}`);
        };
        xmlHTTP.send();
    } else {
        window.open(fileObj.webUrl, "_blank");
    }
}