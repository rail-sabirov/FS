if (!localStorage.getItem('fsScriptExpireDate') || new Date().toISOString().slice(0, 10) > localStorage.getItem('fsScriptExpireDate')) return;

try {
    // Change lagel
    $('label[for="patients-first_name"]').html("First Name <span>or JSON Data</span>")
    $('#patients-first_name').on('change', ({target}) => {
        // JSON data
        if(target.value.slice(0, 2) == '{"') {
            const data = JSON.parse(target.value)

            $('#patients-patient_id').val(data.patientId);
            $('#patients-first_name').val(data.firstName);
            $('#patients-last_name').val(data.lastName);
            $('#patients-sex').val(data.sex.slice(0, 1));
            $('#patients-status').val(data.status);
            $('#patients-coordinator_name').val(data.coordinatorName);
            $('#patients-contract_name').val(data.contractName);
            $('#patients-discipline').val(data.discipline);
            $('#patients-nurse').val(data.nurse);
            $('#patients-start_date').val(data.startDate);
            $('#patients-birth_date').val(data.dob);
            $('#patients-address1').val(data.address1);
            $('#patients-address2').val(data.address2);
            $('#patients-city').val(data.city);
            $('#patients-state').val(data.state);
            $('#patients-county').val(data.county);
            $('#patients-zip_code').val(data.zipCode);
            $('#patients-office').val(data.office);
            $('#patients-home_phone').val(data.homePhone1);
            $('#patients-home_phone2').val(data.homePhone2);
            $('#patients-home_phone3').val(data.homePhone3);
        }
    })
} catch {}