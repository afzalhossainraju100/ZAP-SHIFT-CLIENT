const Card = ({ title, children }) => (
  <div className="bg-white/80 dark:bg-gray-800/80 shadow sm:rounded-lg p-4 border">
    <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
      {title}
    </h3>
    <div className="text-sm text-gray-700 dark:text-gray-300">{children}</div>
  </div>
);

const SystemDesign = () => {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-sky-700 dark:text-sky-300">
            ZAPSHIFT — System Design
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Interactive system design overview and architecture visualization
            (Tailwind UI)
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-4">
            <Card title="Overview">
              <ul className="list-disc pl-5">
                <li>
                  Parcel delivery platform with Roles: <strong>User</strong>,{" "}
                  <strong>Admin</strong>, <strong>Rider</strong>.
                </li>
                <li>
                  Tech: React (Vite), REST API (Node/Express), MongoDB, Payment
                  gateway, Push notifications.
                </li>
                <li>
                  Core flows: create → pay → assign → pickup → ship (optional) →
                  deliver → confirm.
                </li>
              </ul>
            </Card>

            <Card title="Roles & Responsibilities">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-sky-50 rounded">
                  <h4 className="font-medium">User</h4>
                  <p className="text-xs">Create parcel, pay, track, review.</p>
                </div>
                <div className="p-3 bg-amber-50 rounded">
                  <h4 className="font-medium">Admin</h4>
                  <p className="text-xs">
                    Approve riders, assign pickups/deliveries, manage centers.
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded">
                  <h4 className="font-medium">Rider</h4>
                  <p className="text-xs">
                    Pickup, deliver, confirm with tracking/OTP, update earnings.
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Data Model (summary)">
              <div className="space-y-2">
                <div>
                  <strong>users</strong>: _id, name, email, role, photoURL
                </div>
                <div>
                  <strong>parcels</strong>: senderId, receiver, type, weight,
                  originCenter, destCenter, cost, status, pickupRider,
                  deliveryRider, tracking_no
                </div>
                <div>
                  <strong>tracking</strong>: parcelId, status, message, date,
                  actor
                </div>
                <div>
                  <strong>payments</strong>: parcelId, userId, amount, txId,
                  status
                </div>
              </div>
            </Card>

            <Card title="Representative APIs">
              <ul className="list-disc pl-5">
                <li>POST /api/parcels — create parcel & cost preview</li>
                <li>POST /api/payments — create payment intent</li>
                <li>
                  PUT /api/parcels/:id/status — update status (admin/rider)
                </li>
                <li>POST /api/trackings — append tracking event</li>
              </ul>
            </Card>

            <Card title="Sequence (key flow)">
              <ol className="list-decimal pl-5">
                <li>User creates parcel → preview cost.</li>
                <li>User pays → webhook issues tracking_no and marks paid.</li>
                <li>Admin assigns pickup rider → status ready-to-pickup.</li>
                <li>
                  Rider confirms pickup (tracking_no) → in-transit or
                  ready-for-delivery.
                </li>
                <li>
                  Rider confirms delivery → status delivered; create final
                  tracking doc; update earnings.
                </li>
              </ol>
            </Card>

            <Card title="5-day Implementation Plan">
              <div className="space-y-4 text-sm">
                <div className="overflow-x-auto rounded-md border">
                  <h5 className="font-semibold px-3 py-2 bg-sky-50">
                    Day 1 — Foundation Setup (8 Hours)
                  </h5>
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 border">Time</th>
                        <th className="px-3 py-2 border">Task</th>
                        <th className="px-3 py-2 border">Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-2 border">9:00-10:30</td>
                        <td className="px-3 py-2 border">
                          Project setup, folder standards, environment configs
                        </td>
                        <td className="px-3 py-2 border">
                          Running app + env templates
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 border">10:45-12:30</td>
                        <td className="px-3 py-2 border">
                          Auth flow + RBAC middleware
                        </td>
                        <td className="px-3 py-2 border">
                          Secure route access by role
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 border">1:30-3:30</td>
                        <td className="px-3 py-2 border">
                          Mongo models (users, parcels, tracking, payments)
                        </td>
                        <td className="px-3 py-2 border">
                          Core data schema ready
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 border">3:45-5:00</td>
                        <td className="px-3 py-2 border">
                          Seed script + sanity API tests
                        </td>
                        <td className="px-3 py-2 border">Baseline verified</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="overflow-x-auto rounded-md border">
                  <h5 className="font-semibold px-3 py-2 bg-amber-50">
                    Day 2 — Parcel Booking & Payment (8 Hours)
                  </h5>
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 border">Time</th>
                        <th className="px-3 py-2 border">Task</th>
                        <th className="px-3 py-2 border">Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-2 border">9:00-11:00</td>
                        <td className="px-3 py-2 border">
                          Build Add Parcel form + validation rules
                        </td>
                        <td className="px-3 py-2 border">
                          Form submission stable
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 border">11:15-1:00</td>
                        <td className="px-3 py-2 border">
                          Cost calculation logic + unit tests
                        </td>
                        <td className="px-3 py-2 border">
                          Accurate pricing by type/weight/zone
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 border">2:00-3:30</td>
                        <td className="px-3 py-2 border">
                          Payment gateway sandbox integration
                        </td>
                        <td className="px-3 py-2 border">
                          Checkout flow active
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 border">3:45-5:00</td>
                        <td className="px-3 py-2 border">
                          Webhook handling + tracking_no generation
                        </td>
                        <td className="px-3 py-2 border">
                          Paid status automated
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="overflow-x-auto rounded-md border">
                  <h5 className="font-semibold px-3 py-2 bg-emerald-50">
                    Day 3 — Admin Assignment & Pickup Flow (8 Hours)
                  </h5>
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 border">Time</th>
                        <th className="px-3 py-2 border">Task</th>
                        <th className="px-3 py-2 border">Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-2 border">9:00-10:45</td>
                        <td className="px-3 py-2 border">
                          Admin parcel queue + filters/search
                        </td>
                        <td className="px-3 py-2 border">
                          Operational parcel list
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 border">11:00-1:00</td>
                        <td className="px-3 py-2 border">
                          Assign pickup rider modal + APIs
                        </td>
                        <td className="px-3 py-2 border">
                          Ready-to-pickup assignment live
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 border">2:00-3:30</td>
                        <td className="px-3 py-2 border">
                          Rider pickup list + tracking_no confirmation
                        </td>
                        <td className="px-3 py-2 border">
                          Pickup confirmation works
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 border">3:45-5:00</td>
                        <td className="px-3 py-2 border">
                          Status transition + tracking timeline logs
                        </td>
                        <td className="px-3 py-2 border">
                          Traceable lifecycle events
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="overflow-x-auto rounded-md border">
                  <h5 className="font-semibold px-3 py-2 bg-indigo-50">
                    Day 4 — Inter-District Shipping & Delivery (8 Hours)
                  </h5>
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 border">Time</th>
                        <th className="px-3 py-2 border">Task</th>
                        <th className="px-3 py-2 border">Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-2 border">9:00-10:45</td>
                        <td className="px-3 py-2 border">
                          Service center + route mapping implementation
                        </td>
                        <td className="px-3 py-2 border">
                          Warehouse routing ready
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 border">11:00-12:30</td>
                        <td className="px-3 py-2 border">
                          Admin shipping actions (reached-service-center,
                          shipped)
                        </td>
                        <td className="px-3 py-2 border">
                          Inter-district states active
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 border">1:30-3:30</td>
                        <td className="px-3 py-2 border">
                          Delivery rider assignment + delivery confirmation
                        </td>
                        <td className="px-3 py-2 border">
                          Ready-for-delivery to delivered
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 border">3:45-5:00</td>
                        <td className="px-3 py-2 border">
                          POD optional upload + rider earnings update
                        </td>
                        <td className="px-3 py-2 border">
                          Delivery proof + payout logic
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="overflow-x-auto rounded-md border">
                  <h5 className="font-semibold px-3 py-2 bg-rose-50">
                    Day 5 — Dashboard, QA & Release (8 Hours)
                  </h5>
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 border">Time</th>
                        <th className="px-3 py-2 border">Task</th>
                        <th className="px-3 py-2 border">Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-2 border">9:00-11:00</td>
                        <td className="px-3 py-2 border">
                          User/Admin/Rider dashboards + charts
                        </td>
                        <td className="px-3 py-2 border">
                          Metrics visible and actionable
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 border">11:15-1:00</td>
                        <td className="px-3 py-2 border">
                          Notifications for major state changes
                        </td>
                        <td className="px-3 py-2 border">
                          Event alerts delivered
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 border">2:00-3:30</td>
                        <td className="px-3 py-2 border">
                          End-to-end QA: booking to delivery
                        </td>
                        <td className="px-3 py-2 border">
                          Critical bugs fixed
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 border">3:45-5:00</td>
                        <td className="px-3 py-2 border">
                          Staging deploy + release notes + handover
                        </td>
                        <td className="px-3 py-2 border">
                          Demo-ready release package
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </section>

          <aside className="space-y-4">
            <Card title="Architecture Diagram">
              <div className="w-full h-72 flex items-center justify-center">
                <svg
                  viewBox="0 0 800 420"
                  className="w-full h-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <marker
                      id="arrow"
                      markerWidth="10"
                      markerHeight="10"
                      refX="10"
                      refY="5"
                      orient="auto-start-reverse"
                    >
                      <path d="M0,0 L10,5 L0,10 z" fill="#0ea5e9" />
                    </marker>
                  </defs>

                  <rect
                    x="30"
                    y="30"
                    width="200"
                    height="60"
                    rx="8"
                    fill="#e0f2fe"
                    stroke="#0284c7"
                  />
                  <text
                    x="130"
                    y="65"
                    textAnchor="middle"
                    fontSize="14"
                    fill="#0369a1"
                  >
                    Client (React)
                  </text>

                  <rect
                    x="300"
                    y="30"
                    width="220"
                    height="80"
                    rx="8"
                    fill="#f0f9ff"
                    stroke="#0ea5e9"
                  />
                  <text
                    x="410"
                    y="55"
                    textAnchor="middle"
                    fontSize="14"
                    fill="#075985"
                  >
                    API Server
                  </text>
                  <text
                    x="410"
                    y="72"
                    textAnchor="middle"
                    fontSize="11"
                    fill="#075985"
                  >
                    Auth · Payments · REST
                  </text>

                  <rect
                    x="300"
                    y="140"
                    width="220"
                    height="60"
                    rx="8"
                    fill="#ecfeff"
                    stroke="#0891b2"
                  />
                  <text
                    x="410"
                    y="175"
                    textAnchor="middle"
                    fontSize="13"
                    fill="#065f46"
                  >
                    Background Worker
                  </text>

                  <rect
                    x="560"
                    y="40"
                    width="200"
                    height="80"
                    rx="8"
                    fill="#fef3c7"
                    stroke="#b45309"
                  />
                  <text
                    x="660"
                    y="65"
                    textAnchor="middle"
                    fontSize="13"
                    fill="#854d0e"
                  >
                    Payments / Webhooks
                  </text>

                  <rect
                    x="560"
                    y="150"
                    width="200"
                    height="80"
                    rx="8"
                    fill="#ecfccb"
                    stroke="#4d7c0f"
                  />
                  <text
                    x="660"
                    y="175"
                    textAnchor="middle"
                    fontSize="13"
                    fill="#365314"
                  >
                    MongoDB / Storage
                  </text>

                  <line
                    x1="230"
                    y1="60"
                    x2="300"
                    y2="60"
                    stroke="#0ea5e9"
                    strokeWidth="2"
                    markerEnd="url(#arrow)"
                  />
                  <line
                    x1="520"
                    y1="60"
                    x2="560"
                    y2="60"
                    stroke="#0ea5e9"
                    strokeWidth="2"
                    markerEnd="url(#arrow)"
                  />
                  <line
                    x1="410"
                    y1="110"
                    x2="410"
                    y2="140"
                    stroke="#0891b2"
                    strokeWidth="2"
                    markerEnd="url(#arrow)"
                  />
                  <line
                    x1="520"
                    y1="170"
                    x2="560"
                    y2="170"
                    stroke="#4d7c0f"
                    strokeWidth="2"
                    markerEnd="url(#arrow)"
                  />

                  <text
                    x="130"
                    y="100"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#475569"
                  >
                    Static hosting / CDN
                  </text>
                </svg>
              </div>
            </Card>

            <Card title="Non-Functional Highlights">
              <ul className="list-disc pl-5 text-sm">
                <li>HTTPS, RBAC, input validation, rate-limiting.</li>
                <li>
                  Stateless APIs for horizontal scaling; background workers for
                  reconciliation.
                </li>
                <li>Payment webhook resiliency and idempotency.</li>
              </ul>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SystemDesign;
