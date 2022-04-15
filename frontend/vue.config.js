const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
	transpileDependencies: true,
	pages: {
		auth: {
			entry: './src/pages/auth/main.ts'
		},
		main: {
			entry: './src/pages/main/main.ts'
		}
	},
	outputDir: 'build',
	devServer: {
		proxy: {
			'^/api': {
				target: 'http://localhost:3333/'
			}
		}
	}
})
