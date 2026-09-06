import { useState } from 'react';
import { MapPin, Plus, Check, Home, Building2, Phone, X } from 'lucide-react';
import { buyerAddresses as initialAddresses } from '@/data';
import { useLanguage } from '@/language-context';
import type { BuyerAddress } from '@/types';

export function BuyerAddresses() {
  const { t } = useLanguage();
  const [addresses, setAddresses] = useState<BuyerAddress[]>(initialAddresses);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ label: '', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const handleSave = () => {
    if (!form.label.trim() || !form.name.trim() || !form.line1.trim() || !form.city.trim() || !form.pincode.trim()) return;
    const newAddress: BuyerAddress = {
      id: `a${Date.now()}`,
      label: form.label, name: form.name, phone: form.phone,
      line1: form.line1, line2: form.line2, city: form.city, state: form.state, pincode: form.pincode,
      isDefault: addresses.length === 0,
    };
    setAddresses(prev => [...prev, newAddress]);
    setForm({ label: '', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });
    setShowModal(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-display font-bold text-lg text-stone-900">{t('saved_addresses')}</h3>
          <p className="text-sm text-stone-500">{t('saved_addresses_desc')}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary"><Plus className="w-4 h-4" /> {t('add_address')}</button>
      </div>

      {addresses.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-stone-300" />
          </div>
          <p className="text-sm font-medium text-stone-600 mb-1">{t('no_addresses')}</p>
          <p className="text-xs text-stone-400">{t('no_addresses_desc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr, idx) => (
            <div key={addr.id} className="card card-hover p-5 animate-fade-in-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    {addr.label.toLowerCase() === 'home' ? <Home className="w-5 h-5 text-primary-600" /> : <Building2 className="w-5 h-5 text-primary-600" />}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900 text-sm">{addr.label}</p>
                    {addr.isDefault && <span className="badge bg-success-100 text-success-700 text-[10px]">{t('default_address')}</span>}
                  </div>
                </div>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-primary-600 hover:text-primary-700 font-medium">{t('set_default')}</button>
                )}
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-stone-800">{addr.name}</p>
                <p className="text-xs text-stone-500 leading-relaxed">{addr.line1}</p>
                {addr.line2 && <p className="text-xs text-stone-500 leading-relaxed">{addr.line2}</p>}
                <p className="text-xs text-stone-500">{addr.city}, {addr.state} — {addr.pincode}</p>
                <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-2"><Phone className="w-3 h-3" /> {addr.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-card-hover w-full max-w-md p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-lg text-stone-900">{t('add_address')}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"><X className="w-5 h-5 text-stone-500" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">{t('address_label')}</label>
                <input type="text" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="Home" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">{t('full_name')}</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Priya Sharma" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">{t('phone_number')}</label>
                  <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="input-field" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">{t('address_line1')}</label>
                <input type="text" value={form.line1} onChange={e => setForm({ ...form, line1: e.target.value })} placeholder="Flat 402, Green Meadows" className="input-field" />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">{t('address_line2')}</label>
                <input type="text" value={form.line2} onChange={e => setForm({ ...form, line2: e.target.value })} placeholder="HSR Layout, Sector 2" className="input-field" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">{t('city')}</label>
                  <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Bengaluru" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">{t('state')}</label>
                  <input type="text" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="Karnataka" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">{t('pincode')}</label>
                  <input type="text" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} placeholder="560102" className="input-field" />
                </div>
              </div>
            </div>
            <button onClick={handleSave} className="btn-primary w-full mt-5"><Check className="w-4 h-4" /> {t('save_address')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
