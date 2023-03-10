function readMail() {
    sap.ui.core.BusyIndicator.show(0);
    var userDetails = getUserDetails();
    oPanel.setHeaderText(`Mail: ${userDetails.name} (${userDetails.username})`);

    var dateRange = oDateRangeSelection.getValue();
    var startDate, endDate;

    if (!dateRange) {
        startDate = new Date(new Date() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
        endDate = today;
        oDateRangeSelection.setDateValue(startDate);
        oDateRangeSelection.setSecondDateValue(endDate);
    }else{
        startDate = oDateRangeSelection.getDateValue(); // 7 days ago
        endDate = oDateRangeSelection.getSecondDateValue();        
    }

    //const endpoint = `https://graph.microsoft.com/v1.0/me/mailFolders('Inbox')/messages?\$filter=hasAttachments eq true and flag/flagStatus eq 'Flagged'&sentDateTime&\$top=25`;
    //const endpoint = `https://graph.microsoft.com/v1.0/me/mailFolders('Inbox')/messages?\$select=sender,subject,isRead,body,flag,hasAttachments,importance,sentDateTime&\$top=25`;
    const endpoint = `https://graph.microsoft.com/v1.0/me/mailFolders('Inbox')/messages?$select=sender,subject,isRead,body,flag,hasAttachments,importance,sentDateTime,receivedDateTime&$filter=receivedDateTime ge ${startDate.toISOString().replace(/\.\d{3}\w/, 'Z')} and receivedDateTime le ${endDate.toISOString().replace(/\.\d{3}\w/, 'Z')}&$top=999`;

    const headers = { Authorization: `${token}` };

    $.ajax({
        url: endpoint,
        type: "GET",
        dataType: "json",
        headers,
        success: (data) => {
            console.log(data);

            var emailArray = data.value;
            var arrMail = [];
            emailArray.forEach((mail, i) => {
                arrMail.push({
                    id: mail.id,
                    sendername: mail.sender.emailAddress.name,
                    senderemail: mail.sender.emailAddress.address,
                    subject: mail.subject,
                    isRead: mail.isRead,
                    body: mail.body.content,
                    bodyHTML: mail.body.contentType === "html",
                    bodyText: mail.body.contentType === "text",
                    flag: mail.flag.flagStatus === "notFlagged" ? false : true,
                    attachments: mail.hasAttachments,
                    importance: mail.importance,
                    sentDate: mail.sentDateTime,
                });
            });
            arrMail.sort((a, b) => new Date(b.sentDate) - new Date(a.sentDate));
            console.log("Mail", arrMail);
            sap.ui.core.BusyIndicator.hide();
            oPanel.setVisible(true);
            oButton.setVisible(false);
            oDateRangeSelection.setVisible(true);
            oButtonRefresh.setVisible(true);
            modeloTable.setData(arrMail);
            modeloTable.refresh();
        },
        error: (error) => {
            console.log(error);
            sap.ui.core.BusyIndicator.hide();
        },
    });
}
