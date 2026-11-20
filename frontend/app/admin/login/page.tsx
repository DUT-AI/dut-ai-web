'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShieldCheck, Lock, Mail, ArrowRight, ExternalLink } from 'lucide-react'
import { loginAdminAction } from '../actions'

const SSO_LOGIN_URL = process.env.NEXT_PUBLIC_SSO_LOGIN_URL || 'https://workspace.dutai.io.vn/login'

export default function AdminLoginPage() {
  const router = useRouter()
  const [showManualLogin, setShowManualLogin] = useState(false)
  const [state, setState] = useState<{ error?: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSsoLogin = () => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : ''
    const redirectUrl = `${currentOrigin}/admin`
    const ssoUrl = `${SSO_LOGIN_URL}?redirect=${encodeURIComponent(redirectUrl)}`
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(ssoUrl)
  }

  const handleManualSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await loginAdminAction(null, formData)
      if (res?.error) {
        setState({ error: res.error })
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-slate-950">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/10" />
      </div>

      <div className="relative w-full max-w-md space-y-8 rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-xl backdrop-blur-2xl sm:p-10 dark:border-white/10 dark:bg-slate-900/80">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            DUT AI Management
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Đăng nhập hệ thống quản trị DUT-AI
          </p>
        </div>

        {state?.error && (
          <div className="rounded-xl border border-red-500/20 bg-red-50/80 p-3.5 text-center text-sm font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {state.error}
          </div>
        )}

        {/* Primary SSO Login Action */}
        <div className="space-y-4">
          <Button
            type="button"
            onClick={handleSsoLogin}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700"
          >
            <span>Đăng nhập qua DUT-AI Workspace</span>
            <ExternalLink className="h-4 w-4" />
          </Button>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Tài khoản dùng chung liên kết toàn bộ hệ sinh thái{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">*.dutai.io.vn</span>
          </p>
        </div>

        {/* Toggle Manual Fallback Login */}
        <div className="border-t border-slate-200/60 pt-2 dark:border-white/5">
          <button
            type="button"
            onClick={() => setShowManualLogin(!showManualLogin)}
            className="w-full cursor-pointer text-center text-xs text-slate-500 transition-colors hover:text-slate-800 dark:hover:text-slate-200"
          >
            {showManualLogin
              ? '▲ Ẩn đăng nhập dự phòng'
              : '▼ Đăng nhập trực tiếp bằng tài khoản mật khẩu'}
          </button>
        </div>

        {showManualLogin && (
          <form action={handleManualSubmit} className="animate-in fade-in space-y-4 duration-200">
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                Email quản trị
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@dutai.io.vn"
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                Mật khẩu
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="pl-9"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              variant="outline"
              className="mt-2 h-10 w-full"
            >
              {isPending ? 'Đang xác thực...' : 'Đăng nhập thủ công'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
