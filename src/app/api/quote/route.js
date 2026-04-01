import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';

        const body = await req.json();
        
        // 2. Honeypot Bot Protection
        // If the invisible 'bot_trap' field is filled by an automated scraper, silently succeed.
        if (body.bot_trap) {
            console.log(`[SECURITY] Blocked automated bot submission from IP: ${ip}`);
            // Return 200 OK to trick the bot into thinking it succeeded.
            return NextResponse.json({ success: true, message: 'Message recorded.' });
        }

        // Validate generic required fields broadly
        if (!body.email || !body.first_name || !body.subject) {
            return NextResponse.json(
                { success: false, error: "Missing required contact fields." },
                { status: 400 }
            );
        }

        // We use the EmailJS REST API here so we don't need the @emailjs/browser SDK on the server
        const serviceId = process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.EMAILJS_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
        const privateKey = process.env.EMAILJS_PRIVATE_KEY;

        if (!serviceId || !templateId || !publicKey) {
             console.error("[EMAIL API] Missing core EmailJS Env vars");
             return NextResponse.json({ error: "Server misconfiguration. Cannot send mail." }, { status: 500 });
        }

        const emailJsPayload = {
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: body
        };

        // If Private Key is available (highly recommended), attach it for absolute REST API validation
        if (privateKey) {
            emailJsPayload.accessToken = privateKey;
        }

        const emailReq = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify(emailJsPayload)
        });

        if (!emailReq.ok) {
            const errorText = await emailReq.text();
            console.error("[EMAIL API ERROR]", emailReq.status, errorText);
            return NextResponse.json(
                { success: false, error: "Failed to dispatch email securely via upstream provider." },
                { status: 502 }
            );
        }

        // Successfully sent
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Quote API processing fault:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error processing quote request." },
            { status: 500 }
        );
    }
}
