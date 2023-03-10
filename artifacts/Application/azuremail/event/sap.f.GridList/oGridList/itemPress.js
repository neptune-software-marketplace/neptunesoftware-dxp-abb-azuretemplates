//console.log("clicked");
var selectedItem = this.getSelectedItem();

if (selectedItem) {
    sap.ui.core.BusyIndicator.show(0);
    var context = selectedItem.getBindingContext();
    var fileObj = context.getObject();
    console.log(fileObj);
    decideDownload(fileObj);

    sap.ui.core.BusyIndicator.hide();
}
oGridList.removeSelections(true);