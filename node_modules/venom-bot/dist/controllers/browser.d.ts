import { Browser, BrowserContext, Page } from 'puppeteer';
import { options } from '../config';
import { CreateConfig } from '../config/create-config';
import * as Spinnies from 'spinnies';
export declare function initWhatsapp(options: options | CreateConfig, browser: Browser): Promise<Page | false>;
export declare function getWhatsappPage(browser: Browser | BrowserContext): Promise<Page | false>;
export declare function folderSession(options: options | CreateConfig): boolean;
export declare function initBrowser(options: options | CreateConfig, spinnies: any): Promise<Browser | false>;
export declare function statusLog(page: Page, spinnies: Spinnies, session: string, callback: (infoLog: string) => void): Promise<void>;
