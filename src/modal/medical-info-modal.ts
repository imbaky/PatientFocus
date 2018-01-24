import { Component } from '@angular/core';
import { NavParams, ViewController } from "ionic-angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MedicalInfo, MedicalInfoService} from '../core/data/services/medical-info/medical-info.service';


@Component({
    selector: 'edit-modal',
    templateUrl: 'edit-modal.html'
})

export class EditInfoModal {

    private medicalInfoForm: FormGroup;
    private infoForm: string;

    constructor(private params: NavParams,
                private viewCtrl: ViewController,
                private formBuilder: FormBuilder,
                private medicalInfoService: MedicalInfoService) {

        this.infoForm = this.params.get('infoForm');

        this.medicalInfoForm = this.formBuilder.group({
            bloodType: ['', Validators.required],
            known_conditions: ['', Validators.required],
            allergies: ['', Validators.required]
        });
    }

    submitMedicalInfo() {
        const entry = {
            blood_type: this.medicalInfoForm.value.bloodtype,
            known_conditions: this.medicalInfoForm.value.known_conditions,
            allergies: this.medicalInfoForm.value.allergies
        };
        this.medicalInfoService.save(entry as MedicalInfo);
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}