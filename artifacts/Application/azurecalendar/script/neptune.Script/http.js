function readCalendar(myDate) {
    sap.ui.core.BusyIndicator.show(0);
    var userDetails = getUserDetails();
    oSinglePlanningCalendar.setTitle(`Calendar: ${userDetails.name} (${userDetails.username})`);
    var today;
    if (myDate) {
        today = myDate;
    } else {
        today = new Date();
    }
    const startOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay()
    );
    const endOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay() + 6
    );

    //const endpoint = `https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${startOfWeek.toISOString()}&endDateTime=${endOfWeek.toISOString()}&\$top=100`;
    const endpoint = `https://graph.microsoft.com/v1.0/me/calendarView?\$select=attendees,isAllDay,start,end,subject,organizer,body,showAs&startDateTime=${startOfWeek.toISOString()}&endDateTime=${endOfWeek.toISOString()}&\$top=100`;
    const headers = { Authorization: `${token}` };

    $.ajax({
        url: endpoint,
        type: "GET",
        dataType: "json",
        headers,
        success: (data) => {
            console.log(data);
            var appoArray = data.value;
            var arrCal = [];
            appoArray.forEach((appo, i) => {
                arrCal.push({
                    id: appo.id,
                    start: appo.isAllDay
                        ? new Date(appo.start.dateTime)
                        : new Date(appo.start.dateTime + "Z"),
                    end: appo.isAllDay
                        ? new Date(appo.end.dateTime)
                        : new Date(appo.end.dateTime + "Z"),
                    title: appo.subject,
                    info: appo.organizer.emailAddress.name,
                    type: appo.isAllDay ? "Type02" : "Type07",
                    allday: appo.isAllDay,
                    html: appo.body.content,
                    tentative: appo.showAs === "tentative",
                    attendees: getAttendees(appo.attendees)
                });
            });
            console.log(arrCal);
            modeloSinglePlanningCalendar.setData(arrCal);
            modeloSinglePlanningCalendar.refresh();
            oSinglePlanningCalendar.setVisible(true);
            sap.ui.core.BusyIndicator.hide();
            oButton.setVisible(false);
        },
        error: (error) => {
            console.log(error);
            sap.m.MessageToast.show(`Error: ${error.responseJSON.error.message} !`);
            sap.ui.core.BusyIndicator.hide();
        },
    });
}

function getAttendees(attendees){
    var retStr = "";
    if(attendees.length === 0){
        retStr = "None";
    }else{
        attendees.forEach((attendee) => {
            retStr += `${attendee.emailAddress.name}(${attendee.emailAddress.address}) - ${attendee.type.toUpperCase()} \n`
        });
    }
    return retStr;
}

// function uuidv4() {
//     return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
//         var r = (Math.random() * 16) | 0,
//             v = c == "x" ? r : (r & 0x3) | 0x8;
//         return v.toString(16);
//     });
// }
