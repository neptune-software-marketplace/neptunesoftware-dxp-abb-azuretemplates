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
                readDrive();
            })
            .catch((err) => {
                console.log("failed to get token : ", err);
                if (err instanceof msal.InteractionRequiredAuthError) {
                    aadApplication.acquireTokenPopup(loginScopes).then((response) => {
                        console.log("auth token", response);
                        token = response.accessToken;
                        readDrive();
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
                readDrive();
            })
            .catch(function (error) {
                console.log("User login was not successful.", error);
            });
    }
}


function getUserDetails(){
    var allAccounts = aadApplication.getAllAccounts();
    if(allAccounts.length > 0){
        return {
            "name": allAccounts[0].name,
            "username": allAccounts[0].username
        }
    }else{
        return null;
    }
}