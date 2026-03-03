import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <AdminLayout title="Söhbətlər">
            <Head title="Söhbətlər" />
            <div className="p-6 text-center">Tezliklə...</div>
        </AdminLayout>
    );
}
