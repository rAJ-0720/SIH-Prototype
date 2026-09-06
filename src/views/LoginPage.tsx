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
  Mic,
  Globe,
  Hammer,
  ShoppingBag,
} from 'lucide-react';
import { artisan } from '@/data';
import { useLanguage } from '@/language-context';
import { languages, type LangCode } from '@/i18n';

type Step = 'language' | 'role' | 'aadhaar' | 'otp' | 'success';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const { t, lang, setLang, role, setRole } = useLanguage();
  const [step, setStep] = useState<Step>('language');
  const [aadhaar, setAadhaar] = useState('');
  const [aadhaarError, setAadhaarError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Voice recognition state
  const [voiceListening, setVoiceListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const recognitionRef = useRef<any>(null);

  const speechSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const initRecognition = (langCode: LangCode) => {
    if (!speechSupported) return null;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    const speechLangMap: Record<LangCode, string> = {
      en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', te: 'te-IN', mr: 'mr-IN',
      ta: 'ta-IN', gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN',
      or: 'or-IN', as: 'as-IN',
    };
    recognition.lang = speechLangMap[langCode] || 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    return recognition;
  };

  const startVoiceLanguage = () => {
    if (!speechSupported) { setVoiceError(t('voice_unsupported')); return; }
    setVoiceError('');
    setVoiceListening(true);
    const recognition = initRecognition('en');
    if (!recognition) { setVoiceListening(false); return; }
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      setVoiceListening(false);
      const match = languages.find(l =>
        l.name.toLowerCase() === transcript ||
        l.nativeName === transcript ||
        transcript.includes(l.name.toLowerCase()) ||
        transcript.includes(l.nativeName)
      );
      if (match) {
        setLang(match.code);
        setTimeout(() => setStep('role'), 400);
      } else {
        setVoiceError(t('voice_no_speech'));
      }
    };
    recognition.onerror = () => { setVoiceListening(false); setVoiceError(t('voice_error')); };
    recognition.onend = () => setVoiceListening(false);
    recognition.start();
  };

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
      setAadhaarError(t('aadhaar_error'));
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
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
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
    if (code.length !== 6) { setOtpError(t('otp_error')); return; }
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

  const handleBack = () => { setStep('aadhaar'); setOtp(['', '', '', '', '', '']); setOtpError(''); };

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

        <div className="relative flex items-center gap-3 z-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-white leading-none">KalaKart<span className="text-primary-400"> AI</span></h1>
            <p className="text-[10px] text-stone-400 font-medium tracking-wide uppercase mt-1">{t('ai_business_manager')}</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-4 text-balance">
            {t('every_artisan')}
          </h2>
          <p className="text-stone-300 text-base leading-relaxed mb-8">{t('tagline')}</p>
          <div className="space-y-3">
            {[t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4')].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-5 h-5 rounded-md bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-primary-400" strokeWidth={3} />
                </div>
                <span className="text-sm text-stone-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-stone-400 text-xs">
          <Shield className="w-3.5 h-3.5" />
          <span>{t('secure_aadhaar')}</span>
        </div>
      </div>

      {/* Right panel — login flow */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-display font-bold text-lg text-stone-900">KalaKart<span className="text-primary-600"> AI</span></h1>
          </div>

          {/* Step: Language selection */}
          {step === 'language' && (
            <div className="animate-fade-in-up">
              <div className="mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
                  <Globe className="w-7 h-7 text-primary-600" />
                </div>
                <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">{t('choose_language')}</h2>
                <p className="text-sm text-stone-500">{t('choose_language_desc')}</p>
              </div>

              {/* Voice prompt */}
              <button
                onClick={startVoiceLanguage}
                disabled={voiceListening}
                className={`w-full mb-4 flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all ${
                  voiceListening
                    ? 'border-primary-400 bg-primary-50'
                    : 'border-stone-200 bg-white hover:border-primary-300 hover:bg-primary-50/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  voiceListening ? 'bg-error-500 animate-pulse' : 'bg-primary-100'
                }`}>
                  <Mic className={`w-5 h-5 ${voiceListening ? 'text-white' : 'text-primary-600'}`} />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold text-stone-800">
                    {voiceListening ? t('listening') : t('speak_your_language')}
                  </p>
                  <p className="text-[11px] text-stone-400">{t('tap_to_speak')}</p>
                </div>
              </button>
              {voiceError && (
                <p className="text-xs text-error-600 mb-3 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-error-500" /> {voiceError}
                </p>
              )}

              {/* Language grid */}
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto scrollbar-hide">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); }}
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border transition-all ${
                      lang === l.code
                        ? 'border-primary-400 bg-primary-50 ring-2 ring-primary-100'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-2xl">{l.flag}</span>
                    <span className={`text-xs font-medium text-center ${lang === l.code ? 'text-primary-700' : 'text-stone-600'}`}>{l.nativeName}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep('role')}
                className="w-full mt-5 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {t('continue_btn')} <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          )}

          {/* Step: Role selection */}
          {step === 'role' && (
            <div className="animate-fade-in-up">
              <button
                onClick={() => setStep('language')}
                className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> {t('back')}
              </button>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">{t('who_are_you')}</h2>
                <p className="text-sm text-stone-500">{t('who_are_you_desc')}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setRole('artisan')}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                    role === 'artisan'
                      ? 'border-primary-400 bg-primary-50 ring-2 ring-primary-100'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    role === 'artisan' ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-stone-100'
                  }`}>
                    <Hammer className={`w-7 h-7 ${role === 'artisan' ? 'text-white' : 'text-stone-500'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-display font-bold text-base ${role === 'artisan' ? 'text-primary-700' : 'text-stone-800'}`}>{t('i_am_artisan')}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{t('artisan_role_desc')}</p>
                  </div>
                  {role === 'artisan' && (
                    <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setRole('buyer')}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                    role === 'buyer'
                      ? 'border-secondary-400 bg-secondary-50 ring-2 ring-secondary-100'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    role === 'buyer' ? 'bg-gradient-to-br from-secondary-500 to-secondary-700' : 'bg-stone-100'
                  }`}>
                    <ShoppingBag className={`w-7 h-7 ${role === 'buyer' ? 'text-white' : 'text-stone-500'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-display font-bold text-base ${role === 'buyer' ? 'text-secondary-700' : 'text-stone-800'}`}>{t('i_am_buyer')}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{t('buyer_role_desc')}</p>
                  </div>
                  {role === 'buyer' && (
                    <div className="w-6 h-6 rounded-full bg-secondary-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              </div>

              <button
                onClick={() => setStep('aadhaar')}
                className="w-full mt-5 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {t('continue_btn')} <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          )}

          {/* Step: Aadhaar */}
          {step === 'aadhaar' && (
            <div className="animate-fade-in-up">
              <button
                onClick={() => setStep('role')}
                className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> {t('back')}
              </button>
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">{t('welcome_back')}</h2>
                <p className="text-sm text-stone-500">{t('aadhaar_desc')}</p>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">{t('aadhaar_number')}</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"><Shield className="w-5 h-5" /></div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={aadhaar}
                      onChange={handleAadhaarChange}
                      onKeyDown={(e) => { if (e.key === 'Enter' && aadhaar.length === 12) handleSendOtp(); }}
                      placeholder="1234 5678 9012"
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white text-stone-900 text-lg font-medium tracking-wider placeholder:text-stone-300 placeholder:tracking-wider placeholder:font-normal transition-all focus:outline-none focus:ring-2 ${
                        aadhaarError ? 'border-error-300 focus:border-error-400 focus:ring-error-100' : 'border-stone-200 focus:border-primary-400 focus:ring-primary-100'
                      }`}
                    />
                  </div>
                  {aadhaarError && (
                    <p className="text-xs text-error-600 mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-error-500" /> {aadhaarError}
                    </p>
                  )}
                  <p className="text-xs text-stone-400 mt-2 flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> {t('aadhaar_encrypted')}
                  </p>
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={sending || aadhaar.length !== 12}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {sending ? (<><Loader2 className="w-5 h-5 animate-spin" /> {t('sending_otp')}</>) : (<>{t('send_otp')} <ArrowRight className="w-4.5 h-4.5" /></>)}
                </button>

                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-stone-200" />
                  <span className="text-xs text-stone-400">{t('demo_any_12')}</span>
                  <div className="flex-1 h-px bg-stone-200" />
                </div>

                <button onClick={() => setAadhaar('123456789012')} className="w-full text-sm text-stone-500 hover:text-primary-600 transition-colors py-2">
                  {t('use_sample_aadhaar')}
                </button>
              </div>
            </div>
          )}

          {/* Step: OTP */}
          {step === 'otp' && (
            <div className="animate-fade-in-up">
              <button onClick={handleBack} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> {t('back')}
              </button>
              <div className="mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mb-4"><Phone className="w-7 h-7 text-primary-600" /></div>
                <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">{t('verify_otp')}</h2>
                <p className="text-sm text-stone-500">{t('otp_sent')} <span className="font-semibold text-stone-700"> {maskedAadhaar || t('your_aadhaar')}</span>.</p>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-3 block">{t('enter_otp')}</label>
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
                          otpError ? 'border-error-300 focus:border-error-400 focus:ring-error-100' : digit ? 'border-primary-400 focus:border-primary-500 focus:ring-primary-100' : 'border-stone-200 focus:border-primary-400 focus:ring-primary-100'
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
                  {verifying ? (<><Loader2 className="w-5 h-5 animate-spin" /> {t('verifying')}</>) : (<><Check className="w-5 h-5" /> {t('verify_continue')}</>)}
                </button>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">{t('didnt_receive')}</span>
                  <button onClick={handleResend} disabled={resendTimer > 0} className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 disabled:text-stone-400 disabled:pointer-events-none font-medium transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                    {resendTimer > 0 ? `${t('resend_in')} ${resendTimer}s` : t('resend_otp')}
                  </button>
                </div>

                <div className="bg-accent-50 border border-accent-200 rounded-xl p-3 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-accent-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-stone-600 leading-relaxed">
                    <span className="font-semibold">{t('demo_mode')}</span> {t('demo_mode_desc')}
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
              <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">{t('verified')}</h2>
              <p className="text-sm text-stone-500 mb-1">{t('welcome_user')}, {artisan.name}.</p>
              <p className="text-xs text-stone-400">{t('taking_dashboard')}</p>
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
