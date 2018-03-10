import {BloodType} from '@enum/blood-type.enum';

export interface MedicalInfo {
    id: number;
    blood_type: BloodType;
    known_conditions: string[];
    allergies: string[];
    profile_id: number;
}

export interface BloodTypeOption {
    name: string;
    value: BloodType;
}
