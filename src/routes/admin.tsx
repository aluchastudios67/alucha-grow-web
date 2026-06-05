import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { 
  Shield, 
  Mail, 
  Layers, 
  Calendar, 
  CheckCircle, 
  MessageSquare, 
  ArrowLeft, 
  Search, 
  Copy, 
  Check, 
  AlertCircle, 
  FileText,
  Clock,
  LogOut,
  Trash2
} from "lucide-react";
import { 
  getOrders, 
  checkSmtpStatus, 
  updateOrderStatus,
  deleteOrder,
  Order 
} from "@/lib/api/orders.functions";

export const Route = createFileRoute("/admin")({
  loader: async () => {
    let orders: Order[] = [];
    let loadError: string | null = null;
    let smtp: any = { isConfigured: false, smtpHost: null, smtpUser: null, supabase: null };

    try {
      orders = await getOrders();
    } catch (err: any) {
      console.error("Loader error fetching orders:", err);
      loadError = err?.message || String(err);
    }

    try {
      smtp = await checkSmtpStatus();
    } catch (err: any) {
      console.error("Loader error checking SMTP status:", err);
      if (!loadError) loadError = err?.message || String(err);
    }

    return { initialOrders: orders, smtp, loadError };
  },
  component: AdminComponent,
});

function AdminComponent() {
  const { initialOrders, smtp, loadError } = Route.useLoaderData();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "new" | "read" | "replied">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem("alucha_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "prunus" && password === "TavaTana99") {
      sessionStorage.setItem("alucha_admin_auth", "true");
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("INVALID CREDENTIALS. ACCESS DENIED.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("alucha_admin_auth");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  const handleSelectOrder = async (order: Order) => {
    setSelectedOrder(order);
    if (order.status === "new") {
      await handleStatusChange(order.id, "read");
    }
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      const query = search.toLowerCase();
      const matchesSearch = (
        order.name.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query) ||
        order.type.toLowerCase().includes(query) ||
        order.message.toLowerCase().includes(query)
      );
      
      const matchesTab = activeTab === "all" || order.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [initialOrders, search, activeTab]);

  const stats = useMemo(() => {
    return {
      total: initialOrders.length,
      new: initialOrders.filter(o => o.status === "new").length,
      read: initialOrders.filter(o => o.status === "read").length,
      replied: initialOrders.filter(o => o.status === "replied").length,
    };
  }, [initialOrders]);

  const handleStatusChange = async (id: string, status: "new" | "read" | "replied") => {
    setUpdatingId(id);
    try {
      await updateOrderStatus({ data: { id, status } });
      await router.invalidate();
      // Update the active detail view if it's currently selected
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(prev => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteOrder({ data: { id } });
      if (selectedOrder?.id === id) setSelectedOrder(null);
      setConfirmDeleteId(null);
      await router.invalidate();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center p-4 selection:bg-green-500 selection:text-black">
        <div className="max-w-md w-full border border-green-500/40 p-8 rounded bg-black relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl bg-green-500/10 pointer-events-none" />
          
          <div className="text-center mb-6">
            <Shield className="mx-auto text-green-500 mb-3 animate-pulse" size={40} />
            <h2 className="text-lg font-bold tracking-widest text-green-400 uppercase">
              // AUTHORIZATION //
            </h2>
            <p className="text-[10px] text-green-600/80 mt-1">
              AUTHORIZED ACCESS ONLY · SECURITY LOG ACTIVE
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-green-600 mb-2">
                &gt; USERNAME
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-black border border-green-500/30 text-green-500 text-sm px-3 py-2.5 rounded focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-green-600 mb-2">
                &gt; SECRET PASSCODE
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-black border border-green-500/30 text-green-500 text-sm px-3 py-2.5 rounded focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
              />
            </div>

            {loginError && (
              <div className="text-red-500 text-xs border border-red-500/50 bg-red-950/20 px-3 py-2 rounded text-center font-bold">
                !!! {loginError} !!!
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-bold uppercase transition-all tracking-wider text-xs cursor-pointer"
            >
              INITIALIZE CONNECTION
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-[10px] text-green-700 hover:underline hover:text-green-500">
              &lt; RETURN TO PORTAL
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 sm:p-8 flex flex-col antialiased selection:bg-green-500 selection:text-black">
      {/* Header */}
      <header className="border-b border-green-500/30 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Shield className="text-green-500 animate-pulse" size={24} />
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider uppercase text-green-400">
              Alucha Studios // Admin Terminal
            </h1>
          </div>
          <p className="text-xs text-green-600/80 mt-1">
            SECURE SYSTEM OVERVIEW · DATA STORE ACTIVE
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-4 py-2 border border-green-500/40 text-xs rounded hover:bg-green-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} /> EXIT TO MAIN
          </Link>
          <button 
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/40 text-red-500 text-xs rounded hover:bg-red-500 hover:text-black transition-colors cursor-pointer"
          >
            <LogOut size={14} /> LOGOUT
          </button>
        </div>
      </header>

      {/* System Status, loadError, SMTP, and Supabase diagnostics */}
      {loadError && (
        <div className="mb-6 p-4 border border-red-500 bg-red-950/20 text-red-400 rounded-lg text-xs font-mono space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle size={16} /> SYSTEM ERROR DETECTED DURING LOAD
          </div>
          <p className="whitespace-pre-wrap">{loadError}</p>
          <p className="text-red-500/80">
            Please make sure that the Supabase environment variables are correctly set on Vercel and that you have redeployed the project.
          </p>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-green-500/30 bg-green-950/10 p-4 rounded flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-green-600 uppercase block">System Status</span>
            <span className="text-sm font-semibold tracking-wide">ONLINE / SECURE</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
        </div>

        <div className="border border-green-500/30 bg-green-950/10 p-4 rounded flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-green-600 uppercase block">Email Routing Status (aluchastudios67@gmail.com)</span>
            <span className="text-sm font-semibold block truncate">
              {smtp.isConfigured 
                ? `ACTIVE` 
                : "LOCAL LOG Fallback Mode"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {smtp.isConfigured ? (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 border border-green-500 bg-green-950/30 text-green-400">
                ACTIVE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 border border-amber-500/50 bg-amber-950/20 text-amber-500">
                <AlertCircle size={12} /> LOCAL_ONLY
              </span>
            )}
          </div>
        </div>

        <div className="border border-green-500/30 bg-green-950/10 p-4 rounded flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-green-600 uppercase block">Supabase Connection</span>
            <span className="text-sm font-semibold block truncate">
              {smtp.supabase?.url ? "CONFIGURED" : "MISSING ENV VARS"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {smtp.supabase?.url && smtp.supabase?.hasAnonKey ? (
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 border border-green-500 bg-green-950/30 text-green-400">
                OK
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 border border-red-500 bg-red-950/20 text-red-400">
                ⚠️ ERROR
              </span>
            )}
          </div>
        </div>

        {smtp.supabase && (
          <div className="md:col-span-3 border border-green-500/20 bg-green-950/5 p-4 rounded text-xs space-y-1 font-mono">
            <span className="text-green-600 uppercase block mb-1">Server Environment Diagnostics</span>
            <p>SUPABASE_URL: <span className="text-white">{smtp.supabase.url || "MISSING"}</span></p>
            <p>SUPABASE_ANON_KEY: <span className="text-white">
              {smtp.supabase.hasAnonKey 
                ? `PRESENT (${smtp.supabase.anonKeyLength} chars, starts with "${smtp.supabase.anonKeyStart}")` 
                : "MISSING"}
            </span></p>
          </div>
        )}
      </div>

      {/* Stats Board */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Inquiries", val: stats.total },
          { label: "Unopened (New)", val: stats.new, hl: true },
          { label: "Opened (Read)", val: stats.read },
          { label: "Completed", val: stats.replied }
        ].map((stat, idx) => (
          <div 
            key={idx} 
            className={`border rounded p-4 bg-green-950/5 ${
              stat.hl ? "border-green-500" : "border-green-500/20"
            }`}
          >
            <span className="text-xs text-green-600 uppercase block">{stat.label}</span>
            <span className="text-3xl font-bold tracking-tight mt-2 block">{stat.val}</span>
          </div>
        ))}
      </section>

      {/* Main Workspace */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8 flex-grow">
        {/* Orders List */}
        <div className="border border-green-500/30 rounded p-6 bg-black flex flex-col">
          <div className="flex justify-between items-center mb-6 gap-4">
            <h2 className="text-md font-bold tracking-wide text-green-400 uppercase">
              Inbox Logs [{filteredOrders.length}]
            </h2>
            {/* Search */}
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH SYSTEM..."
                className="w-full bg-black border border-green-500/30 text-green-500 text-xs px-3 py-2 pl-8 rounded focus:outline-none focus:border-green-500"
              />
              <Search className="absolute left-2.5 top-2.5 text-green-600" size={14} />
            </div>
          </div>

          {/* Status Tab Filters */}
          <div className="flex border-b border-green-500/20 mb-6 text-xs gap-1">
            {(["all", "new", "read", "replied"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 border-b-2 font-bold uppercase transition-colors hover:text-green-400 whitespace-nowrap cursor-pointer ${
                  activeTab === tab
                    ? "border-green-500 text-green-400 bg-green-950/20"
                    : "border-transparent text-green-600/60"
                }`}
              >
                {tab === "all" 
                  ? "All Logs" 
                  : tab === "new" 
                  ? `Unopened (${stats.new})` 
                  : tab === "read" 
                  ? "Opened" 
                  : "Completed"}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-green-500/30 text-green-600 uppercase">
                  <th className="pb-3 font-semibold">Timestamp</th>
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Project</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-green-700">
                      NO RECORDS DETECTED
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isNew = order.status === "new";
                    const isReplied = order.status === "replied";
                    
                    return (
                      <tr 
                        key={order.id} 
                        onClick={() => handleSelectOrder(order)}
                        className={`border-b border-green-950 hover:bg-green-950/20 cursor-pointer transition-colors ${
                          selectedOrder?.id === order.id ? "bg-green-950/30" : ""
                        } ${isReplied ? "opacity-45 text-green-700/80 hover:opacity-100" : ""}`}
                      >
                        <td className="py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {isNew ? (
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                            ) : isReplied ? (
                              <CheckCircle size={10} className="text-green-700 shrink-0" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-green-800 shrink-0" />
                            )}
                            <span className={isNew ? "text-green-400 font-bold" : "text-green-600"}>
                              {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </td>
                        <td className={`py-4 max-w-[120px] truncate ${isNew ? "text-green-300 font-extrabold" : "font-medium"}`}>
                          {order.name}
                        </td>
                        <td className={`py-4 ${isNew ? "text-green-400 font-bold" : "text-green-500"}`}>{order.type}</td>
                        <td className="py-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] ${
                            isNew 
                              ? "border border-green-500 text-green-400 bg-green-950/40 font-bold" 
                              : order.status === "read"
                              ? "border border-green-700/50 text-green-600 bg-transparent"
                              : "border border-green-950 text-green-800 bg-transparent"
                          }`}>
                            {isReplied ? "COMPLETED" : order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleCopyEmail(order.email, order.id)}
                              className="p-1 hover:text-white transition-colors"
                              title="Copy Email"
                            >
                              {copiedId === order.id ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                            {(order.status === "read" || order.status === "replied") && (
                              confirmDeleteId === order.id ? (
                                <span className="flex items-center gap-1 ml-1">
                                  <button
                                    onClick={() => handleDelete(order.id)}
                                    disabled={deletingId === order.id}
                                    className="text-[10px] px-1.5 py-0.5 bg-red-600 text-white rounded hover:bg-red-500 transition-colors disabled:opacity-50 cursor-pointer"
                                    title="Confirm delete"
                                  >
                                    {deletingId === order.id ? "..." : "YES"}
                                  </button>
                                  <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="text-[10px] px-1.5 py-0.5 border border-green-500/30 text-green-600 rounded hover:bg-green-950/30 transition-colors cursor-pointer"
                                    title="Cancel"
                                  >
                                    NO
                                  </button>
                                </span>
                              ) : (
                                <button
                                  onClick={() => setConfirmDeleteId(order.id)}
                                  className="p-1 text-green-700 hover:text-red-500 transition-colors ml-1"
                                  title="Delete message"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed View Panel */}
        <div className="border border-green-500/30 rounded p-6 bg-black flex flex-col justify-between">
          {selectedOrder ? (
            <div className="space-y-6 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start border-b border-green-950 pb-4 mb-4">
                  <div>
                    <h3 className="text-md font-bold text-green-400 uppercase">
                      Inquiry Details
                    </h3>
                    <p className="text-[10px] text-green-700 mt-1">
                      ID: {selectedOrder.id} · TIMESTAMP: {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-green-600">MARK:</span>
                    <select
                      value={selectedOrder.status}
                      disabled={updatingId === selectedOrder.id}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as any)}
                      className="bg-black border border-green-500/30 text-green-500 text-xs px-2 py-1 rounded focus:outline-none"
                    >
                      <option value="new">NEW</option>
                      <option value="read">READ</option>
                      <option value="replied">REPLIED</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-[80px_1fr] gap-2 text-xs">
                    <span className="text-green-700 uppercase">Client:</span>
                    <span className="font-bold text-white">{selectedOrder.name}</span>
                  </div>
                  
                  <div className="grid grid-cols-[80px_1fr] gap-2 text-xs">
                    <span className="text-green-700 uppercase">Email:</span>
                    <span className="flex items-center gap-2">
                      <span className="font-bold text-white">{selectedOrder.email}</span>
                      <button 
                        onClick={() => handleCopyEmail(selectedOrder.email, `detail-${selectedOrder.id}`)}
                        className="text-green-500 hover:text-white"
                      >
                        {copiedId === `detail-${selectedOrder.id}` ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </span>
                  </div>

                  <div className="grid grid-cols-[80px_1fr] gap-2 text-xs">
                    <span className="text-green-700 uppercase">Project:</span>
                    <span className="text-green-400 font-bold uppercase">{selectedOrder.type}</span>
                  </div>

                  <div className="border-t border-green-950 pt-4 mt-4">
                    <span className="text-xs text-green-700 uppercase block mb-2">Message Body:</span>
                    <div className="bg-green-950/10 border border-green-500/10 p-4 rounded text-xs text-green-300 whitespace-pre-wrap leading-relaxed max-h-[250px] overflow-y-auto">
                      {selectedOrder.message}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-6 border-t border-green-950 flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, "new")}
                  disabled={selectedOrder.status === "new" || updatingId === selectedOrder.id}
                  className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-green-500/30 text-xs rounded hover:bg-green-500/10 hover:border-green-500 text-green-400 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <Clock size={12} /> MARK UNREAD
                </button>
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, "replied")}
                  disabled={selectedOrder.status === "replied" || updatingId === selectedOrder.id}
                  className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500 text-black text-xs font-bold rounded hover:bg-green-400 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <CheckCircle size={12} /> MARK COMPLETED
                </button>
              </div>
              {/* Delete Button — only for reviewed (read/replied) messages */}
              {(selectedOrder.status === "read" || selectedOrder.status === "replied") && (
                <div className="pt-3">
                  {confirmDeleteId === `detail-${selectedOrder.id}` ? (
                    <div className="flex items-center gap-2 border border-red-500/30 bg-red-950/10 rounded px-3 py-2">
                      <span className="text-xs text-red-400 flex-1">Permanently delete this record?</span>
                      <button
                        onClick={() => handleDelete(selectedOrder.id)}
                        disabled={deletingId === selectedOrder.id}
                        className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition-colors disabled:opacity-50 font-bold cursor-pointer"
                      >
                        {deletingId === selectedOrder.id ? "DELETING..." : "CONFIRM"}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs px-3 py-1 border border-green-500/30 text-green-600 rounded hover:bg-green-950/30 transition-colors cursor-pointer"
                      >
                        CANCEL
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(`detail-${selectedOrder.id}`)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-red-500/20 text-red-600 text-xs rounded hover:bg-red-950/20 hover:border-red-500/50 transition-colors cursor-pointer"
                    >
                      <Trash2 size={12} /> DELETE MESSAGE
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8 text-green-800">
              <FileText size={48} className="mb-4 text-green-950 stroke-[1.5]" />
              <p className="text-xs uppercase tracking-wider">
                Select a message from the inbox log to examine contents and execute updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
