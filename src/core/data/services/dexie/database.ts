export const SCHEMA = {
  'directory': '++id',
  'profile': '++id, directory, name, password, emergency_contact_id, gender, dob',
  'medical-info': '++id, blood_type, known_conditions, allergies',
  'item': '++id, title, description, file_id, page, directory_id, chosen_date, profile_id',
  'file': '++id, path, size, format, directory_id, file_name',
  'reminders': '++id, reminder_id, fk_profile_id, title, text, frequencies, expires',
  'emergency_contact': '++id, name, relationship, phone_number'
};