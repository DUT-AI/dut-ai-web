'use client'

import { useActionState } from 'react'
import { loginAdminAction } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShieldCheck, Lock, User, Sparkles } from 'lucide-react'
import Image from 'next/image'

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl dark:bg-blue-600/10" />
      </div>

      <div className="relative w-full max-w-md space-y-8 rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/80 sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            DUT AI Management
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Đăng nhập bảng điều khiển quản trị hệ thống
          </p>
        </div>

        {state?.error && (
          <div className="rounded-xl border border-red-500/20 bg-red-50/80 p-3.5 text-center text-sm font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {state.error}
          </div>
        )}

        <form action={formAction} className="mt-8 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Tài khoản
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="admin"
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
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
          </div>

          <Button type="submit" disabled={isPending} className="w-full h-11 text-base font-semibold">
            {isPending ? 'Đang xác thực...' : 'Đăng nhập'}
          </Button>
        </form>

        <div className="text-center text-xs text-slate-400">
          DUT AI Club © 2026 • Secure Admin Portal
        </div>
      </div>
    </div>
  )
}
