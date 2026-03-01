import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Card } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import { ArrowLeft, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Create({ availableDrivers }) {
    const { data, setData, post, processing, errors } = useForm({
        driver: '',
        name: '',
        credentials: {},
        settings: {},
    });

    const [selectedDriver, setSelectedDriver] = useState(null);

    useEffect(() => {
        if (data.driver) {
            const driverInfo = availableDrivers.find(d => d.identifier === data.driver);
            setSelectedDriver(driverInfo);

            // Initialize credentials from fields
            const initialCreds = {};
            driverInfo?.credential_fields.forEach(field => {
                initialCreds[field.name] = '';
            });
            setData('credentials', initialCreds);
        }
    }, [data.driver]);

    const submit = (e) => {
        e.preventDefault();
        post('/panel/channels');
    };

    return (
        <AdminLayout title="Yeni Kanal">
            <Head title="Yeni Kanal" />
            <div className="mb-6"><Link href="/panel/channels" className="text-sm flex items-center gap-2 text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Geri qayıt</Link></div>

            <Card className="max-w-2xl mx-auto p-6">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Platforma Seçin</label>
                        <select
                            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            value={data.driver}
                            onChange={(e) => setData('driver', e.target.value)}
                        >
                            <option value="">Seçin...</option>
                            {availableDrivers.map(d => (
                                <option key={d.identifier} value={d.identifier}>{d.name}</option>
                            ))}
                        </select>
                        {errors.driver && <div className="text-destructive text-sm mt-1">{errors.driver}</div>}
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Kanal Adı</label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Məs: WhatsApp Rəsmi"
                        />
                        {errors.name && <div className="text-destructive text-sm mt-1">{errors.name}</div>}
                    </div>

                    {selectedDriver && (
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-sm font-semibold">Driver-ə Məxsus Məlumatlar</h3>
                            {selectedDriver.credential_fields.map(field => (
                                <div key={field.name}>
                                    <label className="text-sm font-medium mb-1 block">
                                        {field.label} {field.required && <span className="text-destructive">*</span>}
                                    </label>
                                    <Input
                                        type={field.type === 'password' ? 'password' : 'text'}
                                        required={field.required}
                                        value={data.credentials[field.name] || ''}
                                        onChange={(e) => {
                                            const newCreds = { ...data.credentials, [field.name]: e.target.value };
                                            setData('credentials', newCreds);
                                        }}
                                        placeholder={field.help}
                                    />
                                    {field.help && <p className="text-xs text-muted-foreground mt-1">{field.help}</p>}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={processing || !data.driver}>
                            <Save className="h-4 w-4" /> {processing ? 'Yaradılır...' : 'Kanalı Yarat'}
                        </Button>
                    </div>
                </form>
            </Card>
        </AdminLayout>
    );
}
