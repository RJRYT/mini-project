/**
 * Custom functions for dashboards
 */

function showAlert(icon, text) {
    Swal.fire({
        icon: icon,
        toast: true,
        title: text,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true
    })
    return 1;
}

function ChangePassView(tagid, inputid, recursion = false) {
    const togglePassword = document.querySelector('#' + tagid);
    const password = document.querySelector('#' + inputid);
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye-slash');
    if (!recursion) setTimeout(function () { ChangePassView(tagid, inputid, true); }, 1000);
}

function _ReloadPage() {
    setTimeout(ReloadNested, 3000);
    function ReloadNested() {
        window.location.reload();
    }
}
