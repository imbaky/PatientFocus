export const SCHEMA = {
  'directory': '++id',
  'profile': '++id, directory, name, password, emergency_contact_id, gender, dob',
  'medical_info': '++id, blood_type, known_conditions, allergies',
  'item': '++id, title, description, file_id, page, directory_id, chosen_date',
  'file': '++id, path, size, format, directory_id, file_name',
  'reminder': '++id, reminder_id, fk_profile_id, title, text, frequencies, expires, reminder_type',
  'appointment': '++id, fk_profile_id, appointment_id, title, doctor, address, note, date, time, reminder, reminder_id, reminder_type',
  'emergency_contact': '++id, name, relationship, phone_number'
};
