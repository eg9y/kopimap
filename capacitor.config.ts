import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.kopimap.app",
	appName: "kopimap",
	webDir: "dist/client",
	plugins: {
		LiveUpdates: {
			appId: "7f02099d",
			channel: "Production",
			autoUpdateMethod: "background",
			maxVersions: 2,
		},
	},
	ios: {
		contentInset: "always",
	},
	android: {
		backgroundColor: "#FFFFFF",
	},
};

if (process.env.NODE_ENV === "debug") {
	console.log("Building for debug");
	config.server = {
		...config.server,
		url: "http://10.241.7.163:5173",
		cleartext: true,
	};
}

export default config;
