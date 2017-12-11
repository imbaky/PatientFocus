export const SCHEMA = {
  'directory': '++id',
  'profile': '++id, directory',
  'item': '++id, name, description, type, type_id, directory_id, created',
  'file': '++id, path, size, type'
};
