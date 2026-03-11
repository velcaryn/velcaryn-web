import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', padding: '20px' }}>
            <h1 style={{ color: 'var(--primary-color)', fontSize: '3rem', marginBottom: '1rem' }}>Unauthorized</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>You must be logged in as admin@velcaryn.com to access the dashboard.</p>
            <Link href="/" style={{ padding: '10px 20px', backgroundColor: 'var(--primary-color)', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>
                Return to Home
            </Link>
        </div>
    );
}
