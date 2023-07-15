

document.getElementById('SearchForm').onsubmit = () => {
    event.preventDefault();
    const id = document.getElementById("search").value;
    if (!id) return;
    if (LastSearchId == id) return;
    const GetApi = window.location.origin + "/admin/api/search/appoinment";
    const SearchBtn = document.getElementById("SearchBtn");
    const ErrorMsg = document.getElementById("ErrorMsg");
    const DataTable = document.getElementById("DataTable");
    const ShowDetails = document.getElementById("ShowDetails");
    SearchBtn.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div> Searching'
    SearchBtn.disabled = true;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const res = JSON.parse(this.responseText);
            if (res.status === 200) {
                LastSearchId = id;
                DataTable.style.display = 'block';
                ShowDetails.innerHTML = `<td>1</td><td>${res.data.ID}</td><td>${res.data.Patient}</td><td>${res.data.Date}</td><td>${res.data.Tests}</td><td data-status="${res.data.Status}"></td><td data-action="${res.data.Status}"></td>`;
                LoadActions();
            } else {
                ErrorMsg.innerHTML = res.message;
            }
            SearchBtn.innerHTML = '<i class="right fas fa-search"></i> Search';
            SearchBtn.disabled = false;
        } else {
            if (xhr.status == 404) {
                ErrorMsg.innerHTML = "An unknown Error occoured";
                SearchBtn.innerHTML = '<i class="right fas fa-search"></i> Search';
            }
        }
    });
    xhr.open("GET", GetApi + "/?id=" + id);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(null);
}
$('#Form-UploadResult').submit(() => {
    event.preventDefault();
    const report = document.getElementById('report').files[0];
    const id = document.getElementById('appoinment-id').value;
    const remarks = document.getElementById('remarks').value;
    const PostApi = window.location.origin + "/admin/api/appoinment/upload/result";
    if(!report) return showAlert('error','Please select a report as .pdf file');
    if (!report.type.includes('pdf')) return showAlert('error', 'Please select a pdf');
    $("#UploadResultOverlay").show();
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const res = JSON.parse(xhr.responseText);
                if (res.status == 200) {
                    $('#UploadResult').modal('hide');
                    showAlert('success', res.message);
                    _ReloadPage();
                } else {
                    $("#UploadResultOverlay").hide();
                    showAlert('error', res.message);
                }
            } else {
                $("#UploadResultOverlay").hide();
                showAlert('error', "Failed to upload report");
            }
        }
    });
    xhr.open("POST", PostApi);
    const formData = new FormData();
    formData.append('report', report);
    formData.append('id', id);
    formData.append('remarks', remarks);
    xhr.send(formData);
})
let LastSearchId = null;

function LoadActions() {
    const Status = document.querySelector('td[data-status]');
    if (Status) {
        var status = parseInt(Status.dataset.status);
        if (status == 1) Status.innerHTML = '<span class="badge badge-secondary">Pending</span>';
        else if (status == 2) Status.innerHTML = '<span class="badge badge-info">Approved</span>';
        else if (status == 3) Status.innerHTML = '<span class="badge badge-danger">Rejected</span>';
        else if (status == 4) Status.innerHTML = '<span class="badge badge-warning">Sample Collected</span>';
        else if (status == 5) Status.innerHTML = '<span class="badge badge-success">Delivered to Lab</span>';
        else if (status == 6) Status.innerHTML = '<span class="badge badge-success">Done</span>';
        else if (status == 7) Status.innerHTML = '<span class="badge badge-info">Report Uploaded</span>';
        else if (status == 8) Status.innerHTML = '<span class="badge badge-danger">Cancelled</span>';
    }
    const Action = document.querySelector('td[data-action]');
    if (Action) {
        var action = parseInt(Action.dataset.action);
        if (action == 6) Action.innerHTML = `<a class="btn btn-success btn-sm" data-id="${LastSearchId}" onclick="UploadReport(this)"><i class="fas fa-upload"></i></a>`;
        else Action.innerHTML = `<a class="btn btn-info btn-sm" onclick="window.location.href = '/admin/appoinments/${LastSearchId}'"><i class="fas fa-eye"></i></a>`;
    }
}

function UploadReport(appoinment) {
    const id = appoinment.dataset.id;
    $('#UploadResult').modal('show');
    $("#UploadResultOverlay").show();
    const bookingID = document.getElementById("appoinment-id");
    const GetApi = window.location.origin + "/admin/api/view/appoinment";
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const res = JSON.parse(this.responseText);
            if (res.status === 200) {
                if (res.data.Status != 6) {
                    showAlert('error', 'Report can only be uploaded after sample collection');
                    $('#UploadResult').modal('hide');
                } else {
                    bookingID.value = res.data.ID;
                    $("#UploadResultOverlay").hide();
                }
            } else {
                $('#UploadResult').modal('hide');
                showAlert('error', res.message);
            }
        } else {
            if (xhr.status == 404) {
                $('#UploadResult').modal('hide');
                return showAlert('error', 'An error occoured while fetching');
            }
        }
    });
    xhr.open("GET", GetApi + "/?id=" + id);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(null);
}
