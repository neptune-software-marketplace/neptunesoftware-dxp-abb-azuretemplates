function signIn() {
    // check if there is a cached identity for user
    const currentAccounts = aadApplication.getAllAccounts();
    if (currentAccounts.length > 0) {
        // user identity found - get access token and embed report
        accountId = currentAccounts[0].homeAccountId;
        let tokenRequest = requestScopes;
        tokenRequest.account = accountId;
        aadApplication
            .acquireTokenSilent(tokenRequest)
            .then((response) => {
                console.log("silent token", response);
                token = response.accessToken;
                readMail();
            })
            .catch((err) => {
                console.log("failed to get token : ", err);
                if (err instanceof msal.InteractionRequiredAuthError) {
                    aadApplication.acquireTokenPopup(loginScopes).then((response) => {
                        console.log("auth token", response);
                        token = response.accessToken;
                        readMail();
                    });
                }
            });
    } else {
        // user identity not found - show Sign-in button
        aadApplication
            .loginPopup(loginScopes)
            .then((response) => {
                console.log("auth token", response);
                token = response.accessToken;
                readMail();
            })
            .catch(function (error) {
                console.log("User login was not successful.", error);
            });
    }
}

function getUserDetails() {
    var allAccounts = aadApplication.getAllAccounts();
    if (allAccounts.length > 0) {
        return {
            name: allAccounts[0].name,
            username: allAccounts[0].username,
        };
    } else {
        return null;
    }
}

function decideDownload(fileObj) {
    if (fileObj.contentType === "message/rfc822") {
        // const endpoint = `https://graph.microsoft.com/beta/me/messages/${fileObj.id}/$expand=attachments`;
        // const headers = { Authorization: `${token}` };
        // $.ajax({
        //     url: endpoint,
        //     type: "GET",
        //     dataType: "json",
        //     headers,
        //     success: (data) => {
        //         console.log(data);
        //         fileObj.contentBytes = data.responseText;
        //         downloadFile(fileObj);
        //         sap.ui.core.BusyIndicator.hide();
        //     },
        //     error: (error) => {
        //         console.log(error);
        //         sap.ui.core.BusyIndicator.hide();
        //     },
        //});
        //-------------- > The former code can be used to see the content of an email msg. It is a propreitory microsoft format so cannot be converted to.
        sap.m.MessageToast.show(
            "Downloading *.msg is not currently supported by this application !"
        );
    } else {
        downloadFile(fileObj);
    }
}

function downloadFile(fileObj) {
    const contentType = fileObj.contentType;
    const contentBytes = fileObj.contentBytes;
    const blob = b64toBlob(contentBytes, contentType);

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileObj.name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(blob);
}

function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}
