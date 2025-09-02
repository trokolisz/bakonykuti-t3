import { ReactNode } from 'react'
import AdminAuthWrapper from '~/components/admin/AdminAuthWrapper'

export default function AdminLayout({
    children,
}: {
    children: ReactNode
}) {
    return (
        <AdminAuthWrapper>
            {children}
        </AdminAuthWrapper>
    )
}