import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useLoaderData } from "react-router";

const defaultCenter = [23.8103, 90.4125];

const MapBounds = ({ centers }) => {
  const map = useMap();

  useEffect(() => {
    if (!centers.length) {
      return;
    }

    const bounds = centers.map((center) => [center.latitude, center.longitude]);

    if (bounds.length === 1) {
      map.flyTo(bounds[0], 14);
      return;
    }

    map.fitBounds(bounds, {
      padding: [48, 48],
    });
  }, [centers, map]);

  return null;
};

const Coverage = () => {
  const loadedServiceCenters = useLoaderData();
  const serviceCenters = useMemo(
    () => (Array.isArray(loadedServiceCenters) ? loadedServiceCenters : []),
    [loadedServiceCenters],
  );
  const [query, setQuery] = useState("");

  const filteredCenters = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return serviceCenters;
    }

    return serviceCenters.filter((center) => {
      const searchableText = [center.region, center.district, center.city]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [query, serviceCenters]);

  const districtCount = new Set(serviceCenters.map((center) => center.district))
    .size;
  const regionCount = new Set(serviceCenters.map((center) => center.region))
    .size;
  const coverageCount = serviceCenters.reduce(
    (total, center) => total + (center.covered_area?.length ?? 0),
    0,
  );

  return (
    <div className="space-y-8 pb-12">
      <section className="overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-2xl">
        <div className="grid gap-10 px-6 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:py-12">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm font-medium tracking-wide text-emerald-100">
              Live coverage map
            </span>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                We are available across Bangladesh.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
                Explore every service center, zoom to the full coverage area,
                and search by region or district.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-slate-300">Districts</p>
                <p className="mt-2 text-3xl font-semibold">{districtCount}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-slate-300">Regions</p>
                <p className="mt-2 text-3xl font-semibold">{regionCount}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-slate-300">Coverage points</p>
                <p className="mt-2 text-3xl font-semibold">{coverageCount}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur">
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="coverage-search"
            >
              Search coverage
            </label>
            <input
              id="coverage-search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by region or district"
              className="mt-3 w-full rounded-2xl border border-white/15 bg-slate-950/40 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30"
            />
            <div className="mt-5 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-950/30 p-4">
                <p className="text-slate-400">Visible locations</p>
                <p className="mt-1 text-2xl font-semibold">
                  {filteredCenters.length}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-950/30 p-4">
                <p className="text-slate-400">Available data</p>
                <p className="mt-1 text-2xl font-semibold">
                  {serviceCenters.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Coverage map
              </h2>
              <p className="text-sm text-slate-500">
                Markers automatically fit the full service area.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              {filteredCenters.length} locations
            </span>
          </div>

          <div className="h-140">
            <MapContainer
              center={defaultCenter}
              zoom={7}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapBounds centers={filteredCenters} />

              {filteredCenters.map((center) => (
                <Marker
                  key={`${center.district}-${center.latitude}-${center.longitude}`}
                  position={[center.latitude, center.longitude]}
                >
                  <Popup>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-slate-900">
                        {center.district}
                      </h3>
                      <p className="text-sm text-slate-600">{center.region}</p>
                      <p className="text-sm text-slate-700">
                        {center.covered_area?.join(", ")}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                All locations
              </h2>
              <p className="text-sm text-slate-500">
                Every service center is listed here.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {filteredCenters.length}
            </span>
          </div>

          <div className="max-h-140 space-y-3 overflow-auto pr-1">
            {filteredCenters.map((center) => (
              <article
                key={`${center.city}-${center.district}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {center.district}
                    </h3>
                    <p className="text-sm text-slate-500">{center.city}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-700 shadow-sm">
                    {center.status}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-600">
                  {center.region} division
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {center.covered_area?.map((area) => (
                    <span
                      key={area}
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </article>
            ))}

            {!filteredCenters.length && (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
                No locations match your search.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Coverage;
