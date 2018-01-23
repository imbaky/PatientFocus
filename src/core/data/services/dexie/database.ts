export const SCHEMA = {
  'directory': '++id',
  'profile': '++id, directory, name, password',
  'item': '++id, title, description, file_id, page, directory_id, chosen_date, profile_id',
  'file': '++id, path, document_type, size, format, directory_id, user_defined_name, file_name',
  'reminders': '++id, reminder_id, fk_profile_id, title, text, every, frequencies, data, expires'
};
