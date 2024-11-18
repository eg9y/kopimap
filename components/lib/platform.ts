export enum Style {
	Dark = "DARK",
	Light = "LIGHT",
	Default = "DEFAULT",
}

export const isPlatform = {
	mobile: () => import.meta.env.BUILD_FOR_MOBILE === "test",
	capacitor: async () => {
		if (!isPlatform.mobile()) return false;
		const { Capacitor } = await import("@capacitor/core");
		return Capacitor.isNativePlatform();
	},
};

export const capacitorServices = {
	browser: async () => {
		if (!isPlatform.mobile()) return null;
		const { Browser } = await import("@capacitor/browser");
		return Browser;
	},
	app: async () => {
		if (!isPlatform.mobile()) return null;
		const { App } = await import("@capacitor/app");
		return App;
	},
	statusBar: async () => {
		if (!isPlatform.mobile()) return null;
		const { StatusBar } = await import("@capacitor/status-bar");
		return StatusBar;
	},
};

export const SafeArea = {
	getSafeAreaInsets: async () => {
		if (!isPlatform.mobile()) {
			return { insets: { top: 0, bottom: 0, left: 0, right: 0 } };
		}

		try {
			const { SafeArea: NativeSafeArea } = await import(
				"capacitor-plugin-safe-area"
			);
			return NativeSafeArea.getSafeAreaInsets();
		} catch (error) {
			console.error("Error getting safe area insets:", error);
			return { insets: { top: 0, bottom: 0, left: 0, right: 0 } };
		}
	},
};

export const setPlatformSafeArea = async (isNative: boolean) => {
	try {
		if (isNative) {
			const safeArea = await SafeArea.getSafeAreaInsets();
			document.documentElement.style.setProperty(
				"--safe-area-top",
				`${safeArea.insets.top}px`,
			);
			document.documentElement.style.setProperty(
				"--safe-area-bottom",
				`${safeArea.insets.bottom}px`,
			);
			document.documentElement.style.setProperty(
				"--safe-area-left",
				`${safeArea.insets.left}px`,
			);
			document.documentElement.style.setProperty(
				"--safe-area-right",
				`${safeArea.insets.right}px`,
			);
		} else {
			document.documentElement.style.setProperty("--safe-area-top", "1rem");
			document.documentElement.style.setProperty("--safe-area-bottom", "0px");
			document.documentElement.style.setProperty("--safe-area-left", "0px");
			document.documentElement.style.setProperty("--safe-area-right", "0px");
		}
	} catch (error) {
		console.error("Error setting safe area:", error);
	}
};
