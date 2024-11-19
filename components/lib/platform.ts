export enum Style {
	Dark = "DARK",
	Light = "LIGHT",
	Default = "DEFAULT",
}

// Define types for Geolocation
interface GeolocationPosition {
	coords: {
		latitude: number;
		longitude: number;
		accuracy: number;
		altitudeAccuracy: number | null;
		altitude: number | null;
		speed: number | null;
		heading: number | null;
	};
	timestamp: number;
}

interface GeolocationOptions {
	enableHighAccuracy?: boolean;
	timeout?: number;
	maximumAge?: number;
}

// Add these type definitions
type PermissionState =
	| "prompt"
	| "prompt-with-rationale"
	| "granted"
	| "denied";

interface PermissionStatus {
	location: PermissionState;
	coarseLocation?: PermissionState;
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
	geolocation: async () => {
		if (!isPlatform.mobile()) {
			// Fallback to browser geolocation
			return {
				getCurrentPosition: async (options?: GeolocationOptions) => {
					return new Promise<GeolocationPosition>((resolve, reject) => {
						navigator.geolocation.getCurrentPosition(
							(position) =>
								resolve({
									coords: {
										latitude: position.coords.latitude,
										longitude: position.coords.longitude,
										accuracy: position.coords.accuracy,
										altitudeAccuracy: position.coords.altitudeAccuracy,
										altitude: position.coords.altitude,
										speed: position.coords.speed,
										heading: position.coords.heading,
									},
									timestamp: position.timestamp,
								}),
							reject,
							{
								enableHighAccuracy: options?.enableHighAccuracy ?? false,
								timeout: options?.timeout ?? 10000,
								maximumAge: options?.maximumAge ?? 0,
							},
						);
					});
				},
				checkPermissions: async (): Promise<PermissionStatus> => {
					if (!navigator.geolocation) {
						return { location: "denied" };
					}
					return { location: "granted" };
				},
				requestPermissions: async (): Promise<PermissionStatus> => {
					return new Promise((resolve) => {
						navigator.geolocation.getCurrentPosition(
							() => resolve({ location: "granted" }),
							() => resolve({ location: "denied" }),
						);
					});
				},
			};
		}

		const { Geolocation } = await import("@capacitor/geolocation");
		return Geolocation;
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
	console.log("Setting platform safe area. isNative:", isNative);
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
