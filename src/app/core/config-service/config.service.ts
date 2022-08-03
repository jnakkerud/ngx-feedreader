import { Injectable } from '@angular/core';
import { config } from '../../app-config'

interface AppConfig {
    title?: string;
    useOpmlTitle?: boolean
    proxy?: string;
    headers?: {
        [headerName: `x-${string}`]: string;
    }
}

@Injectable({ providedIn: 'root' })
export class ConfigService {

    _config: AppConfig;

    constructor() {
        const defaultConfig: AppConfig = {
            title: 'Ngx FeedReader',
            useOpmlTitle: false
        }
        this._config = Object.assign(defaultConfig, config);
    }

    get config(): AppConfig {
        return this._config;
    }

    get proxy(): string {
        return this._config.proxy ?? '';
    }

    get headers(): any {
        return this._config.headers;
    }
}