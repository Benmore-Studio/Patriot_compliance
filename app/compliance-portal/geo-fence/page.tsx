import { GeoFenceMapNoAPI } from "@/components/geo-fence-map-no-api"

export default function ComplianceGeoFencePage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Geo-Fence Monitoring</h1>
        <p className="text-muted-foreground">Real-time location-based compliance tracking across Texas</p>
      </div>
      <GeoFenceMapNoAPI />
    </div>
  )
}
