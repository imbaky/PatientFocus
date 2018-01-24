import { Component } from '@angular/core';
import { ModalController, NavParams, ViewController } from "ionic-angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EmergencyContactService } from "../core/data/services/emergency-contact/emergency-contact.service";
import { ProfileService } from "../core/data/services/profile/profile.service";


@Component({
    selector: 'edit-modal',
    templateUrl: 'edit-modal.html'
})

export class EditInfoModal {

    private emergencyContact: FormGroup;
    private profile: FormGroup;
    private infoForm: string;
    private profileId: number;

    constructor(private params: NavParams,
                private viewCtrl: ViewController,
                private formBuilder: FormBuilder,
                private emergencyContactService: EmergencyContactService,
                private profileService: ProfileService) {

        this.profileId = this.params.get('profileId');
        this.infoForm = this.params.get('infoForm');

        this.emergencyContact = this.formBuilder.group({
            name: ['', Validators.required],
            relationship: ['', Validators.required],
            phoneNumber: ['',   Validators.compose(
                [
                    Validators.minLength(10),
                    Validators.maxLength(11),
                    Validators.pattern("[0-9]*"),
                    Validators.required,
                ])]
        });

        this.profile = this.formBuilder.group({
            name: ['', Validators.required],
            gender: ['', Validators.required],
            dob: ['', Validators.required],
        });
    }

    submitProfileInfo() {
        console.log(this.profile.value);
    }

      submitEmergencyContact() {
        const contact = this.emergencyContact.value;
        this.emergencyContactService.setEmergencyContact(this.profileId, contact.name,
            contact.relationship, contact.phoneNumber).then(() => {
            this.dismiss();
        });

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
