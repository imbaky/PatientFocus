export const SCHEMA = {
  'directory': '++id',
  'diary': '++id',
  'profile': '++id, directory, diary, name, password',
  'item': '++id, title, description, file_id, page, directory_id, chosen_date',
  'entry': '++id, diary_id, title, description, created', //TODO Add image/file and perhaps see if we are going to add other fields or classify the entries by type
  'file': '++id, path, document_type, size, format, directory_id, user_defined_name, file_name'
};

