import maplibregl from "maplibre-gl";
import React, {
	useRef,
	useEffect,
	useState,
	ReactNode,
	useCallback,
	memo,
} from "react";
import { GeolocateControl, Map as Mapgl, Popup } from "react-map-gl/maplibre";
import useMedia from "react-use/esm/useMedia";

import { GeolocateResultEvent } from "react-map-gl/dist/esm/types";
import { mapStyle } from "../config";
import { useMapCafes } from "../hooks/use-map-cafes";
import { useStore } from "../store";
import Clusters, { ClustersRef } from "./clusters"; // Adjust the path as necessary

interface MapComponentProps {
	pmTilesReady: boolean;
}

export default function MapComponent({ pmTilesReady }: MapComponentProps) {
	const { selectCafe, setMapRef, mapRef, mapCenter, setMapCenter } = useStore();
	const [popupInfo, setPopupInfo] = useState<any>(null);
	const popupTimeoutRef = useRef<number | null>(null);
	const isHoveringPopupRef = useRef<boolean>(false);
	const geoControlRef = useRef<maplibregl.GeolocateControl>();
	const clustersRef = useRef<ClustersRef>(null);
	const isWide = useMedia("(min-width: 640px)");

	const [viewport, setViewport] = useState({
		latitude: -6.274163,
		longitude: 106.789514505,
		zoom: 14,
	});

	const { data: mapCafesData, refetch: refetchMapCafes } = useMapCafes(
		mapCenter.lat,
		mapCenter.long,
	);

	useEffect(() => {
		const debounceTimer = setTimeout(() => {
			refetchMapCafes();
		}, 300);

		return () => clearTimeout(debounceTimer);
	}, [mapCenter, refetchMapCafes]);

	const handlePopupMouseEnter = () => {
		isHoveringPopupRef.current = true;
		if (popupTimeoutRef.current !== null) {
			clearTimeout(popupTimeoutRef.current);
			popupTimeoutRef.current = null;
		}
	};

	const handlePopupMouseLeave = () => {
		isHoveringPopupRef.current = false;
		popupTimeoutRef.current = window.setTimeout(() => {
			setPopupInfo(null);
			popupTimeoutRef.current = null;
		}, 300);
	};

	const handleGeolocate = useCallback(
		(e: GeolocateResultEvent<maplibregl.GeolocateControl>) => {
			if (mapRef && mapRef.current) {
				mapRef.current.flyTo({
					center: [e.coords.longitude, e.coords.latitude],
					zoom: 14,
					essential: true,
				});
			}
		},
		[mapRef],
	);

	const handleFlyTo = useCallback(
		(lat: number, lng: number) => {
			if (mapRef && mapRef.current && !isNaN(lat) && !isNaN(lng)) {
				mapRef.current.flyTo({
					center: {
						lat: lat + (isWide ? 0 : 0.0025),
						lon: lng - (isWide ? 0.0025 : -0.0025),
					},
					zoom: 16,
					essential: true, // this animation is considered essential with respect to prefers-reduced-motion
				});
			}
		},
		[mapRef],
	);

	const handleMapMove = useCallback(() => {
		if (mapRef && mapRef.current) {
			const center = mapRef.current.getCenter();
			if (center) {
				setMapCenter({ lat: center.lat, long: center.lng });
				setViewport((prev) => ({
					...prev,
					latitude: center.lat,
					longitude: center.lng,
					zoom: mapRef.current!.getZoom(),
				}));
			}
		}
	}, [mapRef]);

	const handleMapLoad = useCallback(
		(evt: maplibregl.MapLibreEvent) => {
			const center = evt.target.getCenter();
			setMapCenter({
				lat: center.lat,
				long: center.lng,
			});
			geoControlRef.current?.trigger();
		},
		[setMapCenter],
	);

	const handleMapClick = useCallback(
		(e: maplibregl.MapLayerMouseEvent) => {
			selectCafe(null);
			const feature = e.features && e.features[0];
			if (feature?.properties?.cluster) {
				clustersRef.current?.onClick(e);
			} else {
				clustersRef.current?.onClickSingle(e);
			}
		},
		[selectCafe],
	);

	return (
		<Mapgl
			id="test"
			{...viewport}
			onMove={(evt) => setViewport(evt.viewState)}
			onLoad={handleMapLoad}
			onMoveEnd={handleMapMove}
			maxBounds={[
				106.626998 - 0.1,
				-6.426709 - 0.1,
				107.052031 + 0.1,
				-6.121617 + 0.1,
			]}
			maxZoom={24}
			minZoom={10}
			mapLib={maplibregl as any}
			style={{ width: "100%", height: "100%" }}
			mapStyle={pmTilesReady ? mapStyle : undefined}
			onResize={handleMapMove}
			ref={setMapRef as any}
			onClick={handleMapClick}
			onMouseMove={(e) => clustersRef.current?.onMouseEnter(e)}
			onMouseLeave={() => clustersRef.current?.onMouseLeave()}
		>
			<Clusters
				ref={clustersRef}
				mapCenter={mapCenter}
				handleFlyTo={handleFlyTo}
				setPopupInfo={setPopupInfo}
				cafes={mapCafesData?.visibleCafes || []}
			/>
			{popupInfo && (
				<Popup
					anchor="top"
					longitude={popupInfo.longitude}
					latitude={popupInfo.latitude}
					onClose={() => setPopupInfo(null)}
					className="z-[100] !p-0"
					closeButton={false}
				>
					<div
						typeof="button"
						onMouseEnter={handlePopupMouseEnter}
						onMouseLeave={handlePopupMouseLeave}
						className="-mx-3 -mb-3 -mt-5 cursor-pointer"
						onClick={() => {
							selectCafe(popupInfo);
							handleFlyTo(popupInfo.latitude, popupInfo.longitude);
							setPopupInfo(null);
						}}
					>
						<div className="p-2 flex w-full items-center">
							<div className="font-bold">{popupInfo.name}</div>
						</div>
					</div>
				</Popup>
			)}
			<GeolocateControl
				ref={geoControlRef as any}
				positionOptions={{
					enableHighAccuracy: true,
				}}
				onGeolocate={handleGeolocate}
			/>
		</Mapgl>
	);
}

export const MemoizedMapComponent = memo(MapComponent);
