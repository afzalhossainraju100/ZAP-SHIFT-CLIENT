import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Component/Loading/Loading";
import { getErrorMessage } from "../../../utils/parcelStatus";
import StatusBadge from "../../../Component/StatusBadge/StatusBadge";
import TrackingTimeline from "../Tracking/TrackingTimeline";

const AssignRiderModal = ({ parcel, type, onClose, onAssigned }) => {
  const axiosSecure = useAxiosSecure();
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const district = type === "pickup" ? parcel.senderDistrict : parcel.receiverDistrict;

  const { data: riders = [], isLoading } = useQuery({
    queryKey: ["available-riders", district],
    queryFn: async () =>
      (await axiosSecure.get(`/riders/available?district=${encodeURIComponent(district)}`))
        .data.data,
  });

  const handleAssign = async () => {
    setSaving(true);
    try {
      await axiosSecure.patch(`/parcels/${parcel._id}/assign-rider`, {
        riderEmail: selected.email,
        type,
      });
      Swal.fire("Assigned!", `${selected.name} will handle the ${type}.`, "success");
      onAssigned();
    } catch (error) {
      Swal.fire("Error!", getErrorMessage(error), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-black shadow-xl">
        <h3 className="text-xl font-bold">
          Assign {type === "pickup" ? "Pickup" : "Delivery"} Rider
        </h3>
        <p className="mt-1 text-sm text-gray-500">Service center: {district}</p>

        <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
          {isLoading && <p className="text-sm text-gray-500">Loading riders...</p>}
          {!isLoading && riders.length === 0 && (
            <p className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
              No approved riders work in {district} yet. Approve a rider for this
              district from Manage Riders.
            </p>
          )}
          {riders.map((rider) => (
            <button
              key={rider._id}
              onClick={() => setSelected(rider)}
              className={`w-full rounded-xl border p-3 text-left transition ${
                selected?.email === rider.email
                  ? "border-[#03373d] bg-[#caeb66]/40"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <p className="font-semibold">{rider.name}</p>
              <p className="text-xs text-gray-500">
                {rider.email} · {rider.phone} · {rider.bikeModel}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="btn">
            Cancel
          </button>
          {selected && (
            <button
              onClick={handleAssign}
              disabled={saving}
              className="btn border-[#caeb66] bg-[#caeb66] text-black"
            >
              {saving ? "Assigning..." : `Assign ${selected.name}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Step = ({ number, title, children, active, done }) => (
  <li
    className={`rounded-2xl border p-5 ${
      active ? "border-[#03373d] bg-white shadow-md" : "border-gray-200 bg-white/70"
    }`}
  >
    <div className="flex items-center gap-3">
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
          done ? "bg-green-500 text-white" : active ? "bg-[#caeb66]" : "bg-gray-200"
        }`}
      >
        {done ? "✓" : number}
      </span>
      <h3 className="font-semibold">{title}</h3>
    </div>
    {children && <div className="mt-3 ps-11 text-sm">{children}</div>}
  </li>
);

const ORDER = [
  "unpaid",
  "paid",
  "ready-to-pickup",
  "in-transit",
  "reached-service-center",
  "shipped",
  "ready-for-delivery",
  "delivered",
];

const ManageParcelDelivery = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [modalType, setModalType] = useState(null);

  const { data: parcel, isLoading, refetch } = useQuery({
    queryKey: ["parcel", id],
    queryFn: async () => (await axiosSecure.get(`/parcels/${id}`)).data,
  });

  const { data: history = [], refetch: refetchHistory } = useQuery({
    queryKey: ["tracking", parcel?.trackingId],
    enabled: !!parcel?.trackingId,
    queryFn: async () =>
      (await axiosSecure.get(`/trackings/${parcel.trackingId}`)).data.history,
  });

  if (isLoading || !parcel) return <Loading />;

  const status = parcel.deliveryStatus;
  const reached = (target) => ORDER.indexOf(status) >= ORDER.indexOf(target);
  const sameDistrict = parcel.senderDistrict === parcel.receiverDistrict;

  const refreshAll = () => {
    refetch();
    refetchHistory();
    queryClient.invalidateQueries({ queryKey: ["admin-parcels"] });
    queryClient.invalidateQueries({ queryKey: ["admin-stats-status"] });
  };

  const changeStatus = (nextStatus, label) => {
    Swal.fire({
      title: `${label}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (!result.isConfirmed) return;
      axiosSecure
        .patch(`/parcels/${parcel._id}/status`, { status: nextStatus })
        .then(() => {
          refreshAll();
          Swal.fire("Updated!", `Status is now ${nextStatus}.`, "success");
        })
        .catch((error) => Swal.fire("Error!", getErrorMessage(error), "error"));
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{parcel.parcelName}</h1>
            <p className="text-sm text-gray-500">
              Manage the delivery route · {parcel.trackingId}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={status} />
            <Link to={`/dashboard/parcel/${parcel._id}`} className="btn btn-sm">
              Parcel details
            </Link>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs uppercase text-gray-500">Origin service center</p>
            <p className="font-semibold">
              {parcel.senderDistrict}, {parcel.senderRegion}
            </p>
            <p className="text-sm text-gray-600">
              {parcel.senderName} · {parcel.senderPhone}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs uppercase text-gray-500">Destination service center</p>
            <p className="font-semibold">
              {parcel.receiverDistrict}, {parcel.receiverRegion}
            </p>
            <p className="text-sm text-gray-600">
              {parcel.receiverName} · {parcel.receiverContact}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <ol className="space-y-3">
          <Step
            number={1}
            title="Assign Parcel for Pickup"
            active={status === "paid"}
            done={reached("ready-to-pickup")}
          >
            <button
              disabled={status !== "paid"}
              onClick={() => setModalType("pickup")}
              className="btn btn-sm border-[#caeb66] bg-[#caeb66] text-black"
            >
              Assign Pickup Rider
            </button>
          </Step>

          {status === "ready-to-pickup" && (
            <Step number={2} title="Waiting for the rider to pick up" active>
              {parcel.pickupRider?.name} ({parcel.pickupRider?.phone}) will collect
              the parcel from {parcel.senderAddress}.
            </Step>
          )}

          {!sameDistrict && (
            <>
              <Step
                number={3}
                title="Confirm Parcel Received at Service Center"
                active={status === "in-transit"}
                done={reached("reached-service-center")}
              >
                <button
                  disabled={status !== "in-transit"}
                  onClick={() =>
                    changeStatus("reached-service-center", "Confirm the parcel reached the service center")
                  }
                  className="btn btn-sm border-[#caeb66] bg-[#caeb66] text-black"
                >
                  Confirm Received
                </button>
              </Step>
              <Step
                number={4}
                title="Ship Parcel"
                active={status === "reached-service-center"}
                done={reached("shipped")}
              >
                <button
                  disabled={status !== "reached-service-center"}
                  onClick={() =>
                    changeStatus("shipped", `Ship the parcel to ${parcel.receiverDistrict}`)
                  }
                  className="btn btn-sm border-[#caeb66] bg-[#caeb66] text-black"
                >
                  Ship Parcel
                </button>
              </Step>
              <Step
                number={5}
                title="Assign Parcel for Delivery"
                active={status === "shipped"}
                done={reached("ready-for-delivery")}
              >
                <button
                  disabled={status !== "shipped"}
                  onClick={() => setModalType("delivery")}
                  className="btn btn-sm border-[#caeb66] bg-[#caeb66] text-black"
                >
                  Assign Delivery Rider
                </button>
              </Step>
            </>
          )}

          {status === "ready-for-delivery" && (
            <Step number={6} title="Out for delivery" active>
              {parcel.deliveryRider?.name} ({parcel.deliveryRider?.phone}) is
              delivering the parcel to {parcel.receiverAddress}.
            </Step>
          )}

          {status === "delivered" && (
            <Step number={7} title="Parcel delivered successfully" done>
              Delivered by {parcel.deliveryRider?.name}.
            </Step>
          )}
        </ol>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Delivery timeline</h2>
          <TrackingTimeline history={history} />
        </div>
      </div>

      {modalType && (
        <AssignRiderModal
          parcel={parcel}
          type={modalType}
          onClose={() => setModalType(null)}
          onAssigned={() => {
            setModalType(null);
            refreshAll();
          }}
        />
      )}
    </div>
  );
};

export default ManageParcelDelivery;
