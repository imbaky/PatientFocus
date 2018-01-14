export const SCHEMA = {
  'directory': '++id',
  'diary': '++id',
  'profile': '++id, directory, diary, name, password',
  'item': '++id, name, description, type, type_id, directory_id, created',
  'entry': '++id, diary_id, title, description, created', //TODO Add image/file and perhaps see if we are going to add other fields or classify the entries by type
  'file': '++id, path, size, type, user_defined_name'
};

