import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import ToasterProvider from "../../components/dashboard/ToasterProvider";
import "./dashboard.css"; // We will create this next

export default async function DashboardLayout({ children }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin?callbackUrl=/dashboard");
    }

    if (session.user?.email !== "admin@velcaryn.com") {
        redirect("/dashboard/unauthorized");
    }

    return (
        <div className="dashboard-layout">
            <ToasterProvider />
            <aside className="dashboard-sidebar">
                <div className="sidebar-brand">
                    <Link href="/">
                        <img src="/assets/VELCARYN-SVG.svg" alt="Velcaryn" style={{ width: '160px', marginBottom: '8px', filter: 'brightness(0) invert(1)' }} />
                    </Link>
                    <span className="brand-badge">Admin</span>
                </div>
                <nav className="sidebar-nav">
                    <Link href="/dashboard" className="nav-item">Current Catalog</Link>
                    <Link href="/dashboard/add" className="nav-item">Add Product</Link>
                    <Link href="/dashboard/drafts" className="nav-item">Drafts</Link>
                    <Link href="/dashboard/archives" className="nav-item">Archives</Link>
                    <Link href="/dashboard/categories" className="nav-item">Categories</Link>
                </nav>
                <div className="sidebar-footer">
                    <p className="admin-email">{session.user.email}</p>
                    <Link href="/api/auth/signout" className="nav-item signout-btn">Sign Out</Link>
                </div>
            </aside>
            <main className="dashboard-main">
                {children}
            </main>
        </div>
    );
}
