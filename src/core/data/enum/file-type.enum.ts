export enum DocumentType {
    BLOOD_TEST = 'Blood Test',
    PRESCRIPTION = 'Prescription',
    LAB_TEST = 'Lab Test',
    CONSULTATION = 'Consultation Report',
    IMAGE = 'Image Report',
    DISCHARGE = 'Hospital Discharge',
    DIAGNOSIS = 'Diagnosis Report',
    OTHER = 'Other'
}

export enum FileFormatType {
    JPG = 'JPG',
    PNG = 'PNG',
    PDF = 'PDF',
    TXT = 'TXT',
    Other = 'Other'
}

interface EnumObject {
    [enumValue: number]: string;
}

function getEnumValues(e: EnumObject): string[] {
    return Object.keys(e).map((i) => e[i]);
}

export const documentValues = getEnumValues(DocumentType);
export const fileFormatValues = getEnumValues(FileFormatType);
