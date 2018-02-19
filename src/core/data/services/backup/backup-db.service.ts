import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
import * as jszip from 'jszip';
import { File } from '@ionic-native/file';
import { Zip } from '@ionic-native/zip';
import { DexieService } from '@services/dexie/dexie.service';


@Injectable()
export class BackupDBService {
  private fileName = "databse.txt";
  private zipFile = "patient-focus-profile.zip";


  constructor(private file: File,
              private nativeZip: Zip,
              private dexieService: DexieService) {}

  async exportProfile(profile_id: number, password: string) {
    let jsonTables = {};
    let tables = this.dexieService.tables;
    for(let table of tables) {
      let tableObjects = await table.toCollection().toArray();
      let jsonString = JSON.stringify(tableObjects);
      jsonTables[String(table.name)] = jsonString;
    }
    let jsonString = JSON.stringify(jsonTables);
    let encrpyted = crypto.AES.encrypt(jsonString, 'key');
    try {
      let zip = new jszip();
      let path = this.file.externalDataDirectory + String(profile_id) +"/";
      let files = await this.file.listDir(this.file.externalDataDirectory, String(profile_id));
      for(let fileEntry of files) {
        if(fileEntry.isFile) {
          let filePath = fileEntry.nativeURL;
          const filename  = filePath.substring(filePath.lastIndexOf('/') + 1);
          let buffer = await this.file.readAsArrayBuffer(path, filename);
          zip.file(String(profile_id)+ "/" + filename, buffer, { base64: true });
        }
      }
      await zip.file(this.fileName, encrpyted.toString());
      let content: Blob = await zip.generateAsync({type:"blob", platform: "UNIX"});
      await this.file.writeFile(this.file.externalRootDirectory + '/Download/', this.zipFile, content, { replace: true});
    }
    catch (error) {
      console.log(error);
    }
    return jsonString;
  }

  async importTable() { // TODO used to import profile incomplete
    try {
      let pathToZipFile = this.file.externalDataDirectory + String(1) +"/" + this.zipFile; // TODO need proper path
      let pathToDestination = this.file.externalDataDirectory + String(1);
      //let pathToFile = this.file.externalDataDirectory + String(1); // TODO need proper path
      //let pathToUnZipped = this.rootPath + String(1); // TODO url needs to be changed
      console.log(pathToZipFile);
      let number = await this.nativeZip.unzip(pathToZipFile, pathToDestination); // 1.
      console.log(number);
      /*let number = await this.nativeZip.unzip("test.zip", pathToUnZipped, () => {
        console.log("inside");
      });// 2.*/
      let encrypyedJson = await this.file.readAsText(pathToDestination, this.fileName);
      console.log("encrypyedJson", encrypyedJson);
      //let encrypyedJson = await this.file.readAsText(this.rootPath, this.fileName);
      var bytes = crypto.AES.decrypt(encrypyedJson.toString(), 'key');
      //console.log("bytes", bytes);
      var decryptedData = JSON.parse(bytes.toString(crypto.enc.Utf8));
    }
    catch(e) {
      console.log("could not decrpt zip", e);
    }
    return decryptedData;
  }
}