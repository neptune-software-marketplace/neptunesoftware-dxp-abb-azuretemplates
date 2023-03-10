function getFileIconClass(fileObj) {
    const fileName = fileObj.name;
    isFolder = fileObj.folder;
    const fileType = fileName.split(".").pop().toLowerCase();
    if (isFolder) {
        return "sap-icon://fa-solid/folder";
    } else {
        switch (fileType) {
            case "pdf":
                return "sap-icon://fa-regular/file-pdf";
            case "doc":
            case "docx":
            case "odt":
                return "sap-icon://fa-regular/file-word";
            case "xls":
            case "xlsx":
            case "ods":
                return "sap-icon://fa-regular/file-excel";
            case "ppt":
            case "pptx":
            case "odp":
                return "sap-icon://fa-regular/file-powerpoint";
            case "txt":
            case "csv":
            case "json":
            case "md":
                return "sap-icon://fa-regular/file-alt";
            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
            case "bmp":
            case "svg":
            case "odg":
                return "sap-icon://fa-regular/file-image";
            case "mp3":
            case "wav":
            case "aac":
            case "flac":
                return "sap-icon://fa-regular/file-audio";
            case "mp4":
            case "avi":
            case "mov":
            case "wmv":
            case "mkv":
                return "sap-icon://fa-regular/file-video";
            case "zip":
            case "rar":
            case "7z":
            case "tar":
            case "gz":
                return "sap-icon://fa-regular/file-archive";
            case "html":
            case "htm":
            case "css":
            case "js":
            case "php":
            case "py":
            case "java":
            case "cpp":
                return "sap-icon://fa-regular/file-code";
            case "ai":
            case "psd":
            case "eps":
            case "indd":
            case "cdr":
                return "sap-icon://fa-regular/file-design";
            case "pages":
            case "numbers":
            case "key":
                return "sap-icon://fa-regular/file-apple";
            default:
                return "sap-icon://fa-regular/file";
        }
    }
}