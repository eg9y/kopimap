import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "7f02099d",
	appName: "kopimap",
	webDir: "dist/client",
	server: {
		androidScheme: "https",
		hostname: "kopimap.com",
	},
	plugins: {
		LiveUpdates: {
			appId: "7f02099d",
			channel: "Production",
			autoUpdateMethod: "background",
			maxVersions: 2,
		},
	},
};

if (process.env.NODE_ENV === "development") {
	config.server = {
		...config.server,
		url: "http://10.241.7.163:5173",
		cleartext: true,
	};
}

export default config;
