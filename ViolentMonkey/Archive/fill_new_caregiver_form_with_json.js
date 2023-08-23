$('#caregiver-fname').on('change', function(e){
      const _data = ($('#caregiver-fname').val());
      if (_data.match(/^\{\"firstName\"\:\".*\"\}$/)) {
        const _curSsn = $('#caregiver-ssn').val();
        const _caregiver = JSON.parse(_data);
        // show alert if ssn not compare
        if(!!_curSsn && _curSsn !== _caregiver.ssn) {
          alert('SSN not compared!');
          $('#caregiver-fname').val('');
        }

        // Fill fields
        if (_curSsn == _caregiver.ssn || !_curSsn) {

          // SSN
          if (!_curSsn) {
            $('#caregiver-ssn').val(_caregiver.ssn);
          }

          // First name
          $('#caregiver-fname').val(_caregiver.firstName);

          // Last name
          if (!$('#caregiver-sname').val()) {
            $('#caregiver-sname').val(_caregiver.lastName);
          }

          // Middle Name
          if (!$('#caregiver-mname').val() && _caregiver.middleName) {
            $('#caregiver-mname').val(_caregiver.middleName);
          }

          // Cargiver Code
          if (!$('#caregiver-caregiver_code').val()) {
            $('#caregiver-caregiver_code').val(_caregiver.caregiverCode);
          }

          // DOB
          if (!$('#caregiver-birthdate').val()) {
            let arr = _caregiver.dob.split('/');
            $('#caregiver-birthdate').val(arr[2] + '-' + arr[0] + '-' + arr[1]);
          }

          // Sex
          $('#caregiver-sex option[value="' + _caregiver.gender.substring(0,1)+ '"]').attr('selected','selected');

          // Martial
          $('#caregiver-maritalstatus option[value="' + _caregiver.martial.substring(0,1) + '"]').attr('selected','selected');

          // Laguages
          $('#caregiver-languages').val(_caregiver.languages);

          // Discipline
          let _disp = '';
          for(i=0; i < _caregiver.discipline.length; i++) {
            _disp += '#caregiver-cc2 input[value="' + _caregiver.discipline[i]  + '"], ';

          }
          _disp = _disp.slice(0, -2);
          $(_disp).attr('checked', 'checked');

          // email
          $('#caregiver-emailaddress').val(_caregiver.email);

          // homePhone
          $('#caregiver-homephone').val(_caregiver.homePhone);

          // cellPhone
          $('#caregiver-cellphone').val(_caregiver.cellPhone);

          // address1
          $('#caregiver-address1').val(_caregiver.address1);

          // address2
          $('#caregiver-address2').val(_caregiver.address2);

          // city
          $('#caregiver-city').val(_caregiver.city);

          // state
          $('#caregiver-state').val(_caregiver.state);

          // zip
          $('#caregiver-zip').val(_caregiver.zip);

          // Hire date
          if (!$('#caregiver-hiredate').val() && _caregiver.hireDate) {
            const arr = (_caregiver.hireDate.split('/'));
            $('#caregiver-hiredate').val(arr[2] + '-' + arr[0] + '-' + arr[1]);
          }

          // Rehire date
          if (!$('#caregiver-rehiredate').val() && _caregiver.rehireDate) {
            const arr = (_caregiver.rehireDate.split('/'));
            $('#caregiver-rehiredate').val(arr[2] + '-' + arr[0] + '-' + arr[1]);
          }

          // Status
          try {
            switch (_caregiver.status) {
                case 'Active':
                $('#caregiver-empstatus').val('A');
                break;
                case 'Inactive':
                $('#caregiver-empstatus').val('I');
                break;
                case 'Terminated':
                $('#caregiver-empstatus').val('T');
                break;

                default:
                // code
            }
          } catch {}


          // Status === Terminated add date
          if(_caregiver.status === 'Terminated' && !!_caregiver.terminationDate) {
            setTerminationDate(_caregiver.terminationDate);
            $('#caregiver-empstatus').val('T');
          }

        }

      }
    });


    /* --- Change title to First name and JSON data ---- */
    $(".control-label[for='caregiver-fname']").text('First Name OR JSON Data');