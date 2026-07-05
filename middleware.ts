import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// 🟢 THE PUBLIC WHITELIST: Only these exact paths are open to the world.
// EVERYTHING ELSE (/onboarding, /dashboard, /cfo, /api, etc.) is instantly locked.
const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password', '/']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null;

  try {
    const { data, error } = await supabase.auth.getUser()
    if (!error && data?.user) {
      user = data.user
    }
  } catch (err) {
    console.error("Middleware Critical Crash Caught:", err)
  }

  const path = request.nextUrl.pathname

  // Check if the current path is exactly in the public whitelist 
  // (We also allow /auth/callback so Supabase can verify user emails safely)
  const isPublicRoute = PUBLIC_ROUTES.includes(path) || path.startsWith('/auth/callback')

  // 🛑 THE ULTIMATE BOUNCER: If it's NOT a public route and they ARE NOT logged in -> kick them out!
  if (!isPublicRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // UX BONUS: If they ARE logged in and try to visit the login page, push them inside.
  if (user && (path === '/login' || path === '/signup')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard' // Or /onboarding, depending on where you want them to land
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    // This regex applies the middleware to every single route in your app, 
    // while completely ignoring static files like images and CSS.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}