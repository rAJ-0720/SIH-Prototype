import { useState } from 'react';
import { CreditCard, Plus, Check, Smartphone, Banknote, X } from 'lucide-react';
import { buyerPayments as initialPayments } from '@/data';
import { useLanguage } from '@/language-context';
import type { BuyerPayment } from '@/types';
import type { TKey } from '@/i18n';

const typeKeyMap: Record<BuyerPayment['type'], TKey> = {
  upi: 'upi', card: 'card', netbanking: 'netbanking',
};

const typeIconMap: Record<BuyerPayment['type'], typeof CreditCard> = {
  upi: Smartphone, card: CreditCard, netbanking: Banknote,
};

const typeColorMap: Record<BuyerPayment['type'], string> = {
  upi: 'bg-success-100 text-success-600',
  card: 'bg-primary-100 text-primary-600',
  netbanking: 'bg-accent-100 text-accent-600',
};

export function BuyerPayments() {
  const { t } = useLanguage();
  const [payments, setPayments] = useState<BuyerPayment[]>(initialPayments);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: 'upi' as BuyerPayment['type'], detail: '' });

  const handleSetDefault = (id: string) => {
    setPayments(prev => prev.map(p => ({ ...p, isDefault: p.id === id })));
  };

  const handleSave = () => {
    if (!form.detail.trim()) return;
    const newPayment: BuyerPayment = {
      id: `pay${Date.now()}`, type: form.type, label: t(typeKeyMap[form.type]),
      detail: form.detail, isDefault: payments.length === 0,
    };
    setPayments(prev => [...prev, newPayment]);
    setForm({ type: 'upi', detail: '' });
    setShowModal(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-display font-bold text-lg text-stone-900">{t('payment_methods')}</h3>
          <p className="text-sm text-stone-500">{t('payment_methods_desc')}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary"><Plus className="w-4 h-4" /> {t('add_payment')}</button>
      </div>

      {payments.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-stone-300" />
          </div>
          <p className="text-sm font-medium text-stone-600 mb-1">{t('no_payments')}</p>
          <p className="text-xs text-stone-400">{t('no_payments_desc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {payments.map((payment, idx) => {
            const Icon = typeIconMap[payment.type];
            return (
              <div key={payment.id} className="card card-hover p-5 animate-fade-in-up" style={{ animationDelay: `${idx * 60}ms` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeColorMap[payment.type]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900 text-sm">{t(typeKeyMap[payment.type])}</p>
                      {payment.isDefault && <span className="badge bg-success-100 text-success-700 text-[10px]">{t('default_payment')}</span>}
                    </div>
                  </div>
                  {!payment.isDefault && (
                    <button onClick={() => handleSetDefault(payment.id)} className="text-xs text-primary-600 hover:text-primary-700 font-medium">{t('set_default')}</button>
                  )}
                </div>
                <p className="text-sm text-stone-600 font-mono tracking-wide">{payment.detail}</p>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-card-hover w-full max-w-md p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-lg text-stone-900">{t('add_payment')}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"><X className="w-5 h-5 text-stone-500" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-stone-700 mb-2 block">{t('payment_methods')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['upi', 'card', 'netbanking'] as BuyerPayment['type'][]).map(pt => {
                    const Icon = typeIconMap[pt];
                    return (
                      <button key={pt} onClick={() => setForm({ ...form, type: pt })}
                        className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border-2 transition-all ${form.type === pt ? 'border-primary-400 bg-primary-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                        <Icon className={`w-5 h-5 ${form.type === pt ? 'text-primary-600' : 'text-stone-400'}`} />
                        <span className={`text-xs font-medium ${form.type === pt ? 'text-primary-700' : 'text-stone-500'}`}>{t(typeKeyMap[pt])}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                  {form.type === 'upi' ? 'UPI ID' : form.type === 'card' ? t('card') : t('netbanking')}
                </label>
                <input type="text" value={form.detail} onChange={e => setForm({ ...form, detail: e.target.value })}
                  placeholder={form.type === 'upi' ? 'name@okhdfcbank' : form.type === 'card' ? '•••• •••• •••• 4521' : 'HDFC Bank'} className="input-field" />
              </div>
            </div>
            <button onClick={handleSave} className="btn-primary w-full mt-5"><Check className="w-4 h-4" /> {t('save_address')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
