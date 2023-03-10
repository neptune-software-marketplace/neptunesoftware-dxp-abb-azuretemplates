function getReports() {
    $.ajax({
        headers: {
            "Authorization": "Bearer " + token
        },
        url: 'https://api.powerbi.com/v1.0/myorg/reports',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('Data: ', data.value);
            if (data.value.length > 0) {
                var reportId = data.value[0].id;
                embedReport(token, reportId);
                modeloSelect.setData(data.value);
                modeloSelect.refresh(true);
                oSelect.setSelectedKey(reportId);
                oLabel.setVisible(true);
                oSelect.setVisible(true);
                oButtonRefresh.setVisible(true);
                oButton.setVisible(false);
            }else{
                sap.m.MessageToast.show("There are no Power BI Reports in your account !");
            }
        },
        error: function(request, error) {
            console.log("Error: ", request.statusText);
            if (request.responseJSON) {
                sap.m.MessageToast.show("Error loading Power BI Reports: " + request.responseJSON.error.message);
            } else {
                sap.m.MessageToast.show("Error loading Power BI Reports: " + request.statusText);
            }
        }
    });
}
