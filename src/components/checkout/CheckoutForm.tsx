'use client';

import { useState, useEffect } from 'react';
import { ordersApi } from '@/lib/api/orders';

interface CheckoutFormProps {
    user: any;
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
}

export default function CheckoutForm({ user, onSubmit, isSubmitting }: CheckoutFormProps) {
    const [formData, setFormData] = useState({
        // Payment
        payment_method: 'cash_on_delivery',
        payment_data: {},

        // Shipping
        shipping_provider: 'speedy',
        shipping_method: 'office',
        shipping_office_id: '',
        shipping_office_name: '',
        shipping_office_address: '',

        // Shipping address
        shipping_address: {
            first_name: '',
            last_name: '',
            company: '',
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'Bulgaria',
            phone: '',
            email: '',
        },

        // Guest checkout
        guest_name: '',
        guest_email: '',
        guest_phone: '',

        // Invoice
        requires_invoice: false,
        invoice_company_name: '',
        invoice_tax_number: '',
        invoice_address: '',

        // Misc
        notes: '',
    });

    const [offices, setOffices] = useState<any[]>([]);
    const [loadingOffices, setLoadingOffices] = useState(false);

    useEffect(() => {
        if (formData.shipping_method === 'office') {
            loadOffices();
        }
    }, [formData.shipping_provider, formData.shipping_method]);

    const loadOffices = async () => {
        setLoadingOffices(true);
        try {
            const officesData = await ordersApi.getShippingOffices(
                formData.shipping_provider,
                formData.shipping_address.city
            );
            setOffices(officesData);
        } catch (error) {
            console.error('Failed to load offices:', error);
        } finally {
            setLoadingOffices(false);
        }
    };

    const handleOfficeChange = (officeId: string) => {
        const office = offices.find((o) => o.id === officeId);
        if (office) {
            setFormData({
                ...formData,
                shipping_office_id: office.id,
                shipping_office_name: office.name,
                shipping_office_address: office.address,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare data for submission
        const submitData: any = {
            payment_method: formData.payment_method,
            payment_data: formData.payment_data,
            shipping_provider: formData.shipping_provider,
            shipping_method: formData.shipping_method,
        };

        // Add shipping address only if method is 'address'
        if (formData.shipping_method === 'address') {
            submitData.shipping_address = {
                first_name: formData.shipping_address.first_name?.trim(),
                last_name: formData.shipping_address.last_name?.trim(),
                company: formData.shipping_address.company?.trim() || undefined,
                address_line1: formData.shipping_address.address_line1?.trim(),
                address_line2: formData.shipping_address.address_line2?.trim() || undefined,
                city: formData.shipping_address.city?.trim(),
                state: formData.shipping_address.state?.trim() || undefined,
                postal_code: formData.shipping_address.postal_code?.trim() || undefined,
                country: formData.shipping_address.country?.trim() || 'Bulgaria',
                phone: formData.shipping_address.phone?.trim(),
                email: formData.shipping_address.email?.trim() || undefined,
            };
        }

        // Add office data only if method is 'office' and office is selected
        if (formData.shipping_method === 'office') {
            // Only include if office_id is selected (required field)
            if (formData.shipping_office_id && formData.shipping_office_id.trim()) {
                submitData.shipping_office_id = formData.shipping_office_id.trim();
                // Include name and address if available
                if (formData.shipping_office_name && formData.shipping_office_name.trim()) {
                    submitData.shipping_office_name = formData.shipping_office_name.trim();
                }
                if (formData.shipping_office_address && formData.shipping_office_address.trim()) {
                    submitData.shipping_office_address = formData.shipping_office_address.trim();
                }
            }
            // If no office selected, don't include these fields (validation will catch it)
        }

        // Guest data only if not logged in
        if (!user) {
            submitData.guest_name = formData.guest_name?.trim() || undefined;
            submitData.guest_email = formData.guest_email?.trim() || undefined;
            submitData.guest_phone = formData.guest_phone?.trim() || undefined;
        }

        // Invoice data
        if (formData.requires_invoice) {
            submitData.requires_invoice = true;
            submitData.invoice_company_name = formData.invoice_company_name || undefined;
            submitData.invoice_tax_number = formData.invoice_tax_number || undefined;
            submitData.invoice_address = formData.invoice_address || undefined;
        }

        // Misc
        if (formData.notes) {
            submitData.notes = formData.notes;
        }

        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Guest Information */}
            {!user && (
                <section className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Лична информация</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Име <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.guest_name}
                                onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Телефон <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                required
                                value={formData.guest_phone}
                                onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Имейл <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.guest_email}
                                onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Shipping */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Доставка</h2>

                {/* Courier Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Куриер <span className="text-red-500">*</span></label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="speedy"
                                checked={formData.shipping_provider === 'speedy'}
                                onChange={(e) => setFormData({ ...formData, shipping_provider: e.target.value })}
                                className="mr-2"
                            />
                            Спиди
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="econt"
                                checked={formData.shipping_provider === 'econt'}
                                onChange={(e) => setFormData({ ...formData, shipping_provider: e.target.value })}
                                className="mr-2"
                            />
                            Еконт
                        </label>
                    </div>
                </div>

                {/* Delivery Method */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Метод на доставка <span className="text-red-500">*</span></label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="office"
                                checked={formData.shipping_method === 'office'}
                                onChange={(e) => setFormData({ ...formData, shipping_method: e.target.value })}
                                className="mr-2"
                            />
                            До офис
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="address"
                                checked={formData.shipping_method === 'address'}
                                onChange={(e) => setFormData({ ...formData, shipping_method: e.target.value })}
                                className="mr-2"
                            />
                            До адрес
                        </label>
                    </div>
                </div>

                {/* Office Selection */}
                {formData.shipping_method === 'office' && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Изберете офис <span className="text-red-500">*</span>
                        </label>
                        {loadingOffices ? (
                            <p>Зареждане на офиси...</p>
                        ) : (
                            <select
                                required
                                value={formData.shipping_office_id}
                                onChange={(e) => handleOfficeChange(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md"
                            >
                                <option value="">Изберете офис</option>
                                {offices.map((office) => (
                                    <option key={office.id} value={office.id}>
                                        {office.name} - {office.address}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                )}

                {/* Address Form */}
                {formData.shipping_method === 'address' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Име <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.shipping_address.first_name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            shipping_address: { ...formData.shipping_address, first_name: e.target.value },
                                        })
                                    }
                                    className="w-full px-4 py-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Фамилия <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.shipping_address.last_name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            shipping_address: { ...formData.shipping_address, last_name: e.target.value },
                                        })
                                    }
                                    className="w-full px-4 py-2 border rounded-md"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Адрес <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.shipping_address.address_line1}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        shipping_address: { ...formData.shipping_address, address_line1: e.target.value },
                                    })
                                }
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Град <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.shipping_address.city}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            shipping_address: { ...formData.shipping_address, city: e.target.value },
                                        })
                                    }
                                    className="w-full px-4 py-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Пощенски код</label>
                                <input
                                    type="text"
                                    value={formData.shipping_address.postal_code}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            shipping_address: { ...formData.shipping_address, postal_code: e.target.value },
                                        })
                                    }
                                    className="w-full px-4 py-2 border rounded-md"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Телефон <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                required
                                value={formData.shipping_address.phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        shipping_address: { ...formData.shipping_address, phone: e.target.value },
                                    })
                                }
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>
                    </div>
                )}
            </section>

            {/* Payment */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Начин на плащане</h2>
                <div className="space-y-3">
                    <label className="flex items-start p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                            type="radio"
                            value="cash_on_delivery"
                            checked={formData.payment_method === 'cash_on_delivery'}
                            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                            className="mt-1 mr-3"
                        />
                        <div>
                            <div className="font-medium">Наложен платеж</div>
                            <div className="text-sm text-gray-600">Плащате при получаване на пратката</div>
                        </div>
                    </label>
                    <label className="flex items-start p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                            type="radio"
                            value="bank_transfer"
                            checked={formData.payment_method === 'bank_transfer'}
                            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                            className="mt-1 mr-3"
                        />
                        <div>
                            <div className="font-medium">Банков превод</div>
                            <div className="text-sm text-gray-600">Превод към банкова сметка</div>
                        </div>
                    </label>
                    <label className="flex items-start p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                            type="radio"
                            value="card_online"
                            checked={formData.payment_method === 'card_online'}
                            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                            className="mt-1 mr-3"
                        />
                        <div>
                            <div className="font-medium">Плащане с карта</div>
                            <div className="text-sm text-gray-600">Плащане с дебитна/кредитна карта</div>
                        </div>
                    </label>
                    <label className="flex items-start p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                            type="radio"
                            value="paypal"
                            checked={formData.payment_method === 'paypal'}
                            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                            className="mt-1 mr-3"
                        />
                        <div>
                            <div className="font-medium">PayPal</div>
                            <div className="text-sm text-gray-600">Плащане чрез PayPal</div>
                        </div>
                    </label>
                </div>
            </section>

            {/* Invoice */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Фактура</h2>
                <label className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        checked={formData.requires_invoice}
                        onChange={(e) => setFormData({ ...formData, requires_invoice: e.target.checked })}
                        className="mr-2"
                    />
                    Искам фактура
                </label>
                {formData.requires_invoice && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Име на фирмата <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required={formData.requires_invoice}
                                value={formData.invoice_company_name}
                                onChange={(e) => setFormData({ ...formData, invoice_company_name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                ДДС номер <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required={formData.requires_invoice}
                                value={formData.invoice_tax_number}
                                onChange={(e) => setFormData({ ...formData, invoice_tax_number: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Адрес за фактура <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required={formData.requires_invoice}
                                value={formData.invoice_address}
                                onChange={(e) => setFormData({ ...formData, invoice_address: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md"
                                rows={3}
                            />
                        </div>
                    </div>
                )}
            </section>

            {/* Notes */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Допълнителни бележки</h2>
                <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                    rows={4}
                    placeholder="Имате ли допълнителни изисквания?"
                />
            </section>

            {/* Submit Button */}
            <div className="bg-white p-6 rounded-lg shadow">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-white py-4 px-6 rounded-md font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Обработва се...' : 'Завършване на поръчката'}
                </button>
            </div>
        </form>
    );
}

