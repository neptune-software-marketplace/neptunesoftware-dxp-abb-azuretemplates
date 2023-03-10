$("#oPanel-content").empty();
var selectedAppo = oEvent.getParameter("appointment");
if (selectedAppo) {
    var appoObj = selectedAppo.getBindingContext().getObject();
    modeloDialog.setData(appoObj);

    sap.ui.core.BusyIndicator.show(0);

    const endpoint = `https://graph.microsoft.com/v1.0/me/calendarView/${appoObj.id}/attachments/`;
    const headers = { Authorization: `${token}` };

    $.ajax({
        url: endpoint,
        type: "GET",
        dataType: "json",
        headers,
        success: (data) => {
            var inlineImgArr = data.value;
            var parser = new DOMParser();
            var doc = parser.parseFromString(appoObj.html, "text/html");
            if (inlineImgArr.length > 0) {
                console.log(inlineImgArr);

                var images = doc.querySelectorAll("img");

                for (var i = 0; i < images.length; i++) {
                    var foundImg = inlineImgArr.find(
                        (el) => el.contentId === images[i].src.substr(4)
                    );
                    if (foundImg)
                        images[
                            i
                        ].src = `data:${foundImg.contentType};base64, ${foundImg.contentBytes}`;
                }
            }
            oHTMLObject.setContent(new XMLSerializer().serializeToString(doc));
            sap.ui.core.BusyIndicator.hide();
            oDialog.open();
            selectedAppo.setSelected(false);
        },
        error: (error) => {
            console.log(error);
            sap.ui.core.BusyIndicator.hide();
        },
    });
}
