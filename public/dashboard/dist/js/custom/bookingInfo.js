/**
 * Custom API requests for dashboards
 */

/**
 * Appoinment Booking functions
*/
var BookingDataStore = {}, BookingDataStore2 = {};
$(function () {
    document.getElementById("appoinment-time").onchange = function (event) {
        var Hour = document.getElementById("appoinment-hour");
        var Id = event.target.value;
        Hour.innerHTML = '';
        if (Id) {
            Hour.options.add(new Option("Select a Hour", ""));
            TimeData[Id].Time.forEach(item => {
                Hour.options.add(new Option(item.Name, item.ID));
            })
        } else Hour.options.add(new Option("Select a Time", ""));
    }
    $('#Form-EditAppoinment').submit(() => {
        const PutApi = window.location.origin + "/api/edit/appoinment"
        event.preventDefault();
        const date = document.getElementById("appoinment-date").value;
        const time = document.getElementById("appoinment-time").value;
        const hour = document.getElementById("appoinment-hour").value;
        const id = document.getElementById("appoinment-id").value;
        if (!date) return showAlert('error', 'Select a appoinment date to continue');
        if (!time) return showAlert('error', 'Select a appoinment time to continue');
        if (!hour) return showAlert('error', 'Select a appoinment hour to continue');
        $("#EditAppoinmentOverlay").show();
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                const res = JSON.parse(this.responseText);
                if (res.status === 200) {
                    showAlert('success', res.message);
                    _ReloadPage();
                } else {
                    showAlert('error', res.message);
                }
                $("#EditAppoinmentOverlay").hide();
            } else {
                if (xhr.status == 404) {
                    $("#EditAppoinmentOverlay").hide();
                    return showAlert('error', 'Failed to update appoinment');
                }
            }
        });
        xhr.open("PUT", PutApi);
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Content-Type", "application/json");
        let data = { id: id, date: date, time: time, hour: hour };
        xhr.send(JSON.stringify(data));
    })
});
const TimeData = {
    "morning": {
        "Time": [
            {
                "ID": "8:00to10:00",
                "Name": "8:00 AM to 10:00 AM"
            },
            {
                "ID": "10:00to12:00",
                "Name": "10:00 AM to 12:00 PM"
            }
        ],
        "Name": "Morning"
    },
    "afternoon": {
        "Time": [
            {
                "ID": "1:30to2:30",
                "Name": "1:30 PM to 2:30 PM"
            },
            {
                "ID": "2:30to3:30",
                "Name": "2:30 PM to 3:30 PM"
            }
        ],
        "Name": "After Noon"
    },
    "evening": {
        "Time": [
            {
                "ID": "4:00to6:00",
                "Name": "4:00 PM to 6:00 PM"
            },
            {
                "ID": "6:30to8:00",
                "Name": "6:30 PM to 8:00 PM"
            },
            {
                "ID": "8:30to10:00",
                "Name": "8:30 PM to 10:00 PM"
            }
        ],
        "Name": "Evening"
    }
};

function EditAppoinmentData(Data) {
    const id = Data.dataset.id;
    $('#EditAppoinment').modal('show');
    $("#EditAppoinmentOverlay").show();
    const GetApi = window.location.origin + "/api/view/appoinment";
    const date = document.getElementById("appoinment-date");
    const time = document.getElementById("appoinment-time");
    const hour = document.getElementById("appoinment-hour");
    const bookingID = document.getElementById("appoinment-id");
    date.value = time.value = hour.value = '';
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const res = JSON.parse(this.responseText);
            if (res.status === 200) {
                $("#EditAppoinmentOverlay").hide();
                bookingID.value = res.data.ID;
                date.value = new Date(res.data.Date).toISOString().slice(0, 10);
                time.value = res.data.Time;
                hour.options.add(new Option("Select a Hour", ""));
                TimeData[res.data.Time].Time.forEach(item => {
                    hour.options.add(new Option(item.Name, item.ID));
                })
                hour.value = res.data.Hour;
            } else {
                $('#EditAppoinment').modal('hide');
                showAlert('error', res.message);
            }
        } else {
            if (xhr.status == 404) {
                $('#EditAppoinment').modal('hide');
                return showAlert('error', 'An error occoured while fetching');
            }
        }
    });
    xhr.open("GET", GetApi + "/?id=" + id);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(null);
}
function DeleteAppoinmentData(Data) {
    const id = Data.dataset.id;
    Swal.fire({
        title: 'Are you sure?',
        text: "Are you sure to delete this appoinment",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Proceed!'
    }).then((result) => {
        if (result.isConfirmed) {
            const DeleteApi = window.location.origin + "/api/delete/appoinment";
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                    const res = JSON.parse(this.responseText);
                    if (res.status === 200) {
                        showAlert('success', res.message);
                        window.location.href = '/dashboard/booking';
                    } else {
                        showAlert('error', res.message);
                    }
                } else {
                    if (xhr.status == 404) {
                        return showAlert('error', 'An error occoured while fetching');
                    }
                }
            });
            xhr.open("DELETE", DeleteApi);
            xhr.setRequestHeader("Accept", "*/*");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify({id:id}));
        }
    })
}
function CancelAppoinmentData(Data) {
    const id = Data.dataset.id;
    Swal.fire({
        title: 'Are you sure?',
        text: "Are you sure to cancel this appoinment",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Proceed!'
    }).then((result) => {
        if (result.isConfirmed) {
            const PutApi = window.location.origin + "/api/cancel/appoinment";
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                    const res = JSON.parse(this.responseText);
                    if (res.status === 200) {
                        showAlert('success', res.message);
                        _ReloadPage();
                    } else {
                        showAlert('error', res.message);
                    }
                } else {
                    if (xhr.status == 404) {
                        return showAlert('error', 'An error occoured while fetching');
                    }
                }
            });
            xhr.open("PUT", PutApi);
            xhr.setRequestHeader("Accept", "*/*");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify({id:id}));
        }
    })
}
$(document).ready(() => {
    var ModalDate = document.getElementById("appoinment-date");
    var CurrentDate = new Date();
    ModalDate.min = CurrentDate.toISOString().split('T')[0];
    const MaxDate = new Date(CurrentDate);
    MaxDate.setDate(MaxDate.getDate() + 10);
    ModalDate.max = MaxDate.toISOString().split('T')[0];

    const Node = document.querySelector('div[data-status]');
    if (Node) {
        var status = parseInt(Node.dataset.status);
        if (status == 1) Node.innerHTML = '<span class="badge badge-secondary">Pending</span>';
        else if (status == 2) Node.innerHTML = '<span class="badge badge-info">Approved</span>';
        else if (status == 3) Node.innerHTML = '<span class="badge badge-danger">Rejected</span>';
        else if (status == 4) Node.innerHTML = '<span class="badge badge-warning">Sample Collected</span>';
        else if (status == 5) Node.innerHTML = '<span class="badge badge-success">Delivered to Lab</span>';
        else if (status == 6) Node.innerHTML = '<span class="badge badge-success">Done</span>';
        else if (status == 7) Node.innerHTML = '<span class="badge badge-info">Report Uploaded</span>';
        else if (status == 8) Node.innerHTML = '<span class="badge badge-danger">Cancelled</span>';
    }
})