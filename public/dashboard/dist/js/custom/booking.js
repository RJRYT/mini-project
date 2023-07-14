/**
 * Custom API requests for dashboards
 */

/**
 * Appoinment Booking functions
*/
var BookingDataStore = {}, BookingDataStore2 = {};
$(function () {
    document.getElementById("Booking-formGeneral").onsubmit = function () {
        event.preventDefault();
        var PageText = document.getElementById("Booking-PageId");

        var Name = document.getElementById("Booking-Name").value;
        var Email = document.getElementById("Booking-Email").value;
        var PhNumber = document.getElementById("Booking-PhNumber").value;
        var Age = document.getElementById("Booking-Age").value;
        var Address = document.getElementById("Booking-Address").value;
        var Dob = document.getElementById("Booking-Dob").value;
        if (!Name) return showAlert('error', 'Update your name from profile section to continue.');
        if (!Email) return showAlert('error', 'Update your email from profile section to continue.');
        if (!PhNumber) return showAlert('error', 'Update your Phone number from profile section to continue.');
        if (!Age) return showAlert('error', 'Update your Age from profile section to continue.');
        if (!Address) return showAlert('error', 'Update your Home address from profile section to continue.');
        if (!Dob) return showAlert('error', 'Update your Date of birth from profile section to continue.');

        Swal.fire({
            title: 'Are you sure?',
            text: "Are you sure the above details are correct and proceed to next step.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Proceed!'
        }).then((result) => {
            if (result.isConfirmed) {
                var data = { "Name": Name, "Email": Email, "PhNumber": PhNumber, "Age": Age, "Address": Address, "Dob": Dob };
                Object.assign(BookingDataStore, data);
                Object.assign(BookingDataStore2, data);
                PageText.innerHTML = '(2/4)';
                $('div[id="BookingGeneralInfo"]').hide(1000);
                $('div[id="BookingTestdetails"]').show(1000);
            }
        })
    };
    document.getElementById("Booking-BackToGeneral").onclick = function () {
        var PageText = document.getElementById("Booking-PageId");
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                PageText.innerHTML = '(1/4)';
                $('div[id="BookingTestdetails"]').hide(1000);
                $('div[id="BookingGeneralInfo"]').show(1000);
            }
        })
    }
    document.getElementById("Booking-formTest").onsubmit = function () {
        event.preventDefault();
        var PageText = document.getElementById("Booking-PageId");
        var SubmitButton = document.getElementById("Booking-TestSubmit");
        var BookingDate = document.getElementById("Booking-Date");

        var Categories = document.getElementById("Booking-Categories").value;
        var Tests = document.getElementById("Booking-Tests").value;
        var SDate = document.getElementById("Booking-Date").value;
        var Time = document.getElementById("Booking-Time").value;
        var Hour = document.getElementById("Booking-Hour").value;

        if (!Categories) return showAlert('error', 'Select a valid category.');
        if (!Tests) return showAlert('error', 'Select a valid test.');
        if (!SDate) return showAlert('error', 'Select a valid date.');
        if (!Time) return showAlert('error', 'Select a valid time.');
        if (!Hour) return showAlert('error', 'Select a valid hour.');
        const CurrentDate = new Date();
        if (new Date(SDate) < CurrentDate) return showAlert('error', 'Please select a valid date from tommarow.');
        if (new Date(SDate) < new Date(BookingDate.min) || new Date(SDate) > new Date(BookingDate.max)) return showAlert('error', 'The selected date is not within the allowed range.');
        Swal.fire({
            title: 'Are you sure?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                const DateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var data = { "Categories": Categories, "Tests": Tests, "Date": SDate, "Time": Time, "Hour": Hour };
                var data2 = { "Categories": TestData[Categories].Name, "Tests": TestData[Categories].Tests.find(item => item.ID == Tests).Name, "Date": new Date(SDate).toLocaleDateString('en-US', DateOptions), "Time": TimeData[Time].Name, "Hour": TimeData[Time].Time.find(item => item.ID == Hour).Name };
                Object.assign(BookingDataStore, data);
                Object.assign(BookingDataStore2, data2);
                const GetApi = window.location.origin + "/api/info/test";
                const xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                SubmitButton.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div> Fetching'
                SubmitButton.disabled = true;
                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === this.DONE) {
                        const res = JSON.parse(this.responseText);
                        if (res.status === 200) {
                            var payment = { "Price": res.data.Price, "Tax": res.data.Tax, "Commission": res.data.Commission, "Total": res.data.Total };
                            Object.assign(BookingDataStore, payment);
                            Object.assign(BookingDataStore2, payment);
                            UpdateBookingDataToTable();
                            PageText.innerHTML = '(3/4)';
                            $('#TaxRate').text('(' + res.meta.Tax + ')');
                            $('#CommissionRate').text('(' + res.meta.Commission + ')');
                            $('div[id="BookingTestdetails"]').hide(1000);
                            $('div[id="BookingPayment"]').show(1000);
                        } else {
                            showAlert('error', res.message);
                        }
                        SubmitButton.innerHTML = "Next Step <i class='right fas fa-angle-right'></i";
                        SubmitButton.disabled = false;
                    } else {
                        if (xhr.status == 404) {
                            SubmitButton.innerHTML = "Next Step <i class='right fas fa-angle-right'></i";
                            return showAlert('error', 'An error occoured while fetching');
                        }
                    }
                });
                xhr.open("GET", GetApi + "/?test=" + Tests);
                xhr.setRequestHeader("Accept", "*/*");
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(null);
            }
        })
    }
    document.getElementById("Booking-BackToTests").onclick = function () {
        var PageText = document.getElementById("Booking-PageId");
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                PageText.innerHTML = '(2/4)';
                $('div[id="BookingPayment"]').hide(1000);
                $('div[id="BookingTestdetails"]').show(1000);
            }
        })
    }
    document.getElementById("Booking-ProceedPayment").onclick = function () {
        var PageText = document.getElementById("Booking-PageId");
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                PageText.innerHTML = '(4/4)';
                $('div[id="BookingPayment"]').hide(1000);
                $('div[id="BookingConfirmPayment"]').show(1000);
            }
        })
    }
    document.getElementById("Booking-BackToPayment").onclick = function () {
        var PageText = document.getElementById("Booking-PageId");
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                PageText.innerHTML = '(3/4)';
                $('div[id="BookingConfirmPayment"]').hide(1000);
                $('div[id="BookingPayment"]').show(1000);
            }
        })
    }
    document.getElementById("Booking-formConfirmPayment").onsubmit = function () {
        event.preventDefault();
        var SubmitButton = document.getElementById("Booking-CompleteBooking");

        var TransactionId = document.getElementById("Booking-TransactionId").value;
        var Password = document.getElementById("Booking-Password").value;

        if (!TransactionId) return showAlert('error', 'Provide a vaild transaction id');
        if (!Password) return showAlert('error', 'Provide your password to continue');
        Swal.fire({
            title: 'Are you sure?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                BookingDataStore.TransactionId = TransactionId;
                BookingDataStore.Password = Password;
                const PostApi = window.location.origin + "/api/new/appoinment";
                const xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                SubmitButton.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div> Wait a min...'
                SubmitButton.disabled = true;
                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === this.DONE) {
                        const res = JSON.parse(this.responseText);
                        if (res.status === 200) {
                            $('#AppoinmentCompleted').show(1000);
                            $('#Booking-MainSection').hide(1000);
                            showAlert('success', res.message);
                        } else {
                            showAlert('error', res.message);
                        }
                        SubmitButton.innerHTML = "Complete Booking";
                        SubmitButton.disabled = false;
                    } else {
                        if (xhr.status == 404) {
                            SubmitButton.innerHTML = "Complete Booking";
                            return showAlert('error', 'An error occoured while fetching');
                        }
                    }
                });
                xhr.open("POST", PostApi);
                xhr.setRequestHeader("Accept", "*/*");
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(BookingDataStore));
            }
        })
    }
    document.getElementById("Booking-Categories").onchange = function (event) {
        var Tests = document.getElementById("Booking-Tests");
        var Id = event.target.value;
        Tests.innerHTML = '';
        if (Id) {
            Tests.options.add(new Option("Select a Test", ""));
            TestData[Id].Tests.forEach(item => {
                Tests.options.add(new Option(item.Name, item.ID));
            })
        } else Tests.options.add(new Option("Select a Category", ""));
    }
    document.getElementById("Booking-Time").onchange = function (event) {
        var Hour = document.getElementById("Booking-Hour");
        var Id = event.target.value;
        Hour.innerHTML = '';
        if (Id) {
            Hour.options.add(new Option("Select a Hour", ""));
            TimeData[Id].Time.forEach(item => {
                Hour.options.add(new Option(item.Name, item.ID));
            })
        } else Hour.options.add(new Option("Select a Time", ""));
    }
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
    $('#ShowNewAppoinmentSection').click(() => {
        $('#AppoinmentLists').hide(1000);
        $('#Booking-MainSection').show(1000);
    })
    $('#ShowAppoinmentListSection').click(() => {
        $('#AppoinmentLists').show(1000);
        $('#Booking-MainSection').hide(1000);
    })
    $('#ShowAppoinmentListSection2').click(() => {
        $('#AppoinmentLists').show(1000);
        $('#AppoinmentCompleted').hide(1000);
        location.reload();
    })
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
function UpdateBookingDataToTable() {
    var ItemList = document.querySelectorAll('[data-booking]');
    for (let i = 0; i < ItemList.length; i++) {
        ItemList[i].innerHTML = BookingDataStore2[ItemList[i].dataset.booking] || "--";
    }
    var Cash = document.querySelectorAll('[data-payment]');
    for (let i = 0; i < Cash.length; i++) {
        Cash[i].innerHTML += "/-"
    }
}
var TestData = {};
function GetTestData() {
    var Category = document.getElementById("Booking-Categories");
    const GetApi = window.location.origin + "/api/info/testdata";
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const res = JSON.parse(this.responseText);
            if (res.status === 200) {
                TestData = res.data;
                Category.innerHTML = '';
                Category.options.add(new Option("Select a Category", ""));
                Object.keys(TestData).forEach((item) => {
                    Category.options.add(new Option(TestData[item].Name, TestData[item].ID));
                });
            }
        }
    });
    xhr.open("GET", GetApi);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(null);
}
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
                        Data.parentElement.parentElement.remove();
                        showAlert('success', res.message);
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
$(document).ready(() => {
    var SDate = document.getElementById("Booking-Date");
    var ModalDate = document.getElementById("appoinment-date");
    var CurrentDate = new Date();
    SDate.min = ModalDate.min = CurrentDate.toISOString().split('T')[0];
    const MaxDate = new Date(CurrentDate);
    MaxDate.setDate(MaxDate.getDate() + 10);
    SDate.max = ModalDate.max = MaxDate.toISOString().split('T')[0];
    GetTestData();
    $('#AppoinmentTable').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "responsive": false,
    });
    const nodeList = document.querySelectorAll('td[data-status]');
    for (let i = 0; i < nodeList.length; i++) {
        var status = parseInt(nodeList[i].dataset.status);
        if (status == 1) nodeList[i].innerHTML = '<span class="badge badge-secondary">Pending</span>';
        else if (status == 2) nodeList[i].innerHTML = '<span class="badge badge-info">Approved</span>';
        else if (status == 3) nodeList[i].innerHTML = '<span class="badge badge-danger">Rejected</span>';
        else if (status == 4) nodeList[i].innerHTML = '<span class="badge badge-warning">Sample Collected</span>';
        else if (status == 5) nodeList[i].innerHTML = '<span class="badge badge-success">Delivered to Lab</span>';
        else if (status == 6) nodeList[i].innerHTML = '<span class="badge badge-success">Done</span>';
        else if (status == 7) nodeList[i].innerHTML = '<span class="badge badge-info">Report Uploaded</span>';
        else if (status == 8) nodeList[i].innerHTML = '<span class="badge badge-danger">Cancelled</span>';
    }
})