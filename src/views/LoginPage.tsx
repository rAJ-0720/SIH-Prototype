import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Shield,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Lock,
  Phone,
  RefreshCw,
} from 'lucide-react';
import { artisan } from '@/data';

type Step = 'aadhaar' | 'otp' | 'success';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [step, setStep] = useState<Step>('aadhaar');
  const [aadhaar, setAadhaar] = useState('');
  const [aadhaarError, setAadhaarError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const maskedAadhaar = aadhaar
    .replace(/(\d{4})(\d{4})(\d{4})/, 'XXXX-XXXX-$3')
    .replace(/(\d{4})(\d{4})(\d{4})/, 'XXXX-XXXX-$3');

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
    setAadhaar(digits);
    setAadhaarError('');
  };

  const handleSendOtp = () => {
    if (aadhaar.length !== 12) {
      setAadhaarError('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setStep('otp');
      setResendTimer(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }, 2000);
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpError('');

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length > 0) {
      const next = ['', '', '', '', '', ''];
      digits.forEach((d, i) => { next[i] = d; });
      setOtp(next);
      otpRefs.current[Math.min(digits.length, 5)]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setOtpError('Please enter the 6-digit OTP');
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setStep('success');
      setTimeout(onLogin, 1500);
    }, 1800);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    otpRefs.current[0]?.focus();
  };

  const handleBack = () => {
    setStep('aadhaar');
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-stone-50">
      {/* Left panel — branding & imagery */}
      <div className="relative lg:w-[45%] xl:w-[42%] flex flex-col justify-between p-8 sm:p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-secondary-500/15 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07] bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/30969805/pexels-photo-30969805.jpeg?auto=compress&cs=tinysrgb&h=650&w=940)' }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3 z-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-white leading-none">KARIGAR<span className="text-primary-400"> AI</span></h1>
            <p className="text-[10px] text-stone-400 font-medium tracking-wide uppercase mt-1">AI Business Manager</p>
          </div>
        </div>

        {/* Tagline */}
        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-4 text-balance">
            Every artisan deserves an AI Business Manager.
          </h2>
          <p className="text-stone-300 text-base leading-relaxed mb-8">
            From photo to price to market — KARIGAR AI helps India's artisans build a professional online presence, in their own language.
          </p>
          <div className="space-y-3">
            {[
              'AI photo enhancement & voice cataloguing',
              'Smart pricing in 8 Indian languages',
              'AI-matched buyers and market linkage',
              'One-tap publish across commerce platforms',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-5 h-5 rounded-md bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-primary-400" strokeWidth={3} />
                </div>
                <span className="text-sm text-stone-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2 text-stone-400 text-xs">
          <Shield className="w-3.5 h-3.5" />
          <span>Secure Aadhaar OTP authentication · Prototype demo</span>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-display font-bold text-lg text-stone-900">KARIGAR<span className="text-primary-600"> AI</span></h1>
          </div>

          {/* Step: Aadhaar */}
          {step === 'aadhaar' && (
            <div className="animate-fade-in-up">
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">Welcome back</h2>
                <p className="text-sm text-stone-500">Enter your Aadhaar number to receive an OTP on your linked mobile.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">Aadhaar Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                      <Shield className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={aadhaar}
                      onChange={handleAadhaarChange}
                      onKeyDown={(e) => { if (e.key === 'Enter' && aadhaar.length === 12) handleSendOtp(); }}
                      placeholder="1234 5678 9012"
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white text-stone-900 text-lg font-medium tracking-wider placeholder:text-stone-300 placeholder:tracking-wider placeholder:font-normal transition-all focus:outline-none focus:ring-2 ${
                        aadhaarError
                          ? 'border-error-300 focus:border-error-400 focus:ring-error-100'
                          : 'border-stone-200 focus:border-primary-400 focus:ring-primary-100'
                      }`}
                    />
                  </div>
                  {aadhaarError && (
                    <p className="text-xs text-error-600 mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-error-500" /> {aadhaarError}
                    </p>
                  )}
                  <p className="text-xs text-stone-400 mt-2 flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> Your Aadhaar number is encrypted and never stored.
                  </p>
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={sending || aadhaar.length !== 12}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>

                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-stone-200" />
                  <span className="text-xs text-stone-400">Demo — any 12-digit number works</span>
                  <div className="flex-1 h-px bg-stone-200" />
                </div>

                <button
                  onClick={() => { setAadhaar('123456789012'); }}
                  className="w-full text-sm text-stone-500 hover:text-primary-600 transition-colors py-2"
                >
                  Use a sample Aadhaar number
                </button>
              </div>
            </div>
          )}

          {/* Step: OTP */}
          {step === 'otp' && (
            <div className="animate-fade-in-up">
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
                  <Phone className="w-7 h-7 text-primary-600" />
                </div>
                <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">Verify with OTP</h2>
                <p className="text-sm text-stone-500">
                  A 6-digit code was sent to the mobile number linked with
                  <span className="font-semibold text-stone-700"> {maskedAadhaar || 'your Aadhaar'}</span>.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-3 block">Enter 6-digit OTP</label>
                  <div className="flex gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border bg-white text-stone-900 transition-all focus:outline-none focus:ring-2 ${
                          otpError
                            ? 'border-error-300 focus:border-error-400 focus:ring-error-100'
                            : digit
                            ? 'border-primary-400 focus:border-primary-500 focus:ring-primary-100'
                            : 'border-stone-200 focus:border-primary-400 focus:ring-primary-100'
                        }`}
                      />
                    ))}
                  </div>
                  {otpError && (
                    <p className="text-xs text-error-600 mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-error-500" /> {otpError}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleVerify}
                  disabled={verifying || otp.join('').length !== 6}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Verify & Continue
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">Didn't receive the code?</span>
                  <button
                    onClick={handleResend}
                    disabled={resendTimer > 0}
                    className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 disabled:text-stone-400 disabled:pointer-events-none font-medium transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                </div>

                <div className="bg-accent-50 border border-accent-200 rounded-xl p-3 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-accent-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-stone-600 leading-relaxed">
                    <span className="font-semibold">Demo mode:</span> Enter any 6 digits to proceed. In production, this connects to the Aadhaar OTP API.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="animate-scale-in flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mb-6">
                <div className="w-14 h-14 rounded-full bg-success-500 flex items-center justify-center animate-scale-in">
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
              </div>
              <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">Verified!</h2>
              <p className="text-sm text-stone-500 mb-1">Welcome, {artisan.name}.</p>
              <p className="text-xs text-stone-400">Taking you to your dashboard...</p>
              <div className="mt-6 w-32 h-1 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-success-500 rounded-full animate-shimmer" style={{ width: '100%' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
