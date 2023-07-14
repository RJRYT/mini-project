/**
 * Custom API requests for dashboards
 */

/**
 * Admin - category add, edit, delete, view
*/

$(function () {
    $('#Form-CategoryAdd').submit(function () {
        const PostApi = window.location.origin + "/admin/api/new/category"
        event.preventDefault();
        const name = document.getElementById("category-name").value;
        const desc = document.getElementById("category-desc").value;
        if (!name) return showAlert('error', 'Enter a category name to continue');
        if (!desc) return showAlert('error', 'Enter a category description to continue');
        $("#CategoryAddOverlay").show();
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        this.reset();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                const res = JSON.parse(this.responseText);
                if (res.status === 200) {
                    showAlert('success', res.message);
                } else {
                    showAlert('error', res.message);
                }
                $("#CategoryAddOverlay").hide();
            } else {
                if (xhr.status == 404) {
                    $("#CategoryAddOverlay").hide();
                    return showAlert('error', 'Failed to add category');
                }
            }
        });
        xhr.open("POST", PostApi);
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Content-Type", "application/json");
        let data = { name: name, desc: desc }
        xhr.send(JSON.stringify(data));
    })
    $('#Form-CategoryEdit').submit(() => {
        const PutApi = window.location.origin + "/admin/api/edit/category"
        event.preventDefault();
        const name = document.getElementById("Edit-category-name").value;
        const desc = document.getElementById("Edit-category-desc").value;
        const id = document.getElementById("Edit-category-id").value;
        if (!name) return showAlert('error', 'Enter a category name to continue');
        if (!desc) return showAlert('error', 'Enter a category description to continue');
        $("#CategoryEditOverlay").show();
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                const res = JSON.parse(this.responseText);
                if (res.status === 200) {
                    showAlert('success', res.message);
                } else {
                    showAlert('error', res.message);
                }
                $("#CategoryEditOverlay").hide();
            } else {
                if (xhr.status == 404) {
                    $("#CategoryEditOverlay").hide();
                    return showAlert('error', 'Failed to update category');
                }
            }
        });
        xhr.open("PUT", PutApi);
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Content-Type", "application/json");
        let data = { id: id, name: name, desc: desc }
        xhr.send(JSON.stringify(data));
    })
});

function ViewCategoryInfo(category) {
    $('#ViewCategoryModel').modal('show');
    $("#CategoryViewOverlay").show();
    const GetApi = window.location.origin + "/admin/api/view/category"
    const Cid = category.dataset.id;
    const outputId = document.getElementById("ViewCategory-ID");
    const outputName = document.getElementById("ViewCategory-Name");
    const outputDesc = document.getElementById("ViewCategory-Description");
    const outputCreated = document.getElementById("ViewCategory-Created");
    outputCreated.innerHTML = outputDesc.innerHTML = outputName.innerHTML = outputId.innerHTML = "";
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const res = JSON.parse(this.responseText);
            if (res.status === 200) {
                $("#CategoryViewOverlay").hide();
                outputId.innerHTML = res.data.ID;
                outputName.innerHTML = res.data.Name;
                outputDesc.innerHTML = res.data.Description;
                outputCreated.innerHTML = res.data.createdAt;
            } else {
                $('#ViewCategoryModel').modal('hide');
                showAlert('error', res.message);
            }
        } else {
            if (xhr.status == 404) {
                $('#ViewCategoryModel').modal('hide');
                return showAlert('error', 'An error occoured while fetching');
            }
        }
    });
    xhr.open("GET", GetApi + "/?id=" + Cid);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(null);
}
function EditCategoryInfo(category) {
    $('#EditCategoryModel').modal('show');
    $("#CategoryEditOverlay").show();
    const GetApi = window.location.origin + "/admin/api/view/category"
    const Cid = category.dataset.id;
    const name = document.getElementById("Edit-category-name");
    const desc = document.getElementById("Edit-category-desc");
    const CategoryId = document.getElementById("Edit-category-id");
    name.value = desc.value = "";
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const res = JSON.parse(this.responseText);
            if (res.status === 200) {
                $("#CategoryEditOverlay").hide();
                name.value = res.data.Name;
                desc.value = res.data.Description;
                CategoryId.value = res.data.ID;
            } else {
                $('#EditCategoryModel').modal('hide');
                showAlert('error', res.message);
            }
        } else {
            if (xhr.status == 404) {
                $('#EditCategoryModel').modal('hide');
                return showAlert('error', 'An error occoured while fetching');
            }
        }
    });
    xhr.open("GET", GetApi + "/?id=" + Cid);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(null);
}
function DeleteCategory(category) {
    const id = category.dataset.id;
    Swal.fire({
        title: 'Are you sure?',
        text: "Are you sure to delete this category",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Proceed!'
    }).then((result) => {
        if (result.isConfirmed) {
            const DeleteApi = window.location.origin + "/admin/api/delete/category";
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                    const res = JSON.parse(this.responseText);
                    if (res.status === 200) {
                        category.parentElement.parentElement.remove();
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

$(document).ready(()=>{
    $('#CategoryTable').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "responsive": false,
    });
})