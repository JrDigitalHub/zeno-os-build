import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password', '/']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // 🚨 NUCLEAR DEBUG LOG: This will print in your Vercel Dashboard
  console.log(`[BOUNCER] Someone is trying to enter: ${path}`)

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser()
    if (!error && data?.user) user = data.user
  } catch (err) {
    console.error("[BOUNCER] Crash caught:", err)
  }

  // Check if it's a public route
  const isPublicRoute = PUBLIC_ROUTES.includes(path) || path.startsWith('/auth/callback')

  // If they aren't logged in and it's not public, KICK THEM OUT.
  if (!isPublicRoute && !user) {
    console.log(`[BOUNCER] Access Denied. Kicking user to /login`)
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && (path === '/login' || path === '/signup')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

// 👉 We simplified the matcher to ensure it catches absolutely everything in the app folder
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}