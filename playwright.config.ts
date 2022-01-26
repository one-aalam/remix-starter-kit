import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    globalSetup: require.resolve('./tests/global-setup'),
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    use: {
        trace: 'on-first-retry',
        channel: 'chrome',
    },
	testDir: 'tests',
	timeout: 15000, // needs to be high because the AMP validator takes a stupid about of time to initialise
	webServer: {
		command: 'npm run dev',
		port: 3000,
		timeout: 10000,
        reuseExistingServer: !process.env.CI,
	},
	workers: 6,
	projects: [
		{
			name: `dev+js`,
			use: {
				javaScriptEnabled: true
			}
		},
		{
			name: `dev-js`,
			use: {
				javaScriptEnabled: false
			}
		}
	],
};

export default config;
