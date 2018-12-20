import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { ElectronService } from './electron.service';
/**
 * Manages maintenence of the Config file for EVE-ET, configuration settings
 * are represented as key-value pairs.
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private path: string;
  private config: {};
  constructor(private electron: ElectronService) {
    if (this.electron.isElectron) {
      const settingsFile = environment.settingsFile;
      this.path = this.electron.path.join(this.electron.remote.app.getPath('userData'), settingsFile);
      console.log('Config path:', this.path);
      this.readSettingsFile();
      this.electron.updateView('Initialize config.');
    }
  }

  get(key: string) {
    console.log('GET:', key, this.config[key]);
    return this.config[key];
  }

  set(key: string, value: string) {
    this.config[key] = value;
    this.electron.fs.writeFileSync(this.path, JSON.stringify(this.config));
    console.log('SET:', key, this.config[key]);
    this.electron.updateView('Set config value.');
  }

  getConfig() {
    return JSON.stringify(this.config);
  }

  setConfig(config: string) {
    if (config.length === 0) {
      config = '{}';
    }
    this.config = JSON.parse(config);
    this.electron.fs.writeFileSync(this.path, JSON.stringify(this.config));
    console.log('SET CONFIG:', this.config);
    this.electron.updateView('Overwrite config.');
  }

  readSettingsFile() {
    if (this.electron.fs.existsSync(this.path)) {
      this.config = JSON.parse(this.electron.fs.readFileSync(this.path).toString());
    } else {
      this.config = {};
      this.electron.fs.writeFileSync(this.path, JSON.stringify(this.config));
    }
    console.log('Config initialized', this.config);
  }
}
