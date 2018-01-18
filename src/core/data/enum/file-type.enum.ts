export enum DocumentType { // TODO rename to portfolio type
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

// Extending the enums
export namespace DocumentType {
    export function values(): string[] {
        const documentValues = getEnumValues(DocumentType);
        return documentValues.slice(0, documentValues.length - 1);
    }
}

export namespace FileFormatType {
    export function values(): string[] {
        const fileFormatValues = getEnumValues(FileFormatType);
        return fileFormatValues.slice(0, fileFormatValues.length - 1);
    }
}
