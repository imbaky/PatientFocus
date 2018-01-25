import { Component } from '@angular/core';
import { ModalController, NavParams, ViewController } from "ionic-angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EmergencyContactService } from "../core/data/services/emergency-contact/emergency-contact.service";
import { ProfileService } from "../core/data/services/profile/profile.service";
import { MedicalInfoService, MedicalInfo } from "../core/data/services/medical-info/medical-info.service";


@Component({
    selector: 'edit-modal',
    templateUrl: 'edit-modal.html'
})

export class EditInfoModal {

    private emergencyContactForm: FormGroup;
    private medicalInfoForm: FormGroup;
    private profileForm: FormGroup;
    private infoForm: string;
    private profileId: number;

    constructor(private params: NavParams,
                private viewCtrl: ViewController,
                private formBuilder: FormBuilder,
                private emergencyContactService: EmergencyContactService,
                private profileService: ProfileService,
                private medicalInfoService: MedicalInfoService) {

        this.profileId = this.params.get('profileId');
        this.infoForm = this.params.get('infoForm');

        this.emergencyContactForm = this.formBuilder.group({
            name: ['', Validators.required],
            relationship: ['', Validators.required],
            phoneNumber: ['', Validators.compose(
                [
                    Validators.minLength(10),
                    Validators.maxLength(11),
                    Validators.pattern("[0-9]*"),
                    Validators.required,
                ])]
        });

        this.profileForm = this.formBuilder.group({
            name: ['', Validators.required],
            gender: ['', Validators.required],
            dob: [''],
        });

        this.medicalInfoForm = this.formBuilder.group({
            bloodType: ['', Validators.required],
            known_conditions: ['', Validators.required],
            allergies: ['', Validators.required]
        });
    }

    async submitProfileInfo() {
        const formValue = this.profileForm.value;
        console.log(this.profileForm.value);
        await this.profileService.editProfile(formValue.name, formValue.gender, formValue.dob);
        await this.dismiss();
    }

    async submitEmergencyContact() {
        const contact = this.emergencyContactForm.value;
        await this.emergencyContactService.setEmergencyContact(this.profileId, contact.name, contact.relationship, contact.phoneNumber);
        await this.dismiss();
    }

    submitMedicalInfo() {
        const entry = {
            blood_type: this.medicalInfoForm.value.bloodtype,
            known_conditions: this.medicalInfoForm.value.known_conditions,
            allergies: this.medicalInfoForm.value.allergies
        };
        this.medicalInfoService.save(entry as MedicalInfo);
    }

    async dismiss() {
        await this.viewCtrl.dismiss();
    }

}
