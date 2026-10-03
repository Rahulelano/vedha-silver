import { useState, useEffect } from "react";

export function OrdersManager({ token }: { token: string }) {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (Array.isArray(data)) setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markDelivered = async (id: string) => {
    await fetch(`/api/orders/${id}/deliver`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchOrders();
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border mt-4">
      <h2 className="text-xl font-bold mb-4">Orders ({orders.length})</h2>
      <div className="grid grid-cols-1 gap-4">
        {orders.map((o) => (
          <div key={o._id} className="border p-4 rounded-lg shadow-sm flex flex-col gap-2 bg-white">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-semibold">Order ID: {o._id}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(o.createdAt).toLocaleDateString()}
              </span>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <p className="font-medium text-sm text-muted-foreground mt-2">Customer & Address</p>
                  <p className="font-semibold text-sm">{o.user?.name} ({o.user?.email})</p>
                  <p className="text-sm mt-1">
                    {o.shippingAddress?.address}, {o.shippingAddress?.city} - {o.shippingAddress?.postalCode} <br/>
                    {o.shippingAddress?.country}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm text-muted-foreground mt-2 border-b pb-1">Items ({o.orderItems?.length})</p>
                  <ul className="text-sm space-y-2 mt-2">
                    {o.orderItems?.map((item: any, i: number) => (
                      <li key={i} className="flex gap-2 items-start">
                        <img src={item.image} alt={item.name} className="size-10 rounded object-cover" />
                        <div>
                          <p className="font-semibold leading-tight">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.variant || "Standard"} · Qty {item.qty}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex justify-between items-center bg-secondary/50 p-3 rounded mt-2">
                <span className="font-semibold">Total Price</span>
                <span className="font-bold text-lg">₹{o.totalPrice}</span>
              </div>
            <div className="mt-2 flex items-center justify-between">
              <p>Status: <span className={`font-semibold ${o.isDelivered ? 'text-green-600' : 'text-orange-500'}`}>{o.isDelivered ? "Delivered" : "Pending"}</span></p>
              {!o.isDelivered && (
                <button
                  onClick={() => markDelivered(o._id)}
                  className="bg-charcoal text-white py-2 px-6 rounded font-semibold text-sm hover:bg-charcoal/90 transition-colors"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
      </div>
    </div>
  );
}
