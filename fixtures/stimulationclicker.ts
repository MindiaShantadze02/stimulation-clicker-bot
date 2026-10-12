import { test as base, Page } from '@playwright/test';
import { HomePage } from '../pages/stimulation_clicker/HomePage';

type Fixtures = {
    mainPage: HomePage
}

export const test = base.extend<Fixtures>({
    mainPage: async ({ page }, use) => {
        const mainPage = new HomePage(page);
        await use(mainPage);
    }
})