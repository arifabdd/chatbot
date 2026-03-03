import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <AdminLayout title="Kontaktlar">
            <Head title="Kontaktlar" />
            <div className="p-6 text-center">Tezliklə...</div>
        </AdminLayout>
    );
}
