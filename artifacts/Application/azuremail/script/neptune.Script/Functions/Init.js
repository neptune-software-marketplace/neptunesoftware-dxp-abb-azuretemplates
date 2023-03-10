jQuery.sap.require("sap.ui.layout.cssgrid.GridBoxLayout");
jQuery.sap.require("sap.ui.core.format.FileSizeFormat");

// Globals
var helper;
var layout;



const today = new Date();
const clientId = "78c9f7c5-a236-41fd-b4c2-3a5000d26c7e";
const tenantId = "8fdb51da-e45d-423f-ae33-cf92118d5311";

var oFileSizeFormat = sap.ui.core.format.FileSizeFormat.getInstance({
    binaryFilesize: false,
    decimals: 2
});

const msalConfig = {
    auth: {
        clientId: clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        redirectUri: "https://gtmdemosystem.neptune-software.cloud/", //"https://gtmdemosystem.neptune-software.cloud/public/azure_redirect.html",
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you're having issues on Internet Explorer 11 or Edge
    },
};

// Add scopes for the ID token to be used at Microsoft identity platform endpoints.
const loginScopes = {
    scopes: ["openid", "User.Read", "Mail.Read"],
};

// Add scopes for the access token to be used at Microsoft Graph API endpoints.
const requestScopes = {
    scopes: ["Mail.Read"],
};

var aadApplication;
var token;

if (sap.n) {
    var localViewID = this.getId();
}

// InitLoad
sap.ui.getCore().attachInit(function () {
    setTimeout(function () {
        // Initialize Layout helper
        InitButControl();
        jQuery.sap.require("sap.f.FlexibleColumnLayoutSemanticHelper");
        var oSettings = {
            defaultTwoColumnLayoutType: sap.f.LayoutType.TwoColumnsMidExpanded,
            defaultThreeColumnLayoutType: sap.f.LayoutType.ThreeColumnsMidExpanded,
        };
        helper = new sap.f.FlexibleColumnLayoutSemanticHelper.getInstanceFor(
            oLayoutMain,
            oSettings
        );

        // Intial with Master Section only
        layout = helper.getNextUIState(0);
        oLayoutMain.setLayout(layout.layout);

        aadApplication = new msal.PublicClientApplication(msalConfig);
        var boxLayout = new sap.ui.layout.cssgrid.GridBoxLayout({ boxMinWidth: "20rem",  boxWidth: "20rem"});
        oGridList.setCustomLayout(boxLayout);

        oDateRangeSelection.setMaxDate(today);
        oDateRangeSelection._bMobile = true;

        oTable.addEventDelegate(
            {
                onAfterRendering: function () {
                    //console.log("table rendered...");
                    var allRows = oTable.getItems();
                    //console.log("allrows", allRows);
                    allRows.forEach((row, i) => {
                        var cellsOfRow = row.getCells();
                        //console.log("cells", cellsOfRow);
                        if (cellsOfRow[4].getIcon() === "sap-icon://email") {
                            row.addStyleClass("boldRow");
                        } else {
                            row.removeStyleClass("boldRow");
                        }
                    });
                },
            },
            oTable
        );
    }, 200);
});
