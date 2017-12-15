import { Injectable } from '@angular/core';
import { Directory } from "../data/services/directory/directory.service";

@Injectable()
export class PortfolioService {
  portfolioDirectory: Directory;

  constructor() {}

  setDirectory(directory : Directory) {
      this.portfolioDirectory = directory;
  }

  getDirectory() {
      return this.portfolioDirectory;
  }

}