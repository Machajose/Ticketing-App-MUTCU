import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';

export default function AuthPage({ supabase }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  async function signIn(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (authError) setError(authError.message);
    setBusy(false);
  }

  async function sendSignInLink() {
    if (!email.trim()) {
      setError('Enter your email address first.');
      return;
    }
    setBusy(true);
    setError('');
    setNotice('');
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: window.location.origin },
    });
    if (authError) setError(authError.message);
    else setNotice('Check your email for a secure sign-in link.');
    setBusy(false);
  }

  return <main className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-4 py-10 text-cream">
    <div className="pointer-events-none absolute -right-40 -top-44 h-[520px] w-[520px] rounded-full bg-ember/[.09] blur-[130px]" />
    <div className="grain pointer-events-none absolute inset-0 opacity-[.06]" />
    <section className="relative w-full max-w-[420px] rounded-[26px] border border-white/[.09] bg-[#191817]/95 p-6 shadow-2xl sm:p-8">
      <div className="flex items-center gap-3">
        <img src="/gems-tickets-mark.svg" alt="" className="h-11 w-11 rounded-xl" />
        <div><div className="font-display text-sm font-extrabold tracking-[.12em]">GEMS TICKETS</div><div className="mt-1 text-[9px] font-bold tracking-[.2em] text-white/40">EVENT WORKSPACE</div></div>
      </div>
      <div className="mt-8"><h1 className="font-display text-2xl font-extrabold text-white">Sign in</h1><p className="mt-2 text-xs leading-relaxed text-white/45">Use your organizer account to manage tickets and check in guests.</p></div>
      <form onSubmit={signIn} className="mt-6 space-y-4">
        <label className="block"><span className="mb-1.5 block text-[10px] font-semibold text-white/55">Email address</span><span className="flex h-11 items-center gap-2.5 rounded-xl border border-white/[.09] bg-black/20 px-3 focus-within:border-ember/60"><Mail size={15} className="text-white/30"/><input required type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/25"/></span></label>
        <label className="block"><span className="mb-1.5 block text-[10px] font-semibold text-white/55">Password</span><span className="flex h-11 items-center gap-2.5 rounded-xl border border-white/[.09] bg-black/20 px-3 focus-within:border-ember/60"><LockKeyhole size={15} className="text-white/30"/><input required type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/25"/><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="text-white/35 hover:text-white/70">{showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}</button></span></label>
        {error && <p role="alert" className="rounded-lg border border-red-300/15 bg-red-400/[.06] px-3 py-2 text-[11px] text-red-200">{error}</p>}
        {notice && <p role="status" className="rounded-lg border border-emerald-300/15 bg-emerald-400/[.06] px-3 py-2 text-[11px] text-emerald-200">{notice}</p>}
        <button disabled={busy} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-ember text-xs font-bold text-ink transition hover:bg-[#ff7748] disabled:cursor-wait disabled:opacity-60">{busy ? 'Please wait…' : 'Sign in to workspace'}<ArrowRight size={15}/></button>
      </form>
      <div className="mt-5 border-t border-white/[.07] pt-4 text-center"><button disabled={busy} onClick={sendSignInLink} className="text-[10px] font-semibold text-white/45 transition hover:text-ember disabled:opacity-50">Email me a secure sign-in link</button></div>
    </section>
  </main>;
}
