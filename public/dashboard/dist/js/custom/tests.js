/**
 * Custom API requests for dashboards
 */

/**
 * Admin - test add, edit, delete, view
*/

$(function () {
    $('#Form-TestAdd').submit(function () {
        const PostApi = window.location.origin + "/admin/api/new/test"
        event.preventDefault();
        const name = document.getElementById("test-name").value;
        const desc = document.getElementById("test-desc").value;
        const category = document.getElementById("test-category").value;
        const price = document.getElementById("test-price").value;
        const status = document.getElementById("test-status").value;
        if (!name) return showAlert('error', 'Enter a test name to continue');
        if (!desc) return showAlert('error', 'Enter a test description to continue');
        if (!category) return showAlert('error', 'Select a test category to continue');
        if (!price) return showAlert('error', 'Enter a test price to continue');
        if (!status) return showAlert('error', 'Select a test status to continue');
        $("#TestAddOverlay").show();
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
                $("#TestAddOverlay").hide();
            } else {
                if (xhr.status == 404) {
                    $("#TestAddOverlay").hide();
                    return showAlert('error', 'Failed to add test');
                }
            }
        });
        xhr.open("POST", PostApi);
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Content-Type", "application/json");
        let data = { name: name, desc: desc, category: category, price: price, status: parseInt(status) }
        xhr.send(JSON.stringify(data));
    })
    $('#Form-TestEdit').submit(() => {
        const PutApi = window.location.origin + "/admin/api/edit/test"
        event.preventDefault();
        const name = document.getElementById("Edit-test-name").value;
        const desc = document.getElementById("Edit-test-desc").value;
        const category = document.getElementById("Edit-test-category").value;
        const price = document.getElementById("Edit-test-price").value;
        const status = document.getElementById("Edit-test-status").value;
        const id = document.getElementById("Edit-test-id").value;
        if (!name) return showAlert('error', 'Enter a test name to continue');
        if (!desc) return showAlert('error', 'Enter a test description to continue');
        if (!category) return showAlert('error', 'Select a test category to continue');
        if (!price) return showAlert('error', 'Enter a test price to continue');
        if (!status) return showAlert('error', 'Select a test status to continue');
        $("#TestEditOverlay").show();
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
                $("#TestEditOverlay").hide();
            } else {
                if (xhr.status == 404) {
                    $("#TestEditOverlay").hide();
                    return showAlert('error', 'Failed to update test');
                }
            }
        });
        xhr.open("PUT", PutApi);
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Content-Type", "application/json");
        let data = { id: id, name: name, desc: desc, category: category, price: price, status: status }
        xhr.send(JSON.stringify(data));
    })
})
function ViewTestInfo(Test) {
    const id = Test.dataset.id;
    $('#ViewTestModel').modal('show');
    $("#TestViewOverlay").show();
    const GetApi = window.location.origin + "/admin/api/view/test";
    const Id = document.getElementById("ViewTest-ID");
    const Name = document.getElementById("ViewTest-Name");
    const Desc = document.getElementById("ViewTest-Description");
    const Category = document.getElementById("ViewTest-Category");
    const Price = document.getElementById("ViewTest-Price");
    const Status = document.getElementById("ViewTest-Status");
    const Created = document.getElementById("ViewTest-Created");
    Id.innerHTML = Name.innerHTML = Desc.innerHTML = Category.innerHTML = Price.innerHTML = Status.innerHTML = Created.innerHTML = "";
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const res = JSON.parse(this.responseText);
            if (res.status === 200) {
                $("#TestViewOverlay").hide();
                Id.innerHTML = res.data.ID;
                Name.innerHTML = res.data.Name;
                Desc.innerHTML = res.data.Description;
                Category.innerHTML = res.data.Category;
                Price.innerHTML = res.data.Price;
                Created.innerHTML = res.data.createdAt;
                if (res.data.Status === 1) {
                    Status.innerHTML = "<span class='badge badge-success'>Active</span>";
                } else {
                    Status.innerHTML = "<span class='badge badge-danger'>Inactive</span>";
                }
            } else {
                $('#ViewTestModel').modal('hide');
                showAlert('error', res.message);
            }
        } else {
            if (xhr.status == 404) {
                $('#ViewTestModel').modal('hide');
                return showAlert('error', 'An error occoured while fetching');
            }
        }
    });
    xhr.open("GET", GetApi + "/?name=true&id=" + id);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(null);
}
function EditTestInfo(Test) {
    $('#EditTestModel').modal('show');
    $("#TestEditOverlay").show();
    const GetApi = window.location.origin + "/admin/api/view/test"
    const id = Test.dataset.id;
    const name = document.getElementById("Edit-test-name");
    const desc = document.getElementById("Edit-test-desc");
    const category = document.getElementById("Edit-test-category");
    const price = document.getElementById("Edit-test-price");
    const status = document.getElementById("Edit-test-status");
    const TestId = document.getElementById("Edit-test-id");
    name.value = desc.value = category.value = price.value = status.value = "";
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const res = JSON.parse(this.responseText);
            if (res.status === 200) {
                $("#TestEditOverlay").hide();
                name.value = res.data.Name;
                desc.value = res.data.Description;
                category.value = res.data.Category;
                price.value = res.data.Price;
                status.value = res.data.Status;
                TestId.value = res.data.ID;
            } else {
                $('#EditTestModel').modal('hide');
                showAlert('error', res.message);
            }
        } else {
            if (xhr.status == 404) {
                $('#EditTestModel').modal('hide');
                return showAlert('error', 'An error occoured while fetching');
            }
        }
    });
    xhr.open("GET", GetApi + "/?id=" + id);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(null);
}
function DeleteTestInfo(Test) {
    const id = Test.dataset.id;
    Swal.fire({
        title: 'Are you sure?',
        text: "Are you sure to delete this test",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Proceed!'
    }).then((result) => {
        if (result.isConfirmed) {
            const DeleteApi = window.location.origin + "/admin/api/delete/test";
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                    const res = JSON.parse(this.responseText);
                    if (res.status === 200) {
                        Test.parentElement.parentElement.remove();
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
            xhr.send(JSON.stringify({ id: id }));
        }
    })
}
$(document).ready(() => {
    $('#TestTable').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "responsive": false,
    });

})
const nodeList = document.querySelectorAll('td[data-status]');
for (let i = 0; i < nodeList.length; i++) {
    var status = parseInt(nodeList[i].dataset.status);
    if (status == 1) nodeList[i].innerHTML = '<span class="badge badge-success">Active</span>';
    else nodeList[i].innerHTML = '<span class="badge badge-danger">Inactive</span>';
}