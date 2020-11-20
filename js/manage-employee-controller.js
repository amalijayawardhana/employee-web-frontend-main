//========================================================================================
/*                     Global variables                                                */
//========================================================================================
var tblEmployees = null;
var selectedRow = null;

$(function () {
    initializeDataTable(loadAllEmployees);
});

/* =======================================================================================
*                      Event Handlers
* =======================================================================================*/
$("#tbl-Employees tbody").on("click", "tr", selectEmployee);
// $("#btn-clear").click(deselectAllEmployees);
$("#btn-save").click(saveOrUpdateEmployee);
$("#tbl-Employees tbody").on("click","td:nth-child(4)",deleteEmployee);
$("#txt-id, #txt-name, #txt-address").keypress(validationListener);


/* =======================================================================================
*                      Functions
* =======================================================================================*/

function saveOrUpdateEmployee() {
    var code = $("#txt-code").val();
    var initials = $("#txt-initials").val();
    var firstName = $("#txt-first-name").val();
    var surname = $("#txt-surname").val();
    var address1 = $("#txt-address1").val();
    var address2 = $("#txt-address2").val();
    var dob = $("#txt-dob").val();
    var status = $("#txt-status").val();

    var validated = true;

    if (address1.trim().length > 50) {
        $("#txt-address1").select();
        $("#txt-address1").addClass("is-invalid")
        validated = false;
    }
    if (address2.trim().length > 100) {
        $("#txt-first-name").select();
        $("#txt-first-name").addClass("is-invalid")
        validated = false;
    }
    if (firstName.trim().length > 100) {
        $("#txt-surname").select();
        $("#txt-surname").addClass("is-invalid")
        validated = false;
    }

    if (!/d{3}$/.test(code)) {
        $("#txt-code").select();
        $("#txt-code").addClass("is-invalid")
        validated = false;
    }

    if (!validated) {
        $("form .is-invalid").tooltip('show');
        return;
    }

    if ($("#btn-save").text() === "Modify") {
        $.ajax({
            method: "PUT",
            url: "http://localhost:8080//api/v1/employees?code=" +selectedRow.find("td:first-child").text(),
            data: $("form").serialize()
        }).done(function(){
            selectedRow.find("td:nth-child(2)").text(name);
            selectedRow.find("td:nth-child(3)").text(address);
            $("#btn-clear").click();
        })
    })
        return;
    }

    var xmlHttpRequest = new XMLHttpRequest();
    $.ajax({
        method: "POST",
        url: "http://localhost:8080/api/v1/Employees",
        data: $("form").serialize()
    }).done(function (){
        var newRow = "<tr>\n" +
                        "                                        <td>" + code + "</td>\n" +
                        "                                        <td>" + firstName + "</td>\n" +
            "                                        <td>" + address1 + "</td>\n" +
            "                                        <td>" + dob + "</td>\n" +
                        "                                        <td class='bin'><i class=\"fas fa-trash\"></i></td>\n" +
                        "                                    </tr>";

                    initializeDataTable(function () {
                        $('#tbl-Employees tbody').append(newRow);
                        $("#btn-clear").click();
                    })
    })
    })
}

function selectEmployee() {
    deselectAllEmployees();
    $(this).addClass("selected-row");
    selectedRow = $(this);
    $("#txt-id").val(selectedRow.find("td:first-child").text());
    $("#txt-name").val(selectedRow.find("td:nth-child(2)").text());
    $("#txt-address").val(selectedRow.find("td:nth-child(3)").text());
    $("#txt-id").attr("disabled",true);
    $("#btn-save").text("Modify");

}

    //to remove built in empty message in data table
    $("#tbl-Employees tr .dataTables_empty").remove();
}

function deselectAllEmployees(){
    $("#tbl-Employees tbody tr").removeClass("selected-row");
    $("#btn-save").text("Save");
    $("#txt-code").attr("disabled",false);
    selectedRow=null;
}

function deleteEmployee(){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to delete this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: "DELETE",
                url: 'http://localhost:8080/api/v1/Employees?code='+selectedRow.find("td:first-child").text()
            }).done(function (){
                selectedRow.fadeOut(500,function (){
                    initializeDataTable(function (){
                        selectedRow.remove();
                        $("#btn-clear").click();
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                    });
                });
            }).fail(function (){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Failed to delete Employee'
                })
            })
        }
    })
}

function validationListener(){
    $(this).removeClass("is-invalid");
    $(this).tooltip("hide");
}

function removeAllValidations(){
    $("#txt-code,#txt-initials, #txt-first-name,#txt-surname,#txt-address1, #txt-address2, #txt-dob, #txt-status").removeClass("is-invalid");
    $("#txt-code,#txt-initials, #txt-first-name,#txt-surname,#txt-address1, #txt-address2, #txt-dob, #txt-status").tooltip("hide");
}

// plain text method
function loadAllEmployees_STRING(){
    $.ajax({
        method: 'GET',
        url : 'http://localhost:8080/api/v1/Employees'
    }).done(function (data){
        console.log(data)
    }).fail(function (){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
        })
        $("#txt-code").select();
    })
}

function loadAllEmployees(){
    $.ajax({
        method: 'GET',
        url : 'http://localhost:8080/api/v1/Employees'
    }).done(function (Employees){
        for (var i =0; i<Employees.length; i++) {
            var code = Employees[i].code;
            var initials = Employees[i].initials;
            var firstName = Employees[i].fisrtName;
            var surname = Employees[i].surname;
            var address1 = Employees[i].address1;
            var address2 = Employees[i].address2;
            var dob = Employees[i].dob;
            var status = Employees[i].status;

            var newRow = "<tr>\n" +
                "                                        <td>" + code + "</td>\n" +
                "                                        <td>" + firstName + "</td>\n" +
                "                                        <td>" + address1 + "</td>\n" +
                "                                        <td>" + dob + "</td>\n" +
                "                                        <td class='bin'><i class=\"fas fa-trash\"></i></td>\n" +
                "                                    </tr>";

            initializeDataTable(function () {
                $('#tbl-Employees tbody').append(newRow);
                $("#btn-clear").click();
            })
        }
    })
    });
}
