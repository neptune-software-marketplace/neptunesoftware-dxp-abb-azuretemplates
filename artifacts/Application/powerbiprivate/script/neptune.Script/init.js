var reportId;
const clientId = "Your Application (client) ID";
const tenantId = "Your tenant Id";

const msalConfig = {
    auth: {
        clientId: clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        redirectUri: "redirect URL, same you configured on Microsoft Entra admin center ", 
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you're having issues on Internet Explorer 11 or Edge
    }
};


// Add scopes for the ID token to be used at Microsoft identity platform endpoints.
const loginScopes = {
    scopes: ["openid", "https://analysis.windows.net/powerbi/api/Report.Read.All"]
};

// Add scopes for the access token to be used at Microsoft Graph API endpoints.
const requestScopes = {
    scopes: ["https://analysis.windows.net/powerbi/api/Report.Read.All"] //["https://analysis.windows.net/powerbi/api/.default"]
};

var aadApplication;
var modeloSelect = new sap.ui.model.json.JSONModel();

var token;

sap.ui.getCore().attachInit(function(data, navObj) {
    setTimeout(() => {
        var oListItem = new sap.ui.core.ListItem("oListItem",{text:"{name}",key:"{id}"});
        oSelect.setModel(modeloSelect);
        oSelect.bindAggregation("items",{path:"/",template:oListItem,templateShareable:false});
        powerbi.reset(document.getElementById('container'));
        aadApplication = new msal.PublicClientApplication(msalConfig);
    }, 200);

});


function embedReport(token, reportId) {
    var models = window['powerbi-client'].models; // or window.powerbi.models

    var embedConfiguration = {
        type: 'report',
        id: reportId,
        embedUrl: 'https://app.powerbi.com/reportEmbed',
        tokenType: models.TokenType.Aad,
        accessToken: token,
        settings: {
            panes: {
                filters: {
                    visible: false
                },
                pageNavigation: {
                    visible: true
                }
            }
        }
    };


    // Get a reference to the embedded report HTML element
    var embedContainer = document.getElementById('container');
    powerbi.reset(embedContainer);
    // Embed the report and display it within the div container.
    var report = powerbi.embed(embedContainer, embedConfiguration);

    report.on('error', (error) => {
        console.log('PowerBI Error: ', error);
        sap.m.MessageToast.show(`PowerBI Error: ${error.detail.detailedMessage}`);
    });

    report.on('loaded', () => {
        //console.log('Loaded !');
        //getReports();
    });
}
