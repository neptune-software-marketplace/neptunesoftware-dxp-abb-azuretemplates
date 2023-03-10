function readDrive() {
    sap.ui.core.BusyIndicator.show(0);
    var userDetails = getUserDetails();
    oPanel.setHeaderText(`OneDrive: ${userDetails.name} (${userDetails.username})`);
    breadcrumbNavigate(__DRIVE_ROOT__);
}

function getFolder(oEvent) {
    var customData = oEvent.getSource().getCustomData();
    var fullPath = customData.find((data) => data.getKey() === "fullPath").getValue();
    fullPath += ":";
    breadcrumbNavigate(fullPath);
}

function getDriveObjArr(driveArray) {
    var arrDrive = [];
    driveArray.forEach((driveObj, i) => {
        arrDrive.push({
            id: driveObj.id,
            name: driveObj.name,
            modified: driveObj.lastModifiedDateTime,
            modifiedBy: driveObj.lastModifiedBy.user.displayName,
            size: driveObj.folder
                ? `${driveObj.folder.childCount} ${
                      driveObj.folder.childCount === 1 ? "item" : "items"
                  }`
                : oFileSizeFormat.format(driveObj.size),
            isFolder: driveObj.folder ? true : false,
            fullPath: driveObj.parentReference.path,
            webUrl: driveObj.webUrl,
            downloadUrl: driveObj["@microsoft.graph.downloadUrl"],
            fileIcon: getFileIconClass(driveObj),
            highlight: highlightNew(driveObj.createdDateTime),
        });
    });
    console.log("arrDrive", arrDrive);
    return arrDrive;
}

function breadcrumbNavigate(fullPath) {
    //console.log("Breadcrumb Navigate", fullPath);
    const resourcePath = fullPath === __DRIVE_ROOT__ ? fullPath.slice(0, -1) : fullPath;
    sap.ui.core.BusyIndicator.show(0);
    const endpoint = `https://graph.microsoft.com/v1.0/me${resourcePath}/children?$top=999&$sort=name asc`;
    const headers = { Authorization: token };
    $.ajax({
        url: endpoint,
        type: "GET",
        dataType: "json",
        headers,
        accept: "application/json;odata.metadata=none",
        success: (data) => {
            var arrDrive;
            if (data.value.length !== 0) {
                console.log("Files: ", data);
                arrDrive = getDriveObjArr(data.value);
            } else {
                //sap.m.MessageToast.show("You do not have any items in the folder !");
                //sap.ui.core.BusyIndicator.hide();
                arrDrive = [];
            }
            modeloTable.setData(arrDrive);
            modeloTable.refresh();
            buildBreadcrumbNav(fullPath);
            oButton.setVisible(false);
            oPanel.setVisible(true);
            sap.ui.core.BusyIndicator.hide();
        },
        error: (error) => {
            console.log(error);
            sap.m.MessageToast.show(`Error: ${error.responseJSON.error.message} !`);
            sap.ui.core.BusyIndicator.hide();
        },
    });
}

function buildBreadcrumbNav(fullPath) {
    var link;
    if (fullPath !== __DRIVE_ROOT__) {
        fullPath = fullPath.slice(0, -1);
    }
    var pathParts = fullPath.replace(__DRIVE_ROOT__, "Root").split("/");
    oBreadcrumbs.removeAllLinks();
    for (i = 0; i < pathParts.length; i++) {
        if (pathParts[i] === "Root") {
            link = new sap.m.Link({
                text: pathParts[i],
                emphasized: true,
                //press: signIn,
                press: readDrive,
            });
            pathParts[i] = __DRIVE_ROOT__;
        } else {
            link = new sap.m.Link({
                text: pathParts[i],
                press: getFolder,
                emphasized: true,
                customData: new sap.ui.core.CustomData({
                    key: "fullPath",
                    value: pathParts.slice(0, i + 1).join("/"),
                }),
            });
        }
        oBreadcrumbs.addLink(link);
    }
}
