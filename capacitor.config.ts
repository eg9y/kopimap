import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.kopimap.app",
	appName: "kopimap",
	webDir: "dist/client",
	server: {
		hostname: "localhost",
		androidScheme: "https",
		// Add these lines for development
		url: "http://10.241.7.163:5173", // Replace YOUR_LOCAL_IP with your computer's IP address
		cleartext: true,
	},
};

export default config;
