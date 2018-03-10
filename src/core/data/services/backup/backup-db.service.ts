import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
import * as jszip from 'jszip';
import { File } from '@ionic-native/file';
import { Zip } from '@ionic-native/zip';
import { DexieService } from '@services/dexie/dexie.service';


@Injectable()
export class BackupDBService {
  private fileName = 'databse.txt';
  private zipFile = 'patient-focus-profile.zip';


  constructor(private file: File,
              private nativeZip: Zip,
              private dexieService: DexieService) {}

  /**
   * Allows to convert the database into an encrypted json string which will then be stored onto a file called
   * database.txt. That file will then be placed in a zip file. Additionally, all files of a profile will be
   * saved onto the same zip file. The zip file will be stored onto the downloads directory of the phone
   * @param {number} profile_id The profile id to be exported
   * @param {string} password The password of the user which will be used as the key to encrypt the database data
   * @returns {Promise<string>} Returns the unencrypted json string
   */
  async exportProfile(profile_id: number, password: string) {
    const jsonTables = {};
    const tables = this.dexieService.tables;
    let jsonString = '';
    for (const table of tables) {
      const tableObjects = await table.toCollection().toArray();
      jsonString = JSON.stringify(tableObjects);
      jsonTables[String(table.name)] = jsonString;
    }
    jsonString = JSON.stringify(jsonTables);
    const encrpyted = crypto.AES.encrypt(jsonString, password);
    try {
      const zip = new jszip();
      const path = this.file.externalDataDirectory + String(profile_id) + '/';
      const files = await this.file.listDir(this.file.externalDataDirectory, String(profile_id));
      for (const fileEntry of files) {
        if (fileEntry.isFile) {
          const filePath = fileEntry.nativeURL;
          const filename  = filePath.substring(filePath.lastIndexOf('/') + 1);
          const buffer = await this.file.readAsArrayBuffer(path, filename);
          zip.file(String(profile_id) + '/' + filename, buffer, { base64: true });
        }
      }
      await zip.file(this.fileName, encrpyted.toString());
      const content: Blob = await zip.generateAsync({type: 'blob', platform: 'UNIX'});
      await this.file.writeFile(this.file.externalRootDirectory + '/Download/', this.zipFile, content, { replace: true});
    } catch (error) {
      console.log(error);
    }
    return jsonString;
  }

  /**
   * Imports the zip file created by exportProfile which contains the profile of the user. The zip file should contain a
   * file 'database.txt' in the root of the zip file. The database.txt file will be encrypted, so to decrypt the file,
   * the method requires the users password, which was used as the key to encrypt the file. Additionally, this method will
   * unzip all the files of the profile to the correct directory on the phone.
   * @param {string} password The password used to decrypt the profile
   * @returns {Promise<any>} returns the decryptedData database
   */

  async importProfile(password: string) { // TODO used to import profile incomplete
    try {
      const pathToZipFile = this.file.externalDataDirectory + String(1) + '/' + this.zipFile; // TODO need proper path
      const pathToDestination = this.file.externalDataDirectory + String(1);
      // let pathToFile = this.file.externalDataDirectory + String(1); // TODO need proper path
      // let pathToUnZipped = this.rootPath + String(1); // TODO url needs to be changed
      const number = await this.nativeZip.unzip(pathToZipFile, pathToDestination); // 1.
      /* let number = await this.nativeZip.unzip("test.zip", pathToUnZipped, () => {
      });// 2.*/
      const encrypyedJson = await this.file.readAsText(pathToDestination, this.fileName);
      console.log('encrypyedJson', encrypyedJson);
      // let encrypyedJson = await this.file.readAsText(this.rootPath, this.fileName);
      const bytes = crypto.AES.decrypt(encrypyedJson.toString(), password);
      const decryptedData = JSON.parse(bytes.toString(crypto.enc.Utf8));
      return decryptedData;
    } catch (e) {
      console.log('Could not decrypt zip', e);
    }
  }
}
