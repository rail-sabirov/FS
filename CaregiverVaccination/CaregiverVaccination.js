class CaregiverVaccination extends FsDb {
    constructor(caregiverCode, vaccine = null, dose1 = null, dose2 = null, other = null) {
        super();

        this.caregiverCode = caregiverCode ?? '';
        this.vaccine = vaccine ?? '';
        this.dose1 = dose1 ?? '';
        this.dose2 = dose2 ?? '';
        this.other = other ?? '';
        this.tableName = "caregiver_vaccination";
        this.mainField = 'caregiver_code';
        this.rules = {
            id: "INTEGER PRIMARY KEY",
            [this.mainField]: "TEXT unique not null",
            vaccine: "TEXT",
            dose1: "TEXT",
            dose2: "TEXT",
            other: "TEXT"
        };

        this.createTable();
        this.createIndex([this.mainField]);

        this.#initByCaregiverCode();
    }

    /**
     * Initializing the object with data from DB,
     * use caregiverCode
     */
    #initByCaregiverCode() {
        this.read((item) => {
            if(item.length > 0) {
                const el = item[0];
                this.id = el.id;
                this.vaccine = el.vaccine;
                this.dose1 = el.dose1;
                this.dose2 = el.dose2;
                this.other = el.other;
            }
        }, [], {});
    }
}