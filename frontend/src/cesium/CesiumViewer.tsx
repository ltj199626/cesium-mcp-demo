import { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import type { SceneAction } from '../api/bridgeClient';

const ionToken = (import.meta as any).env?.VITE_CESIUM_TOKEN;
if (ionToken) Cesium.Ion.defaultAccessToken = ionToken;

const IS_TEST = typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent);

export function CesiumViewer({ pendingAction }: { pendingAction: SceneAction | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    if (IS_TEST) return;
    if (!containerRef.current || viewerRef.current) return;

    try {
      const viewer = new Cesium.Viewer(containerRef.current, {
        timeline: false,
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: true,
        sceneModePicker: true,
        navigationHelpButton: false,
      });
      viewerRef.current = viewer;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Cesium 初始化失败';
      setInitError(message);
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !pendingAction) return;
    applyAction(viewer, pendingAction);
  }, [pendingAction]);

  if (IS_TEST) {
    return (
      <div style={{ width: '100%', height: '100%', minHeight: 480, borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7fa3' }}>
        Cesium Viewer (test stub)
      </div>
    );
  }

  if (initError) {
    return (
      <div style={{ width: '100%', height: '100%', minHeight: 480, borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fca5a5', padding: 16, textAlign: 'center' }}>
        Cesium 初始化失败：{initError}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: 480, borderRadius: 12, overflow: 'hidden' }}
    />
  );
}

function applyAction(viewer: Cesium.Viewer, action: SceneAction) {
  const p = action.payload as any;
  switch (action.type) {
    case 'camera.flyTo':
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(p.lon, p.lat, p.height ?? 1_000_000),
        duration: 2,
      });
      break;
    case 'entity.addMarker':
      viewer.entities.add({
        name: p.name,
        position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat),
        point: {
          pixelSize: 12,
          color: Cesium.Color.YELLOW,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
        },
        label: {
          text: p.name,
          font: '14pt sans-serif',
          pixelOffset: new Cesium.Cartesian2(0, -24),
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        },
      });
      break;
    case 'entity.drawPolyline': {
      const positions = p.points.map((pt: { lon: number; lat: number }) =>
        Cesium.Cartesian3.fromDegrees(pt.lon, pt.lat),
      );
      viewer.entities.add({
        name: p.name ?? '折线',
        polyline: {
          positions,
          width: 3,
          material: Cesium.Color.CYAN,
          clampToGround: false,
        },
      });
      break;
    }
    case 'layer.switch': {
      const layers = viewer.imageryLayers;
      layers.removeAll();
      layers.addImageryProvider(
        new Cesium.OpenStreetMapImageryProvider({}),
      );
      break;
    }
    case 'entity.clear':
      viewer.entities.removeAll();
      break;
  }
}
