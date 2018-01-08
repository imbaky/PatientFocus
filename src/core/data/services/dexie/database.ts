export const SCHEMA = {
  'directory': '++id',
  'profile': '++id, directory, name, password',
  'item': '++id, name, description, type, type_id, directory_id, created',
  'file': '++id, path, size, type, user_defined_name'
};

