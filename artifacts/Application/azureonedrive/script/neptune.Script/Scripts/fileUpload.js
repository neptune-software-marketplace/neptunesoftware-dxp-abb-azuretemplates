function uploadFile(fileObj) {
    var fullPath = getCurrentPath();
    $.ajax({
        type: "POST",
        url: `https://graph.microsoft.com/v1.0/me${fullPath}/${fileObj.name}:/createUploadSession`,
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: token,
        },
    })
        .done(function (response) {
            console.log("Successfully got upload session.");
            console.log(response);

            var uploadUrl = response.uploadUrl;
            console.log(uploadUrl);
            uploadChunks(fileObj, uploadUrl);
            fUpload.setValue("");
        })
        .fail(function (response) {
            console.log("Could not get upload session: " + response.responseText);
            fUpload.setValue("");
        });
}

async function uploadChunks(file, uploadUrl) {
    var position = 0;
    var chunkLength = 6400 * 1024;
    console.log("File size is: " + file.size);

    oLabel.setText(`File: ${file.name}`);
    oProgressIndicator.setPercentValue(0);
    oProgressIndicator.setDisplayValue();
    oDialog.setTitle("Uploading File...");
    oDialog.setIcon("sap-icon://upload-to-cloud");
    oButtonAbort.setText("Abort upload");
    oDialog.open();

    var continueRead = true;
    while (continueRead) {
        var chunk;
        try {
            continueRead = true;
            //Try to read in the chunk
            try {
                let stopByte = position + chunkLength;

                chunk = await readFragmentAsync(file, position, stopByte);
                if (chunk.byteLength > 0) {
                    continueRead = true;
                } else {
                    break;
                }
            } catch (e) {
                fUpload.setValue("");
                break;
            }
            // Try to upload the chunk.
            try {
                let res = await uploadChunk(chunk, uploadUrl, position, file.size, file.name);
                // Check the response.
                if (res.status !== 202 && res.status !== 201 && res.status !== 200)
                    throw "Put operation did not return expected response";
                if (res.status === 201 || res.status === 200) {
                    //console.log("Reached last chunk of file.  Status code is: " + res.status);
                    continueRead = false;
                } else {
                    position = Number(res.json.nextExpectedRanges[0].split("-")[0]);
                }
            } catch (e) {
                console.log("Error occured when calling uploadChunk::" + e);
                fUpload.setValue("");
            }
        } catch (e) {
            continueRead = false;
            fUpload.setValue("");
        }
    }
}

// Reads in the chunk and returns a promise.
function readFragmentAsync(file, startByte, stopByte) {
    var frag = "";
    const reader = new FileReader();
    var blob = file.slice(startByte, stopByte);
    reader.readAsArrayBuffer(blob);
    return new Promise((resolve, reject) => {
        reader.onloadend = (event) => {
            if (reader.readyState === reader.DONE) {
                frag = reader.result;
                resolve(frag);
            }
        };
    });
}

function uploadChunk(chunk, uploadURL, position, totalLength, fileName) {
    var max = position + chunk.byteLength - 1;
    //console.log(chunk, uploadURL, position, totalLength)
    return new Promise((resolve, reject) => {
        //console.log("uploadURL:: " + uploadURL);
        try {
            let crHeader = "bytes " + position + "-" + max + "/" + totalLength;

            // create new XMLHttpRequest object
            var xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            // open PUT request
            xhr.open("PUT", uploadURL, true);
            // set headers
            xhr.setRequestHeader("Content-Range", crHeader);

            // set progress event listener
            xhr.upload.addEventListener("progress", (pr) => {
                //console.log("PR", position, pr.loaded, totalLength, pr.lengthComputable)
                if (pr.lengthComputable) {
                    const percent = Math.round(((position + pr.loaded) / totalLength) * 100);
                    oProgressIndicator.setPercentValue(percent);
                    oProgressIndicator.setDisplayValue(
                        `${oFileSizeFormat.format(
                            position + pr.loaded
                        )} of ${oFileSizeFormat.format(totalLength)} (${percent.toFixed(0)}%)`
                    );
                    if (pr.loaded === pr.total) oButtonAbort.detachPress(funcAbort);
                }
            });

            // set error event listener
            xhr.addEventListener("error", (event) => {
                console.error(`Error uploading chunk: ${event}`);
                reject(event);
            });

            var funcAbort = function (e) {
                xhr.abort();
                sap.m.MessageToast.show("Aborting upload...");
                fUpload.setValue("");
                setTimeout(() => {
                    oDialog.close();
                    oLabel.setText();
                    oProgressIndicator.setDisplayValue();
                    oProgressIndicator.setPercentValue(0);
                    sap.m.MessageToast.show("Upload aborted !");
                }, 500);
                console.log("Aborted");
                oButtonAbort.detachPress(funcAbort);
            };

            xhr.onloadstart = function () {
                oButtonAbort.attachPress(funcAbort);
            };
            // set load event listener
            xhr.addEventListener("load", (event) => {
                if (!xhr.response.nextExpectedRanges) {
                    //console.log("We've reached the end of the chunks.");
                    //Successfully uploaded !!!
                    oDialog.close();
                    sap.m.MessageToast.show(`Successfully uploaded file: ${fileName} !`);
                    fUpload.setValue("");
                    refreshCurrentFolder();
                }
                results = {};
                results.status = xhr.status;
                results.json = xhr.response;
                resolve(results);
            });

            // send the chunk data
            xhr.send(chunk);
        } catch (e) {
            console.log("exception inside uploadChunk::  " + e);
            fUpload.setValue("");
            reject(e);
        }
    });
}
