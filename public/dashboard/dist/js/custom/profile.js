/**
 * Custom API requests for dashboards
 */

/**
 * Profile Modification functions
*/
$(function () {

    document.getElementById("formChangeName").onsubmit = function () {
        const namechangeapi = window.location.origin + "/api/changename";
        event.preventDefault();
        var cname = document.getElementById("cname").value;
        var cnameHidden = document.getElementById("urCurrentName").value;
        var newname = document.getElementById("newname").value;
        var cnewname = document.getElementById("cnewname").value;
        var password = document.getElementById("namechangepass").value;
        var SubmitButton = document.getElementById("changeNameSubmit");
        if (cname != cnameHidden) return showAlert('error', 'Enter your current correct name.');
        if (cnameHidden == newname) return showAlert('error', 'This is your current name. Enter another name.');
        if (newname != cnewname) return showAlert('error', 'New name and Confirm new name must be same');
        SubmitButton.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div> Changing Name'
        SubmitButton.disabled = true;
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        this.reset();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                const res = JSON.parse(this.responseText);
                if (res.status === 200) {
                    SubmitButton.innerHTML = "Name Changed";
                    showAlert('success', res.message);
                } else {
                    SubmitButton.innerHTML = "Change Name";
                    showAlert('error', res.message);
                }
                SubmitButton.disabled = false;
            } else {
                if (xhr.status == 404) {
                    SubmitButton.innerHTML = "Change Name";
                    return showAlert('error', 'Failed to change name');
                }
            }
        });
        xhr.open("POST", namechangeapi);
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Content-Type", "application/json");
        let data = { currentname: cname, name: newname, password: password }
        xhr.send(JSON.stringify(data));
    };

    document.getElementById("formChangeEmail").onsubmit = function () {
        const emailchangeapi = window.location.origin + "/api/changeemail";
        event.preventDefault();
        var cemail = document.getElementById("cemail").value;
        var cEmailHidden = document.getElementById("urCurrentEmail").value;
        var newemail = document.getElementById("newemail").value;
        var cnewemail = document.getElementById("cnewemail").value;
        var password = document.getElementById("emailchangepass").value;
        var SubmitButton = document.getElementById("changeEmailSubmit");
        if (cemail != cEmailHidden) return showAlert('error', 'Enter your current correct email.');
        if (cEmailHidden == newemail) return showAlert('error', 'This is your current email. Enter another email.');
        if (newemail != cnewemail) return showAlert('error', 'New email and Confirm new email must be same');
        SubmitButton.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div> Changing Email'
        SubmitButton.disabled = true;
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        this.reset();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                const res = JSON.parse(this.responseText);
                if (res.status === 200) {
                    SubmitButton.innerHTML = "Email Changed";
                    showAlert('success', res.message);
                } else {
                    SubmitButton.innerHTML = "Change Email";
                    showAlert('error', res.message);
                }
                SubmitButton.disabled = false;
            } else {
                if (xhr.status == 404) {
                    SubmitButton.innerHTML = "Change Email";
                    return showAlert('error', 'Failed to change email');
                }
            }
        });
        xhr.open("POST", emailchangeapi);
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Content-Type", "application/json");
        let data = { currentemail: cemail, email: newemail, password: password }
        xhr.send(JSON.stringify(data));
    };

    document.getElementById("formChangePass").onsubmit = async function () {
        const passchangeapi = window.location.origin + "/api/changepass";
        event.preventDefault();
        var cpass = document.getElementById("cpass").value;
        var newpass = document.getElementById("newpass").value;
        var cnewpass = document.getElementById("cnewpass").value;
        var SubmitButton = document.getElementById("changePassSubmit");
        if (cpass == newpass) return showAlert('error', 'New password and current password cant be same');
        if (newpass != cnewpass) return showAlert('error', 'New password and Confirm new password must be same');
        SubmitButton.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div> Changing Password'
        SubmitButton.disabled = true;
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        this.reset();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                const res = JSON.parse(this.responseText);
                if (res.status === 200) {
                    SubmitButton.innerHTML = "Password Changed";
                    showAlert('success', res.message);
                } else {
                    SubmitButton.innerHTML = "Change Password";
                    showAlert('error', res.message);
                }
                SubmitButton.disabled = false;
            } else {
                if (xhr.status == 404) {
                    SubmitButton.innerHTML = "Change Password";
                    return showAlert('error', 'Failed to change password');
                }
            }
        });
        const { value: password } = await Swal.fire({
            title: 'Confirm Change password',
            text: 'You are going to change your current password. To confirm enter new password.',
            input: 'password',
            inputLabel: 'Password',
            inputPlaceholder: 'Enter new password',
            inputAttributes: {
                maxlength: 10,
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true
        })

        if (password) {
            if (newpass == password) {
                xhr.open("POST", passchangeapi);
                xhr.setRequestHeader("Accept", "*/*");
                xhr.setRequestHeader("Content-Type", "application/json");
                let data = { currentpass: cpass, newpass: newpass }
                xhr.send(JSON.stringify(data));
            } else Swal.fire(`Password doesn't match. Process cancelled`), SubmitButton.innerHTML = "Change Password", SubmitButton.disabled = false;
        } else Swal.fire(`Process cancelled`), SubmitButton.innerHTML = "Change Password", SubmitButton.disabled = false;
    };

    document.getElementById("formUpdateProfile").onsubmit = function () {
        const Updateapi = window.location.origin + "/api/updateprofile";
        event.preventDefault();
        var gender = document.getElementById("gender").value;
        var dateofbirth = document.getElementById("dateofbirth").value;
        var age = document.getElementById("age").value;
        var blood = document.getElementById("blood").value;
        var height = document.getElementById("height").value;
        var weight = document.getElementById("weight").value;
        var password = document.getElementById("updateppass").value;
        var number = document.getElementById("PhNumber").value;
        var address = document.getElementById("Address").value;
        var SubmitButton = document.getElementById("updateProfileSubmit");

        SubmitButton.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div> Updating Profile'
        SubmitButton.disabled = true;
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        this.reset();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                const res = JSON.parse(this.responseText);
                if (res.status === 200) {
                    SubmitButton.innerHTML = "Profile Updated";
                    showAlert('success', res.message);
                } else {
                    SubmitButton.innerHTML = "Update profile";
                    showAlert('error', res.message);
                }
                SubmitButton.disabled = false;
            } else {
                if (xhr.status == 404) {
                    SubmitButton.innerHTML = "Update profile";
                    return showAlert('error', 'Failed to Update profile');
                }
            }
        });
        xhr.open("POST", Updateapi);
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Content-Type", "application/json");
        let data = { gender: gender, dob: dateofbirth, age: age, blood: blood, height: height, weight: weight, number: number, address: address, password: password }
        xhr.send(JSON.stringify(data));
    };

    document.getElementById("formChangePic").onsubmit = function () {
        var SelectedFile = document.getElementById('uploadProfilePic').files[0];
        var Input = document.getElementById('uploadProfilePic');
        var Reset = document.getElementById("resetprofilepic");
        var SubmitButton = document.getElementById("changeprofilepic");

        var UploadStatus = document.getElementById("UploadStatus");
        var UploadBar = document.getElementById("progress-bar");
        var progressBar = document.getElementById("progress");

        event.preventDefault();
        if (!SelectedFile) return showAlert('error', 'Please select a file');
        if (!SelectedFile.type.includes('image')) return showAlert('error', 'Please select a Image');
        SubmitButton.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div> Uploading Image'
        SubmitButton.disabled = true;
        Input.disabled = true;
        Reset.disabled = true;
        const xhr = new XMLHttpRequest();

        var started_at = new Date()
        var lastNow = new Date().getTime();
        var lastKBytes = 0;

        UploadBar.style.display = "block";
        xhr.upload.onload = () => {
            UploadStatus.innerHTML = `The upload is completed`
            UploadBar.style.display = "none";
        }
        xhr.upload.onerror = () => {
            UploadStatus.innerHTML = 'Download failed.'
            UploadBar.style.display = "none";
        }
        xhr.upload.onabort = () => {
            UploadStatus.innerHTML = 'Download cancelled.'
            UploadBar.style.display = "none";
        }
        var uploadstr = "";
        xhr.upload.onprogress = event => {
            let percents = Math.round(100 * event.loaded / event.total);
            uploadstr = `File is ` + percents + `% uploaded.<br>`;
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                progressBar.style.width = `${percentComplete}%`;
            }

            var loaded = event.loaded;
            var total = event.total;

            var seconds_elapsed = (new Date().getTime() - started_at.getTime()) / 1000; var bytes_per_second = seconds_elapsed ? loaded / seconds_elapsed : 0;
            var remaining_bytes = total - loaded;
            var seconds = seconds_elapsed ? remaining_bytes / bytes_per_second : 'calculating';
            uploadstr += "Time Remaining: " + Math.trunc(seconds) + "s<br>";

            if (event.lengthComputable) {
                var now = new Date().getTime();
                var bytes = event.loaded;
                var total = event.total;
                var percent = bytes / total * 100;
                var kbytes = bytes / 1024;
                var mbytes = kbytes / 1024;
                var uploadedkBytes = kbytes - lastKBytes;
                var elapsed = (now - lastNow) / 1000;
                var kbps = elapsed ? uploadedkBytes / elapsed : 0;
                lastKBytes = kbytes;
                lastNow = now;
                uploadstr += mbytes.toFixed(2) + "MB (" + percent.toFixed(2) + "%) " + kbps.toFixed(2) + "KB/s"
            }
            UploadStatus.innerHTML = uploadstr;
        }
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                const res = JSON.parse(this.responseText);
                if (res.status === 200) {
                    document.getElementById("profilepic1").src = document.getElementById("uploadPreview").src
                    document.getElementById("profilepic2").src = document.getElementById("uploadPreview").src
                    document.getElementById("picDetails").innerHTML = "";
                    document.getElementById("picDetails2").innerHTML = "Choose file";
                    UploadBar.style.display = "none";
                    UploadStatus.innerHTML = "";
                    SubmitButton.innerHTML = "Image Uploaded";
                    showAlert('success', res.message);
                } else {
                    document.getElementById("picDetails").innerHTML = "";
                    document.getElementById("picDetails2").innerHTML = "Choose file";
                    UploadStatus.innerHTML = "";
                    SubmitButton.innerHTML = "Upload image";
                    UploadBar.style.display = "none";
                    showAlert('error', res.message);
                }
                SubmitButton.disabled = false;
                Input.disabled = false;
                Reset.disabled = false;
            } else {
                if (xhr.status == 404) {
                    document.getElementById("picDetails").innerHTML = "";
                    document.getElementById("picDetails2").innerHTML = "Choose file";
                    UploadStatus.innerHTML = "";
                    SubmitButton.innerHTML = "Upload image";
                    UploadBar.style.display = "none";
                    return showAlert('error', 'Failed to Upload image');
                }
            }
        });
        const formData = new FormData();
        formData.append('pic', SelectedFile);
        xhr.open('POST', '/api/uploadpic');
        xhr.send(formData);
    };

    document.getElementById("resetprofilepic").onclick = function () {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const Updateapi = window.location.origin + "/api/resetprofilepic";
                const xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === this.DONE) {
                        const res = JSON.parse(this.responseText);
                        if (res.status === 200) {
                            document.getElementById("uploadProfilePic").value = '';
                            document.getElementById("uploadPreview").src = '/drive/image/defaultpic.png';
                            document.getElementById("profilepic1").src = '/drive/image/defaultpic.png';
                            document.getElementById("profilepic2").src = '/drive/image/defaultpic.png';
                            showAlert('success', res.message);
                        } else {
                            showAlert('error', res.message);
                        }
                    } else {
                        if (xhr.status == 404) {
                            return showAlert('error', 'Failed to remove profile');
                        }
                    }
                });
                xhr.open("POST", Updateapi);
                xhr.setRequestHeader("Accept", "*/*");
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(null);
            }
        })
    };

    document.getElementById("dateofbirth").onblur = function () {
        const dob = document.getElementById("dateofbirth").value;
        if (!dob) return;
        const dob_split = dob.split("-");
        const dob_year = dob_split[0];
        const today = new Date();
        const today_year = today.getFullYear();
        if (today_year - dob_year < 0) {
            document.getElementById("dateofbirth").value = '';
            return showAlert('error', `select a valid date of birth`);
        }
        if (today_year - dob_year < 3) {
            document.getElementById("dateofbirth").value = '';
            return showAlert('error', `You need minimum age limit 3`);
        }
        if (today_year - dob_year > 100) {
            document.getElementById("dateofbirth").value = '';
            return showAlert('error', `You need maximum age limit 100`);
        }
        document.getElementById("age").value = today_year - dob_year;
    };
});

function PreviewProfilePic() {
    var oFReader = new FileReader();
    oFReader.readAsDataURL(document.getElementById("uploadProfilePic").files[0]);

    oFReader.onload = function (oFREvent) {
        if (oFREvent.target.result.includes('image')) document.getElementById("uploadPreview").src = oFREvent.target.result, AlertFilesize();
    };
};

function AlertFilesize() {
    let SelectedFile;
    if (window.ActiveXObject) {
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var filepath = document.getElementById('uploadProfilePic').value;
        var thefile = fso.getFile(filepath);
        var sizeinbytes = thefile.size;
        SelectedFile = thefile;
    } else {
        var sizeinbytes = document.getElementById('uploadProfilePic').files[0].size;
        SelectedFile = document.getElementById('uploadProfilePic').files[0];
    }

    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
    fSize = sizeinbytes; i = 0; while (fSize > 900) { fSize /= 1024; i++; }
    const FileSize = (Math.round(fSize * 100) / 100) + ' ' + fSExt[i];
    document.getElementById("picDetails").innerHTML = "Picture Information<br>Name: " + SelectedFile.name + "<br>Size: " + FileSize;
    document.getElementById("picDetails2").innerHTML = "Choosen file: " + SelectedFile.name;
}