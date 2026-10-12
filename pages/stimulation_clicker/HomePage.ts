import { Locator, Page, expect } from "@playwright/test";

export class HomePage {
    public readonly page: Page;
    private readonly mainButton: Locator;
    private readonly collectButton: Locator;
    private readonly lastPrice: Locator;
    private readonly stockBuyButton: Locator;
    private readonly stockSellButton: Locator;
    private readonly upgradeIcons: Locator;
    private readonly stimulationCount: Locator;
    private appTheme: string = 'basic';

    public constructor(page: Page) {
        this.page = page;
        this.mainButton = page.getByRole('button', { name: 'Click me' });
        this.collectButton = page.locator('.collect');
        this.lastPrice = page.locator('.last-price');
        this.stockBuyButton = page.locator('.stock-btn.stock-buy');
        this.stockSellButton = page.locator('.stock-btn.stock-sell');
        this.upgradeIcons = page.locator('.main-upgrades .upgrade-icon');
        this.stimulationCount = page.locator('.main-stat-num');
    }

    public setAppTheme(theme: string): void {
        this.appTheme = theme;
    }

    public async getUpgrade(upgradeName: string): Promise<void> {
        const upgradeLocator = this.page.locator(`//div[contains(@class,'upgrade')]/img[@src='https://stimulation-clicker.neal.fun/images/upgrades/${this.appTheme}/${upgradeName}.webp']/..`);
        await upgradeLocator.click();
        await expect(upgradeLocator).not.toBeVisible();
    }

    public async goto (): Promise<void> {
        await this.page.goto('');
    }

    public async clickMainButton(): Promise<void> {
        return this.mainButton.click();
    }

    public async clickTimes(times: number): Promise<void> {
        for (let i = 0; i < times; i++) {
            await this.clickMainButton();
        }
    }

    public async collect(): Promise<void> {
        await this.collectButton.click();
    }

    public async tradeStock(): Promise<void> {
        const price = this.parseNumber(await this.lastPrice.textContent());
        if (price < 10_000 && await this.stockBuyButton.isEnabled()) {
            await this.stockBuyButton.click();
        } else if (price > 30_000 && await this.stockSellButton.isEnabled()) {
            await this.stockSellButton.click();
        }
    }

    public async buyThirdUpgrade(): Promise<void> {
        const upgradeIcon = this.upgradeIcons.nth(2);
        const upgradeLocator = upgradeIcon.locator('..');
        const cost = this.parseNumber(await upgradeLocator.locator('.upgrade-cost').textContent());
        if (await this.getStimulation() >= cost) {
            const src = await upgradeIcon.getAttribute('src');
            await this.clickOrDispatch(upgradeLocator);
            await expect(this.page.locator(`.main-upgrades img[src='${src}']`)).toHaveCount(0);
        }
    }

    public async tradeCryptoUntil(target: number): Promise<void> {
        while (await this.getStimulation() < target) {
            await this.tradeStock();
            await this.clickMainButton();
        }
    }

    public async buyAllUpgrades(): Promise<void> {
        while (await this.upgradeIcons.count() > 2) {
            await this.buyThirdUpgrade();
        }
    }

    private async clickOrDispatch(locator: Locator): Promise<void> {
        try {
            await locator.click({ timeout: 2000 });
        } catch {
            await locator.dispatchEvent('click');
        }
    }

    private async getStimulation(): Promise<number> {
        return this.parseNumber(await this.stimulationCount.textContent());
    }

    private parseNumber(text: string | null): number {
        const match = text?.match(/[\d,]+/);
        return match ? Number(match[0].replace(/,/g, '')) : 0;
    }
}