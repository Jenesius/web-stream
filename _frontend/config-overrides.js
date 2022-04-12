const multipleEntry = require('react-app-rewire-multiple-entry')([
	{
		entry: 'src/pages/auth/auth.tsx',
		template: 'public/index.html',
		outPath: '/auth.html'
	},
	{
		entry: 'src/pages/main/main.tsx',
		template: 'public/index.html',
		outPath: '/main.html'
	}
]);

module.exports = {
	webpack: function(config, env) {
		
		console.log(config);
		
// multipleEntry expects an "options" object but since cra v5 it is called "userOptions"
		// HACK -> copy userOptions reference and hope for the best
		const webpackPlugins = config.plugins.filter(p => p.constructor.name === 'HtmlWebpackPlugin');
		webpackPlugins.forEach(p => p.options = p.userOptions);
		
		// the original call
		multipleEntry.addMultiEntry(config);
		
		// Удаление дефолт конфига
		delete config.entry.main;
		// now carry on with the options object
		webpackPlugins.forEach(p => { p.userOptions = p.options; delete p.options; });
		
		return config;
	}
};
