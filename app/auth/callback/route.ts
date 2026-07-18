// app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const type = searchParams.get('type')
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        // For password-recovery callbacks, redirect to the profile page
        // with a reset flag so the UI skips old-password verification.
        const isRecovery = type === 'recovery'
        const redirectTo = isRecovery
            ? `${origin}/dashboard/profile?reset=true`
            : `${origin}${next}`

        let response = NextResponse.redirect(redirectTo)

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            return response
        }
    }

    // Auth failed or no code present — send to login with an error flag
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}