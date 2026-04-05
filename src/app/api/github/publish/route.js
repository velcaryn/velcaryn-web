import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

/**
 * OBSOLETE ROUTE: GitHub Publishing
 * This route is maintained as a no-op to satisfy legacy Dashboard UI components.
 * Persistence is now handled in real-time by the MongoDB Admin API routes.
 */
export async function POST(req) {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.email !== "admin@velcaryn.com") {
        return NextResponse.json({ success: false, error: "Unauthorized Gateway Access" }, { status: 401 });
    }

    try {
        return NextResponse.json({ 
            success: true, 
            message: "Database sync complete. (Legacy GitHub publish bypassed as MongoDB is now the primary authority.)" 
        });
    } catch (error) {
        console.error("Legacy Publish Shortcut Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
