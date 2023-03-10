const deleteItem = oEvent.getParameter("listItem");
const context = deleteItem.getBindingContext();
const fObj = context.getObject();
const obj = fObj.isFolder ? "folder":"file"

const errorMsg = fObj.isFolder ? `This ${obj} contains ${fObj.size}. \n Do you really want to delete ${obj}: ${fObj.name} ?` : `Do you really want to delete ${obj}: ${fObj.name} ?`
sap.m.MessageBox.confirm(
    errorMsg,
    {
        icon: sap.m.MessageBox.Icon.WARNING,
        title: `Delete ${obj} ?`,
        actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.NO],
        emphasizedAction: sap.m.MessageBox.Action.DELETE,
        initialFocus: "No",
        onClose: function (sAction) {
            if (sAction === "DELETE") {
                deleteFile(fObj);
            }
        },
    }
);
