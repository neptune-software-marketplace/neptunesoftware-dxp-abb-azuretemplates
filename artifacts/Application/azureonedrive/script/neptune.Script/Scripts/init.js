jQuery.sap.require("sap.ui.core.format.FileSizeFormat");
jQuery.sap.require("sap.m.MessageBox");


const __DRIVE_ROOT__ = "/drive/root:";

const clientId = "78c9f7c5-a236-41fd-b4c2-3a5000d26c7e";
const tenantId = "8fdb51da-e45d-423f-ae33-cf92118d5311";

var oFileSizeFormat = sap.ui.core.format.FileSizeFormat.getInstance({
    binaryFilesize: false,
    decimals: 2,
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
    scopes: ["openid", "User.Read", "Sites.ReadWrite.All"],
};

// Add scopes for the access token to be used at Microsoft Graph API endpoints.
const requestScopes = {
    scopes: ["Sites.ReadWrite.All"],
};

var aadApplication;

var token;

sap.ui.getCore().attachInit(function (data, navObj) {
    setTimeout(() => {
        aadApplication = new msal.PublicClientApplication(msalConfig);
        oLinkName.addEventDelegate({
            onAfterRendering: function (e) {
                setTimeout(doBlur, 1, e.srcControl.getId());
            },
        });
    }, 200);
});

