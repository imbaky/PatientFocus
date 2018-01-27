export const SCHEMA = {
  'directory': '++id',
  'profile': '++id, directory, name, password',
  'item': '++id, title, description, file_id, page, directory_id, chosen_date, profile_id',
  'file': '++id, path, size, format, directory_id, file_name',
  'reminders': '++id, reminder_id, fk_profile_id, title, text, frequencies, expires'
};
