function getCurrentPath() {
    var allLinks = oBreadcrumbs.getLinks();
    var currLink = allLinks[allLinks.length - 1];
    var customData = currLink.getCustomData();
    if (customData.length > 0)
        var fullPath = customData.find((data) => data.getKey() === "fullPath").getValue();
    else fullPath = __DRIVE_ROOT__;
    return fullPath;
}

function doBlur(id) {
    document.getElementById(id).blur();
}

function deleteFile(fObj) {
    const obj = fObj.isFolder ? "folder" : "file";
    sap.ui.core.BusyIndicator.show(0);
    const url = `https://graph.microsoft.com/v1.0/me/drive/items/${fObj.id}`;

    $.ajax({
        url: url,
        type: "DELETE",
        headers: {
            Authorization: token,
        },
    })
        .done(function (data, textStatus, jqXHR) {
            sap.ui.core.BusyIndicator.hide();
            console.log(`${obj} deleted successfully.`);
            sap.m.MessageToast.show(`Successfully deleted ${obj}: ${fObj.name} !`);
            refreshCurrentFolder();
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            sap.m.MessageToast.show(`Failed to delete ${obj}: ${fObj.name} !`);
            console.log(`Failed to delete ${obj}: ${fObj.name} !`);
            sap.ui.core.BusyIndicator.hide();
        });
}

function refreshCurrentFolder() {
    var fullPath = getCurrentPath();
    if (fullPath === __DRIVE_ROOT__) breadcrumbNavigate(`${fullPath}`);
    else breadcrumbNavigate(`${fullPath}:`);
}

function createFolder(folderName, currentPath) {
    sap.ui.core.BusyIndicator.show(0);
    const requestBody = {
        name: folderName,
        folder: {},
        "@microsoft.graph.conflictBehavior": "rename",
    };

    const resourcePath = currentPath === __DRIVE_ROOT__ ? currentPath.slice(0, -1) : `${currentPath}:`;

    // Define the API endpoint URL
    const url = `https://graph.microsoft.com/v1.0/me${resourcePath}/children`;

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(requestBody),
        headers: {
            Authorization: token,
        },
    })
        .done(function (data, textStatus, jqXHR) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show(`Folder '${folderName}' created successfully.`);
            console.log(`Folder '${folderName}' created successfully.`);
            refreshCurrentFolder();
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show(`Failed to create folder '${folderName}'.`);
            console.log(`Failed to create folder '${folderName}'.`);
        });
}

function highlightNew(dateStr){
    const now = new Date().getTime(); 
    const timestampMs = Date.parse(dateStr);
    if((now - timestampMs) <= 60 * 1000)
    return "Information";
    else
    return "None";
}