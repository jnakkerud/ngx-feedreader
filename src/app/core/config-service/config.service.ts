import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { config } from '../../app-config'

interface AppConfig {
    title?: string;
    proxy?: string;
    headers?: {
        [headerName: `x-${string}`]: string;
    }
}

@Injectable({ providedIn: 'root' })
export class ConfigService {

    _config: AppConfig;

    constructor(private titleService: Title) {
        const defaultConfig: AppConfig = {
            title: 'Ngx FeedReader'
        }
        this._config = Object.assign(defaultConfig, config);
        this.titleService.setTitle(this.title);
    }

    get title(): string {
        return this._config.title!;
    }

    get proxy(): string {
        return this._config.proxy ?? '';
    }

    get headers(): any {
        return this._config.headers;
    }
}