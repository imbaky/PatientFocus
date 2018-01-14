export const SCHEMA = {
  'directory': '++id',
  'diary': '++id',
  'profile': '++id, directory, diary, name, password',
  'item': '++id, name, description, type, type_id, directory_id, created',
  'file': '++id, path, size, type, user_defined_name'
};

