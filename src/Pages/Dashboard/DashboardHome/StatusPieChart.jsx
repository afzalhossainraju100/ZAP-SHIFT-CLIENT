import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// data: [{ name, value, color }]
const StatusPieChart = ({ data, title }) => {
  const visible = data.filter((item) => item.value > 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold">{title}</h3>
      {visible.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-500">
          Nothing to show yet.
        </p>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={visible}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={2}
              >
                {visible.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StatusPieChart;
