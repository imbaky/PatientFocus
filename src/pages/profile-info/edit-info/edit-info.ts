import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmergencyContactService } from '@services/emergency-contact/emergency-contact.service';
import { ProfileService } from '@services/profile/profile.service';
import { MedicalInfoService } from '@services/medical-info/medical-info.service';
import { BloodType } from '@enum/blood-type.enum';
import { MedicalInfo, BloodTypeOption} from '@interfaces/medical-info/medical-info';

@Component({
    selector: 'edit-modal',
    templateUrl: 'edit-info.html'
})


export class EditInfoModal {

    private emergencyContactForm: FormGroup;
    private medicalInfoForm: FormGroup;
    private profileForm: FormGroup;
    private infoForm: string;
    private profileId: number;
    private infoObject: any;

    bloodTypes: Array<BloodTypeOption> = [];

    constructor(private params: NavParams,
                private viewCtrl: ViewController,
                private formBuilder: FormBuilder,
                private emergencyContactService: EmergencyContactService,
                private profileService: ProfileService,
                private medicalInfoService: MedicalInfoService) {

        this.bloodTypes = [
            { name: BloodType.A_NEG, value: BloodType.A_NEG },
            { name: BloodType.A_POS, value: BloodType.A_POS },
            { name: BloodType.B_NEG, value: BloodType.B_NEG},
            { name: BloodType.B_POS, value: BloodType.B_POS},
            { name: BloodType.O_NEG, value: BloodType.O_NEG},
            { name: BloodType.O_POS, value: BloodType.O_POS},
            { name: BloodType.AB_NEG, value: BloodType.AB_NEG},
            { name: BloodType.AB_POS, value: BloodType.AB_POS},
        ];
        this.profileId = this.params.get('profileId');
        this.infoForm = this.params.get('infoForm');
        this.infoObject = this.params.get('infoObject');

        this.emergencyContactForm = this.formBuilder.group({
            name: [this.infoObject ? this.infoObject.name : '', Validators.required],
            relationship: [this.infoObject ? this.infoObject.relationship : '', Validators.required],
            phoneNumber: [this.infoObject ? this.infoObject.phoneNumber : '']
        });

        this.profileForm = this.formBuilder.group({
            name: [this.infoObject ? this.infoObject.name : '', Validators.required],
            gender: [this.infoObject ? this.infoObject.gender : '', Validators.required],
            dob: [this.infoObject ? this.infoObject.dob : ''],
        });

        this.medicalInfoForm = this.formBuilder.group({
            blood_type: [this.infoObject ? this.infoObject.blood_type : '', Validators.required],
            known_conditions: [this.infoObject ? this.infoObject.known_conditions : '', Validators.required],
            allergies: [this.infoObject ? this.infoObject.allergies : '', Validators.required]
        });
    }

    async submitProfileInfo() {
        const formValue = this.profileForm.value;
        await this.profileService.editProfile(formValue.name, formValue.gender, formValue.dob);
        await this.dismiss();
    }

    async submitEmergencyContact() {
        const contact = this.emergencyContactForm.value;
        await this.emergencyContactService.setEmergencyContact(this.profileId, contact.name, contact.relationship, contact.phoneNumber);
        await this.dismiss();
    }

    async submitMedicalInfo() {
        const entry = {
            blood_type: this.medicalInfoForm.value.blood_type,
            known_conditions: this.medicalInfoForm.value.known_conditions,
            allergies: this.medicalInfoForm.value.allergies
        };
        await this.medicalInfoService.save(entry as MedicalInfo);
        await this.dismiss();
    }

    async dismiss() {
        await this.viewCtrl.dismiss();
    }

}
