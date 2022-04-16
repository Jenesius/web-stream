const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
	transpileDependencies: true,
	pages: {
		auth: {
			entry: './src/pages/auth/main.ts'
		},
		index: {
			entry: './src/pages/main/main.ts'
		}
	},
	outputDir: 'build',
	devServer: {
		proxy: 'http://localhost:3333/'
	}
})
